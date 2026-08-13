---
title: "ZT Pillars x NIST CSF 2.0 Crosswalk"
---

# Zero Trust Pillars × NIST CSF 2.0 Crosswalk

> Generated from [`data/nist-csf-mapping.yaml`](../data/nist-csf-mapping.yaml).
> Edit the YAML, not this file.

Maps a 7-pillar Zero Trust model (Identity, Network, Applications, Data,
Infrastructure, Visibility & Analytics, Automation & Orchestration — a close
cousin of the DoD ZT RA 2.0 pillar set used in
[`/capability-matrix`](../capability-matrix/)) against the six [NIST
Cybersecurity Framework (CSF) 2.0](https://www.nist.gov/cyberframework)
functions: **Govern, Identify, Protect, Detect, Respond, Recover**.

Each cell lists illustrative capabilities, not an exhaustive or authoritative
control set — see [CONTRIBUTING.md](../CONTRIBUTING.md) to propose additions.

| Pillar | Govern | Identify | Protect | Detect | Respond | Recover |
|---|---|---|---|---|---|---|
| **Identity** | Identity governance policy; RBAC/ABAC standards; access review cadence | Identity inventory; entitlement and privileged-account discovery; identity risk scoring | MFA; conditional access; least-privilege/JIT access; SSO and federation | Anomalous sign-in detection; UEBA; impossible-travel and risk-based alerts | Automated session revocation; forced password reset; account lockout/quarantine | Identity re-provisioning; credential rotation and re-validation post-incident |
| **Network** | Network segmentation policy; ZTNA and remote-access standards | Network asset and topology discovery; traffic baselining | Micro-segmentation; encrypted transport (TLS/IPsec); ZTNA; NGFW policy enforcement | Network traffic analytics; IDS/IPS; encrypted-traffic analysis | Automated isolation/quarantine of compromised network segments | Network configuration restoration; segment and route re-provisioning |
| **Applications** | Secure SDLC policy; application risk classification standards | Application inventory; dependency/SBOM tracking; attack-surface mapping | SAST/DAST gating in CI/CD; WAF; API security; workload identity (mTLS) | Runtime application monitoring; anomalous API call detection; RASP telemetry | Automated rollback; workload isolation or kill-switch | Redeploy from known-good artifact; patch, re-test, and re-release |
| **Data** | Data classification policy; data governance and retention standards | Data discovery and classification; sensitive-data inventory and lineage | Encryption at rest/in transit; DLP; tokenization; rights management | DLP alerts; anomalous data access or exfiltration detection | Automated access revocation; DLP block/quarantine of affected data flows | Backup restoration; key re-issuance; data integrity verification |
| **Infrastructure** | Infrastructure hardening baselines; patch and change-management policy | Asset/CMDB inventory; vulnerability scanning; configuration drift detection | Hardened/immutable images; endpoint protection; automated patching | Host-based EDR; configuration and compliance drift alerts | Automated patching or quarantine of non-compliant hosts | Rebuild from golden image; infrastructure-as-code redeploy |
| **Visibility & Analytics** | Logging and monitoring policy; telemetry retention standards | Log source inventory; visibility coverage-gap analysis | Centralized, tamper-evident logging; log integrity protection | SIEM correlation; UEBA; threat-intelligence correlation | Automated alert triage and enrichment feeding SOAR | Post-incident forensic analysis; telemetry-driven lessons learned |
| **Automation & Orchestration** | Automation and playbook governance; change control for policy-as-code | Manual-process inventory (automation candidates); playbook coverage gaps | Policy-as-code enforcement; automated compliance checks in CI/CD | Cross-pillar signal correlation feeding SOAR | SOAR playbooks (auto-contain, auto-notify); orchestrated cross-pillar response | Automated recovery runbooks; self-healing infrastructure workflows |

## About NIST CSF 2.0 functions

| Function | What it covers |
|---|---|
| **Govern (GV)** | Establishes and monitors the organization's cybersecurity risk management strategy, expectations, and policy. |
| **Identify (ID)** | Understands current cybersecurity risk to systems, assets, data, and capabilities. |
| **Protect (PR)** | Implements safeguards to manage risk and limit or contain the impact of events. |
| **Detect (DE)** | Finds and analyzes possible cybersecurity attacks and compromises. |
| **Respond (RS)** | Takes action regarding a detected cybersecurity incident. |
| **Recover (RC)** | Restores assets and operations affected by a cybersecurity incident. |

Source: [NIST Cybersecurity Framework 2.0](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf).
