# Capability Matrix

> Generated from [`data/capabilities.yaml`](../data/capabilities.yaml) by
> [`scripts/generate_matrix.py`](../scripts/generate_matrix.py). Edit the YAML,
> not this file, then regenerate (`pip install pyyaml && python scripts/generate_matrix.py`).

Each row maps a capability to its DoD ZT RA 2.0 pillar, describes what the
capability looks like at each maturity stage (Traditional / Advanced /
Optimal), and lists informal tie-ins to common regulatory / control
frameworks. Framework references are illustrative starting points for your
own compliance mapping, not a compliance attestation.

| Pillar | Capability | Traditional | Advanced | Optimal | Framework tie-ins |
|---|---|---|---|---|---|
| User | Multi-Factor Authentication | Password-only or basic MFA (SMS/OTP) at network login | Phishing-resistant MFA (FIDO2/PKI) enforced at app and privileged-session level | Continuous, risk-adaptive authentication using behavioral and contextual signals | NIST 800-53 (IA-2)<br>PCI-DSS v4.0 (8.4)<br>NYDFS 500 (500.12) |
| User | Identity Federation & Single Sign-On | Local identity stores per application | Centralized IdP with federated SSO across most applications | Unified identity fabric with just-in-time, attribute-based access across all environments | NIST 800-53 (IA-8)<br>SOX (ITGC) (Access Management) |
| Device | Device Inventory & Compliance | Manual asset spreadsheets, periodic audits | Automated MDM/EDR-based inventory with compliance scoring | Real-time device trust scoring feeding dynamic access decisions | NIST 800-53 (CM-8)<br>PCI-DSS v4.0 (12.5) |
| Device | Device Health Attestation | No attestation; trust based on network location | Agent-based posture checks (patch level, disk encryption) gate access | Hardware-rooted attestation (TPM) continuously verified per session | NIST 800-207 (Sec 3.3) |
| Application & Workload | Secure Software Development Lifecycle | Manual code review, ad hoc testing | Automated SAST/DAST in CI/CD with gated deploys | Continuous security validation with runtime application self-protection (RASP) | NIST 800-53 (SA-11)<br>SOX (ITGC) (Change Management) |
| Application & Workload | Application-Layer Micro-Segmentation | Flat network, coarse VLAN segmentation | Workload-aware segmentation via service mesh or NGFW policies | Fully dynamic, identity-based segmentation per workload/session | NIST 800-207 (Sec 3.4)<br>PCI-DSS v4.0 (1.3) |
| Data | Data Classification & Labeling | Manual, inconsistent classification | Automated classification via DLP/CASB tooling | Continuous, ML-assisted classification enforcing access policy in real time | NIST 800-53 (RA-2)<br>GLBA (Safeguards Rule) (16 CFR 314.4(c))<br>NYDFS 500 (500.03) |
| Data | Encryption at Rest & In Transit | Encryption applied inconsistently, mostly in transit only | Encryption enforced by policy across most data stores and channels | End-to-end encryption with centralized key management and rotation | PCI-DSS v4.0 (3.5 / 4.2)<br>NYDFS 500 (500.15) |
| Network & Environment | Network Segmentation | Perimeter firewall, flat internal network | Macro-segmentation by zone/environment with internal firewalls | Software-defined micro-perimeters enforced per session, no implicit trust zones | NIST 800-207 (Sec 3.4)<br>PCI-DSS v4.0 (1.2) |
| Network & Environment | Encrypted Traffic Inspection | Limited visibility into encrypted traffic | TLS inspection at key chokepoints | Full encrypted-traffic analytics without decryption (metadata/ML-based) | NIST 800-53 (SC-8) |
| Automation & Orchestration | Security Orchestration, Automation & Response (SOAR) | Manual incident response runbooks | Automated playbooks for common alert types | Policy-driven, self-healing response integrated across all pillars | NIST 800-53 (IR-4)<br>NYDFS 500 (500.16) |
| Automation & Orchestration | Centralized Policy Decision Point (PDP) | Policy enforced locally per system, no central authority | Centralized PDP/PEP model for major application tiers | Unified PDP evaluating real-time risk signals across all pillars for every access request | NIST 800-207 (Sec 3.2 (PDP/PEP model)) |
| Visibility & Analytics | Centralized Logging & SIEM | Siloed logs, manual review | Centralized SIEM with correlation rules across most systems | Behavioral analytics (UEBA) with automated risk scoring feeding policy decisions | NIST 800-53 (AU-6)<br>NYDFS 500 (500.14)<br>SOX (ITGC) (Monitoring) |
| Visibility & Analytics | Threat Intelligence Integration | Ad hoc, manual threat feed consumption | Automated ingestion into SIEM/SOAR for detection | Predictive analytics correlating threat intel with real-time access decisions | NIST 800-53 (RA-3) |
