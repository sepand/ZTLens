# Framework Cross-Walk

Informal mapping between major Zero Trust frameworks and common regulatory /
control frameworks. These are starting points for building your own
compliance crosswalk — not a substitute for formal control mapping or audit
guidance.

## ZT framework cross-walk

| DoD ZT RA 2.0 Pillar | NIST SP 800-207 Concept | CISA ZTMM Pillar |
|---|---|---|
| User | Subject (user) trust evaluation, §3.1 | Identity |
| Device | Device trust evaluation, §3.3 | Devices |
| Application & Workload | Application access, §3.4 | Applications & Workloads |
| Data | Resource (data) protection, §2 | Data |
| Network & Environment | Network segmentation & PEP placement, §3.4 | Networks |
| Automation & Orchestration | Policy Decision Point / Policy Enforcement Point, §3.2 | (cross-cutting) |
| Visibility & Analytics | Continuous diagnostics & telemetry, §3.5 | (cross-cutting) |

## Regulatory / industry framework tie-ins by pillar

| Pillar | NIST 800-53 | PCI-DSS v4.0 | GLBA Safeguards Rule | NYDFS 500 | SOX (ITGC) |
|---|---|---|---|---|---|
| User | IA-2, IA-8 | Req. 8 | 16 CFR 314.4(c) | 500.12 | Access Management |
| Device | CM-8 | Req. 12.5 | 16 CFR 314.4(c) | — | — |
| Application & Workload | SA-11 | Req. 1.3, 6 | — | — | Change Management |
| Data | RA-2, SC-8 | Req. 3, 4 | 16 CFR 314.4(c) | 500.03, 500.15 | — |
| Network & Environment | SC-8, SC-7 | Req. 1 | — | — | — |
| Automation & Orchestration | IR-4 | — | — | 500.16 | — |
| Visibility & Analytics | AU-6, RA-3 | Req. 10 | — | 500.14 | Monitoring |

> These mappings are illustrative, not exhaustive. Each framework has many
> more applicable controls than shown — contributions expanding coverage are
> welcome via [CONTRIBUTING.md](../CONTRIBUTING.md).

## Primary sources

- [DoD Zero Trust Reference Architecture 2.0](https://dodcio.defense.gov/Portals/0/Documents/Library/(U)ZT_RA_v2.0(U)_Sep22.pdf)
- [NIST SP 800-207: Zero Trust Architecture](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-207.pdf)
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- [PCI-DSS v4.0](https://www.pcisecuritystandards.org/document_library/)
- [23 NYCRR 500 (NYDFS Cybersecurity Regulation)](https://www.dfs.ny.gov/system/files/documents/2023/11/23_NYCRR500.pdf)
