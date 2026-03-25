#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "opencv-python>=4.8",
#     "numpy",
# ]
# ///
"""Convert a reference image to a stylised SVG line drawing.

Requires: brew install potrace

Usage:
    uv run tools/image-to-svg.py photo.jpg -o drawing.svg
    uv run tools/image-to-svg.py photo.jpg -o drawing.svg --method canny
    uv run tools/image-to-svg.py photo.jpg -o drawing.svg --animate
"""

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np


def detect_edges_xdog(
    image: np.ndarray,
    sigma: float = 0.5,
    k: float = 1.6,
    tau: float = 0.99,
    epsilon: float = 0.0,
    phi: float = 200.0,
) -> np.ndarray:
    """eXtended Difference of Gaussians --- ink-drawing style edges."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float64) / 255.0
    g1 = cv2.GaussianBlur(gray, (0, 0), sigma)
    g2 = cv2.GaussianBlur(gray, (0, 0), sigma * k)
    dog = g1 - tau * g2
    result = np.where(
        dog >= epsilon,
        1.0,
        1.0 + np.tanh(phi * (dog - epsilon)),
    )
    return ((1.0 - result) * 255).astype(np.uint8)


def detect_edges_canny(
    image: np.ndarray,
    low: int = 50,
    high: int = 150,
) -> np.ndarray:
    """Canny edge detection with bilateral pre-filter for cleaner lines."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    smooth = cv2.bilateralFilter(gray, 9, 75, 75)
    return cv2.Canny(smooth, low, high)


def resize_if_needed(image: np.ndarray, max_size: int) -> np.ndarray:
    h, w = image.shape[:2]
    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        image = cv2.resize(
            image, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA
        )
        print(f"Resized to {image.shape[1]}x{image.shape[0]}", file=sys.stderr)
    return image


def vectorise(edges: np.ndarray, turdsize: int = 2, alphamax: float = 1.0) -> str:
    """Trace edge image to SVG using potrace.

    Expects white (255) = edge, black (0) = background.
    Potrace traces black foreground, so we invert before tracing.
    """
    inverted = 255 - edges

    with tempfile.NamedTemporaryFile(suffix=".bmp", delete=False) as f:
        tmp = Path(f.name)
        cv2.imwrite(str(tmp), inverted)

    try:
        result = subprocess.run(
            [
                "potrace", "--svg",
                "-t", str(turdsize),
                "-a", str(alphamax),
                "-o", "-",
                str(tmp),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        svg = result.stdout
        svg = re.sub(r"<\?xml[^?]*\?>\s*", "", svg)
        svg = re.sub(r"<!DOCTYPE[^>]*>\s*", "", svg)
        svg = re.sub(r'\s*width="[^"]*pt"', "", svg)
        svg = re.sub(r'\s*height="[^"]*pt"', "", svg)
        return svg
    finally:
        tmp.unlink(missing_ok=True)


def inject_animation(svg: str) -> str:
    """Add CSS wobble animation for organic movement via string surgery."""
    style_block = (
        "<style>"
        "@keyframes wobble{"
        "0%,100%{transform:translate(0,0) rotate(0deg)}"
        "25%{transform:translate(2px,-1.5px) rotate(0.3deg)}"
        "50%{transform:translate(-1.5px,2px) rotate(-0.3deg)}"
        "75%{transform:translate(-2px,-1px) rotate(0.15deg)}"
        "}"
        ".wobble{animation:wobble 8s ease-in-out infinite}"
        "@media(prefers-reduced-motion:reduce){.wobble{animation:none}}"
        "</style>"
    )

    svg = re.sub(r"(<svg[^>]*>)", rf"\1{style_block}", svg, count=1)
    svg = re.sub(r"(<g\b[^>]*>)", r'<g class="wobble">\1', svg, count=1)
    svg = re.sub(r"(</g>\s*</svg>)", r"</g>\1", svg, count=1)
    return svg


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Convert a reference image to a stylised SVG line drawing."
    )
    parser.add_argument("input", type=Path, help="input image")
    parser.add_argument(
        "-o", "--output", type=Path, help="output SVG (default: input with .svg)"
    )
    parser.add_argument(
        "--method", choices=["xdog", "canny"], default="xdog",
        help="edge detection method (default: xdog)",
    )
    parser.add_argument(
        "--animate", action="store_true",
        help="add subtle organic movement animation",
    )
    parser.add_argument(
        "--max-size", type=int, default=800,
        help="max image dimension for processing (default: 800)",
    )
    return parser


def main(argv: list[str] | None = None) -> None:
    args = build_parser().parse_args(argv)

    if args.output is None:
        args.output = args.input.with_suffix(".svg")

    if not shutil.which("potrace"):
        print(
            "Error: potrace not found. Install with: brew install potrace",
            file=sys.stderr,
        )
        sys.exit(1)

    image = cv2.imread(str(args.input))
    if image is None:
        print(f"Error: could not read {args.input}", file=sys.stderr)
        sys.exit(1)

    image = resize_if_needed(image, args.max_size)

    print(f"Detecting edges ({args.method})...", file=sys.stderr)
    if args.method == "xdog":
        edges = detect_edges_xdog(image)
    else:
        edges = detect_edges_canny(image)

    print("Vectorising with potrace...", file=sys.stderr)
    svg = vectorise(edges)

    if args.animate:
        print("Adding animation...", file=sys.stderr)
        svg = inject_animation(svg)

    args.output.write_text(svg)
    print(f"Written to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
