# Diagrams

Rendered with [Mermaid](https://mermaid.js.org/), which GitHub renders
natively in markdown — no extra tooling required.

## Pillar interaction

Automation & Orchestration and Visibility & Analytics are cross-cutting: they
consume signals from, and push policy to, the other five pillars.

```mermaid
flowchart TB
    subgraph Enforcement["Enforced Pillars"]
        U[User]
        D[Device]
        A[Application & Workload]
        N[Network & Environment]
        DA[Data]
    end

    V[Visibility & Analytics] -->|telemetry informs policy| O[Automation & Orchestration]
    U -->|signals| V
    D -->|signals| V
    A -->|signals| V
    N -->|signals| V
    DA -->|signals| V

    O -->|policy decisions| U
    O -->|policy decisions| D
    O -->|policy decisions| A
    O -->|policy decisions| N
    O -->|policy decisions| DA
```

## Maturity progression

```mermaid
flowchart LR
    T[Traditional<br/>Manual, perimeter-based,<br/>siloed controls] --> AD[Advanced<br/>Automated policy enforcement<br/>within pillars]
    AD --> OP[Optimal<br/>Fully automated, dynamic,<br/>risk-based, cross-pillar]
```

## PDP / PEP request flow (NIST SP 800-207)

```mermaid
sequenceDiagram
    participant Subject as User/Device (Subject)
    participant PEP as Policy Enforcement Point
    participant PDP as Policy Decision Point
    participant Signals as Signal Sources<br/>(identity, device posture,<br/>threat intel, data classification)
    participant Resource

    Subject->>PEP: Request access to resource
    PEP->>PDP: Forward request + context
    PDP->>Signals: Query trust/risk signals
    Signals-->>PDP: Return signals
    PDP-->>PEP: Allow / Deny / Step-up auth
    PEP-->>Subject: Enforce decision
    PEP->>Resource: Grant scoped access (if allowed)
```
