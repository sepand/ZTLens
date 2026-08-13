# Contributing

Contributions that improve accuracy, add capability examples, or expand
framework mappings are welcome.

## Ways to contribute

- **Add a capability** — open an issue or PR adding an entry to
  [`data/capabilities.yaml`](data/capabilities.yaml), then regenerate
  [`capability-matrix/README.md`](capability-matrix/README.md) with
  `python scripts/generate_matrix.py` (requires `pip install pyyaml`).
- **Correct a mapping** — if a framework tie-in in
  [`/mappings`](mappings/) or the capability matrix is inaccurate or outdated,
  open a PR with the correction and a citation to the primary source.
- **Add or refine a diagram** — [`/diagrams`](diagrams/) uses Mermaid;
  no extra tooling needed since GitHub renders it natively.
- **Improve a pillar page** — [`/pillars`](pillars/).
- **Add a glossary term** — [`/glossary`](glossary/).

## Ground rules

- Cite primary sources (NIST, DoD, CISA, framework publishers) for factual claims.
- Keep examples generic/hypothetical — no real organization's specific controls or incidents.
- This repo is an independent educational reference, not an official publication of any agency. Keep language and framing consistent with that disclaimer (see [README.md](README.md)).

## Issue templates

When filing an issue, please indicate whether it's:
- **Add a capability** — new row for the capability matrix
- **Correct a mapping** — a framework tie-in that's wrong or missing
- **Other** — anything else (typos, structure, new diagrams, etc.)
