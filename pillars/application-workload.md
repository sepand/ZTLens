# Pillar 3: Application & Workload

Secure everything from applications to hypervisors, containers, and virtual
machines — including the DevSecOps pipeline that builds and deploys them.

## Key principles

- Security is embedded in the development lifecycle, not bolted on at deployment.
- Workloads are segmented and authenticated to each other, not implicitly trusted by network location.
- Application access is authorized per-request, informed by user and device trust signals.

## Maturity snapshot

| Stage | Characteristics |
|---|---|
| Traditional | Manual code review, flat network trust between app tiers |
| Advanced | Automated SAST/DAST in CI/CD, service-mesh or NGFW-based segmentation |
| Optimal | Runtime self-protection (RASP), fully dynamic identity-based segmentation per workload |

## Related capabilities

See [Secure Software Development Lifecycle](../capability-matrix/README.md)
and [Application-Layer Micro-Segmentation](../capability-matrix/README.md) in
the capability matrix.

## Framework tie-ins

NIST 800-53 (SA family), NIST 800-207 §3.4, PCI-DSS v4.0 (Req. 1.3, 6).
