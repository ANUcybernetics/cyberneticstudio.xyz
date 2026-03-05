---
title: LLMs Unplugged (SXSW)
description: Build Your Own Language Model with Dick and Jane
---

# LLMs Unplugged

Build Your Own Language Model with Dick and Jane

![bg right:40%](../assets/bg-title.avif)

---

## Icebreaker

![bg left:40%](../assets/hero-news-2026-02-13-brimbank-tech-school-workshop.avif)

introduce yourself to your neighbor(s) and ask them:

- why is a language model called a "language model"?
- what does it mean to "model language"?

---

<!-- _class: impact -->

**activity**

everyone stand up

---

<!-- _class: impact -->

sit down if you

have **never** used ChatGPT

---

<!-- _class: impact -->

sit down if you

haven't used it in the last **month**

---

<!-- _class: impact -->

sit down if you

haven't used it in the last **week**

---

<!-- _class: impact -->

sit down if you

haven't used it in the last **day**

---

<!-- _class: impact -->

sit down if you

haven't used it in the last **hour**

---

<!-- _class: impact -->

sit down if you

haven't used it in the last **5 minutes**

---

## What is this about?

![bg right:40%](../assets/bg-core-insight.avif)

how **language models** work

by exploiting patterns in text to generate new text

---

<!-- _class: banner -->

# Basic training

![bg brightness:0.5](../assets/bg-div-mechanic.avif)

---

**Original text**: _"See Spot run. See Spot jump. Run, Spot, run. Jump, Spot, jump."_

**Preprocessed text**: `see` `spot` `run` `.` `see` `spot` `jump` `.` `run` `,` `spot` `,` `run` `.` `jump` `,` `spot` `,` `jump` `.`

**After training** the model should look like:

|        | `see` | `spot` | `run` | `.` | `jump` | `,` |
| ------ | ----- | ------ | ----- | --- | ------ | --- |
| `see`  |       | II     |       |     |        |     |
| `spot` |       |        | I     |     | I      | II  |
| `run`  |       |        |       | II  |        | I   |
| `.`    | I     |        | I     |     | I      |     |
| `jump` |       |        |       | II  |        | I   |
| `,`    |       | II     | I     |     | I      |     |

---

## The _language_ of language models

![bg right:60%](../assets/bg-markov.avif)

- model
- token
- vocabulary
- training

---

<!-- _class: banner -->

# Basic inference

![bg brightness:0.5](../assets/bg-div-lessons.avif)

---

Our trained model grid from earlier:

|        | `see` | `spot` | `run` | `.` | `jump` | `,` |
| ------ | ----- | ------ | ----- | --- | ------ | --- |
| `see`  |       | II     |       |     |        |     |
| `spot` |       |        | I     |     | I      | II  |
| `run`  |       |        |       | II  |        | I   |
| `.`    | I     |        | I     |     | I      |     |
| `jump` |       |        |       | II  |        | I   |
| `,`    |       | II     | I     |     | I      |     |

---

<!-- _class: banner -->

# Shareback

![bg brightness:0.5](../assets/bg-div-reception.avif)

---

## The _language_ of language models

![bg cover right:60%](../assets/bg-shannon.avif)

- prompt
- completion/response/prediction
- context window
- sampling

---

<!-- _class: banner -->

# Pre-trained bigram model

![bg brightness:0.3](../assets/bg-div-historical.avif)

---

<div style="display: grid; place-items: center; height: 100%;">
  <img src="../assets/bigram-booklet-excerpt.png" style="width: 90%;" alt="Bigram booklet excerpt">
</div>

---

<!-- _class: banner -->

# Shareback

![bg brightness:0.5](../assets/bg-div-reception.avif)

---

## The _language_ of language models

![bg right:60%](../assets/bg-design-goals.avif)

- pre-training
- foundation model

---

## Reflection

![bg right:60%](../assets/bg-randomness.avif)

- how has this workshop changed how you **think** about language models?
- how has this workshop changed how you will **use** language models?

---

<div style="display: grid; place-items: center; height: 100%;">
  <img src="../assets/cybernetic-studio-banner.jpg" style="width: 90%;" alt="Cybernetic Studio banner">
</div>

---

# Studio launch party

![bg contain brightness:0.3](../assets/cybernetic-studio-banner.jpg)

**Has this been fun? Keen for more?**

**Join us tomorrow as we officially launch the Cybernetic Studio.**

- Wednesday 4pm-6pm
- Private Kitchen, Chippendale
- Free for SXSW badgeholders (places limited)
- Bookmark in SXSW app (search for _Cybernetic Studio Launch_)

---

<!-- _class: anu-logo -->
