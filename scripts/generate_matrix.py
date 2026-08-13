#!/usr/bin/env python
"""Regenerate capability-matrix/README.md from data/capabilities.yaml.

Requires PyYAML (`pip install pyyaml`) - not bundled, so the matrix
table is also committed as plain markdown and can be hand-edited if
you don't want the extra dependency.
"""
import pathlib
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "capabilities.yaml"
OUT = ROOT / "capability-matrix" / "README.md"

HEADER = """# Capability Matrix

> Generated from [`data/capabilities.yaml`](../data/capabilities.yaml) by
> [`scripts/generate_matrix.py`](../scripts/generate_matrix.py). Edit the YAML,
> not this file.

Each row maps a capability to its DoD ZT RA 2.0 pillar, describes what the
capability looks like at each maturity stage (Traditional / Advanced /
Optimal), and lists informal tie-ins to common regulatory / control
frameworks. Framework references are illustrative starting points for your
own compliance mapping, not a compliance attestation.

| Pillar | Capability | Traditional | Advanced | Optimal | Framework tie-ins |
|---|---|---|---|---|---|
"""


def main():
    entries = yaml.safe_load(DATA.read_text(encoding="utf-8"))
    rows = []
    for e in entries:
        fw = "<br>".join(f"{f['framework']} ({f['ref']})" for f in e.get("frameworks", []))
        rows.append(
            f"| {e['pillar']} | {e['capability']} | {e['traditional']} | "
            f"{e['advanced']} | {e['optimal']} | {fw} |"
        )
    OUT.write_text(HEADER + "\n".join(rows) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(rows)} rows)")


if __name__ == "__main__":
    main()
