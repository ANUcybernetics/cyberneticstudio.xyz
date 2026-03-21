#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "opencv-python>=4.8",
#     "numpy",
#     "pytest",
# ]
# ///
"""Tests for image-to-svg conversion pipeline."""

import shutil
import textwrap
import xml.etree.ElementTree as ET
from pathlib import Path

import cv2
import numpy as np
import pytest

import sys
sys.path.insert(0, str(Path(__file__).parent))
from importlib import import_module

mod = import_module("image-to-svg")
detect_edges_xdog = mod.detect_edges_xdog
detect_edges_canny = mod.detect_edges_canny
resize_if_needed = mod.resize_if_needed
vectorise = mod.vectorise
inject_animation = mod.inject_animation
build_parser = mod.build_parser

requires_potrace = pytest.mark.skipif(
    not shutil.which("potrace"), reason="potrace not installed"
)


@pytest.fixture
def gradient_image() -> np.ndarray:
    """BGR image with smooth gradients that produce meaningful edges."""
    img = np.zeros((100, 150, 3), dtype=np.uint8)
    for y in range(100):
        for x in range(150):
            img[y, x] = (
                int(255 * x / 150),
                int(255 * y / 100),
                int(128 + 127 * np.sin(x * 0.1) * np.cos(y * 0.1)),
            )
    cv2.circle(img, (75, 50), 30, (255, 255, 255), -1)
    return img


@pytest.fixture
def sample_edge_map() -> np.ndarray:
    edges = np.zeros((100, 150), dtype=np.uint8)
    cv2.rectangle(edges, (30, 20), (120, 80), 255, 2)
    cv2.circle(edges, (75, 50), 20, 255, 2)
    return edges


class TestXdog:
    def test_output_shape_matches_input(self, gradient_image: np.ndarray):
        result = detect_edges_xdog(gradient_image)
        assert result.shape == gradient_image.shape[:2]

    def test_output_is_uint8(self, gradient_image: np.ndarray):
        result = detect_edges_xdog(gradient_image)
        assert result.dtype == np.uint8

    def test_output_range(self, gradient_image: np.ndarray):
        result = detect_edges_xdog(gradient_image)
        assert result.min() >= 0
        assert result.max() <= 255

    def test_detects_edges(self, gradient_image: np.ndarray):
        result = detect_edges_xdog(gradient_image)
        assert result.max() > 0, "should detect some edges"

    def test_uniform_image_has_no_edges(self):
        uniform = np.full((50, 50, 3), 128, dtype=np.uint8)
        result = detect_edges_xdog(uniform)
        assert result.max() < 10, "uniform image should have near-zero edges"

    def test_sigma_affects_output(self, gradient_image: np.ndarray):
        thin = detect_edges_xdog(gradient_image, sigma=0.3)
        thick = detect_edges_xdog(gradient_image, sigma=2.0)
        assert not np.array_equal(thin, thick)


class TestCanny:
    def test_output_shape(self, gradient_image: np.ndarray):
        result = detect_edges_canny(gradient_image)
        assert result.shape == gradient_image.shape[:2]

    def test_output_is_binary(self, gradient_image: np.ndarray):
        result = detect_edges_canny(gradient_image)
        unique = set(np.unique(result))
        assert unique <= {0, 255}

    def test_detects_edges(self, gradient_image: np.ndarray):
        result = detect_edges_canny(gradient_image)
        assert result.max() > 0

    def test_uniform_image_has_no_edges(self):
        uniform = np.full((50, 50, 3), 128, dtype=np.uint8)
        result = detect_edges_canny(uniform)
        assert result.max() == 0


class TestResize:
    def test_no_resize_when_within_limit(self):
        img = np.zeros((100, 150, 3), dtype=np.uint8)
        result = resize_if_needed(img, max_size=200)
        assert result.shape == (100, 150, 3)

    def test_resizes_wide_image(self):
        img = np.zeros((400, 800, 3), dtype=np.uint8)
        result = resize_if_needed(img, max_size=400)
        assert result.shape[1] <= 400
        assert result.shape[0] <= 200

    def test_resizes_tall_image(self):
        img = np.zeros((800, 400, 3), dtype=np.uint8)
        result = resize_if_needed(img, max_size=400)
        assert result.shape[0] <= 400
        assert result.shape[1] <= 200

    def test_exact_max_size_no_resize(self):
        img = np.zeros((800, 800, 3), dtype=np.uint8)
        result = resize_if_needed(img, max_size=800)
        assert result.shape[:2] == (800, 800)


MINIMAL_SVG = textwrap.dedent("""\
    <?xml version="1.0" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <g><path d="M 10 10 L 90 90"/></g>
    </svg>""")


class TestInjectAnimation:
    def test_adds_filter_element(self):
        result = inject_animation(MINIMAL_SVG)
        root = ET.fromstring(result)
        ns = "http://www.w3.org/2000/svg"
        filters = root.findall(f".//{{{ns}}}filter")
        assert len(filters) == 1
        assert filters[0].get("id") == "wobble"

    def test_adds_turbulence_and_animate(self):
        result = inject_animation(MINIMAL_SVG)
        root = ET.fromstring(result)
        ns = "http://www.w3.org/2000/svg"
        assert len(root.findall(f".//{{{ns}}}feTurbulence")) == 1
        anims = root.findall(f".//{{{ns}}}animate")
        assert len(anims) == 1
        assert anims[0].get("repeatCount") == "indefinite"

    def test_applies_filter_to_group(self):
        result = inject_animation(MINIMAL_SVG)
        root = ET.fromstring(result)
        ns = "http://www.w3.org/2000/svg"
        groups = root.findall(f".//{{{ns}}}g")
        assert any(g.get("filter") == "url(#wobble)" for g in groups)

    def test_applies_filter_to_paths_when_no_group(self):
        svg_no_group = textwrap.dedent("""\
            <?xml version="1.0"?>
            <svg xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 0 L 10 10"/>
            </svg>""")
        result = inject_animation(svg_no_group)
        root = ET.fromstring(result)
        ns = "http://www.w3.org/2000/svg"
        paths = root.findall(f".//{{{ns}}}path")
        assert any(p.get("filter") == "url(#wobble)" for p in paths)

    def test_output_is_valid_xml(self):
        result = inject_animation(MINIMAL_SVG)
        ET.fromstring(result)

    def test_preserves_existing_defs(self):
        svg_with_defs = textwrap.dedent("""\
            <?xml version="1.0"?>
            <svg xmlns="http://www.w3.org/2000/svg">
            <defs><style>path { fill: black; }</style></defs>
            <path d="M 0 0 L 10 10"/>
            </svg>""")
        result = inject_animation(svg_with_defs)
        root = ET.fromstring(result)
        ns = "http://www.w3.org/2000/svg"
        defs = root.findall(f"{{{ns}}}defs")
        assert len(defs) == 1
        assert len(defs[0].findall(f"{{{ns}}}style")) == 1


@requires_potrace
class TestVectorise:
    def test_produces_svg_output(self, sample_edge_map: np.ndarray):
        svg = vectorise(sample_edge_map)
        assert "<svg" in svg

    def test_svg_contains_paths(self, sample_edge_map: np.ndarray):
        svg = vectorise(sample_edge_map)
        assert "<path" in svg

    def test_turdsize_suppresses_speckles(self):
        noisy = np.zeros((100, 100), dtype=np.uint8)
        noisy[50, 50] = 255
        svg_low = vectorise(noisy, turdsize=0)
        svg_high = vectorise(noisy, turdsize=10)
        assert svg_low.count("<path") >= svg_high.count("<path")

    def test_empty_image_produces_valid_svg(self):
        blank = np.zeros((50, 50), dtype=np.uint8)
        svg = vectorise(blank)
        assert "<svg" in svg


class TestBuildParser:
    def test_default_method_is_xdog(self):
        args = build_parser().parse_args(["test.jpg"])
        assert args.method == "xdog"

    def test_canny_method(self):
        args = build_parser().parse_args(["test.jpg", "--method", "canny"])
        assert args.method == "canny"

    def test_output_flag(self):
        args = build_parser().parse_args(["test.jpg", "-o", "out.svg"])
        assert args.output == Path("out.svg")

    def test_animate_flag(self):
        args = build_parser().parse_args(["test.jpg", "--animate"])
        assert args.animate is True

    def test_default_max_size(self):
        args = build_parser().parse_args(["test.jpg"])
        assert args.max_size == 800


@requires_potrace
class TestEndToEnd:
    def test_xdog_pipeline(self, gradient_image: np.ndarray, tmp_path: Path):
        edges = detect_edges_xdog(gradient_image)
        svg = vectorise(edges)
        out = tmp_path / "test.svg"
        out.write_text(svg)
        assert out.exists()
        assert out.stat().st_size > 0
        assert "<path" in svg

    def test_canny_pipeline(self, gradient_image: np.ndarray):
        edges = detect_edges_canny(gradient_image)
        svg = vectorise(edges)
        assert "<path" in svg

    def test_pipeline_with_animation(self, gradient_image: np.ndarray):
        edges = detect_edges_xdog(gradient_image)
        svg = vectorise(edges)
        svg = inject_animation(svg)
        root = ET.fromstring(svg)
        ns = "http://www.w3.org/2000/svg"
        assert root.findall(f".//{{{ns}}}filter")
        assert root.findall(f".//{{{ns}}}animate")
