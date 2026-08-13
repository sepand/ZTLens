# Pillar 5: Network & Environment

Segment, isolate, and control the network environment with granular access
and policy restrictions, replacing the flat, perimeter-trusted network.

## Key principles

- No implicit trust based on network location — internal traffic is treated with the same scrutiny as external.
- Macro-segmentation gives way to software-defined micro-perimeters over time.
- Encrypted traffic is still subject to visibility and policy enforcement.

## Maturity snapshot

| Stage | Characteristics |
|---|---|
| Traditional | Perimeter firewall, flat internal network |
| Advanced | Macro-segmentation by zone/environment, TLS inspection at chokepoints |
| Optimal | Software-defined micro-perimeters per session; encrypted-traffic analytics without decryption |

## Related capabilities

See [Network Segmentation](../capability-matrix/README.md) and [Encrypted
Traffic Inspection](../capability-matrix/README.md) in the capability matrix.

## Framework tie-ins

NIST 800-53 (SC family), NIST 800-207 §3.4, PCI-DSS v4.0 (Req. 1).
