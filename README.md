# Zero Trust Reference Guide

An independent, community-oriented reference for understanding and implementing Zero Trust (ZT) architecture — built around the **DoD Zero Trust Reference Architecture (RA) 2.0** and **NIST SP 800-207**, cross-walked to widely used regulatory and industry frameworks.

This repo exists to make Zero Trust concepts approachable: what the pillars mean, what "maturity" looks like in practice, and how ZT capabilities map to the compliance frameworks most teams actually have to satisfy (NIST 800-53, PCI-DSS, GLBA, NYDFS 500, SOX, etc.).

> **Disclaimer:** This is an independent educational interpretation of publicly available Zero Trust guidance. It is **not** an official DoD, NIST, CISA, or any other agency/vendor publication, and is not affiliated with or endorsed by any employer of the maintainer. Always consult primary sources (linked below) for authoritative requirements.

## Why Zero Trust

Traditional network security assumes that anything inside the perimeter can be trusted. Zero Trust starts from the opposite assumption: **no user, device, or workload is trusted by default — regardless of location** — and every access request must be explicitly verified, authorized, and continuously evaluated.

Two foundational references anchor this repo:

- **[DoD Zero Trust Reference Architecture 2.0](https://dodcio.defense.gov/Portals/0/Documents/Library/(U)ZT_RA_v2.0(U)_Sep22.pdf)** — defines 7 pillars and a capability-based maturity model (Traditional → Advanced → Optimal).
- **[NIST SP 800-207: Zero Trust Architecture](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-207.pdf)** — defines the tenets, logical components, and deployment models of ZTA.

## How this repo is organized

| Folder | Contents |
|---|---|
| [`/pillars`](pillars/) | One page per DoD ZT pillar: User, Device, Application & Workload, Data, Network & Environment, Automation & Orchestration, Visibility & Analytics |
| [`/capability-matrix`](capability-matrix/) | The core deliverable — capabilities mapped to pillar, maturity stage, and regulatory framework tie-ins |
| [`/mappings`](mappings/) | Cross-walk tables: DoD ZT RA ↔ NIST 800-207 ↔ CISA ZTMM ↔ industry frameworks |
| [`/glossary`](glossary/) | Terms and acronyms used throughout |
| [`/diagrams`](diagrams/) | Architecture and maturity-progression diagrams (Mermaid) |
| [`/examples`](examples/) | Illustrative implementation patterns (no real organization's detail) |
| [`/data`](data/) | Source-of-truth data files (YAML/CSV) that the matrix and mapping tables are generated from |

## Maturity model

Every capability in the matrix is scored across three stages, per DoD ZT RA 2.0:

1. **Traditional** — largely manual, perimeter-based, siloed controls
2. **Advanced** — automated policy enforcement within pillars, some cross-pillar signal sharing
3. **Optimal** — fully automated, dynamic, risk-based enforcement with continuous cross-pillar telemetry

See [`/capability-matrix`](capability-matrix/) for the full table.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Corrections to mappings and additional capability examples are especially welcome.

## License

Content is licensed under [CC BY-SA 4.0](LICENSE) unless otherwise noted.
