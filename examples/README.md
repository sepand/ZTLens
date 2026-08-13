# Illustrative Examples

Generic implementation patterns for common Zero Trust scenarios. These are
composite, hypothetical examples — they do not describe any specific
organization's environment or controls.

## Example: Remote workforce access to internal apps

**Traditional approach:** VPN grants network-level access; once connected,
the user can reach broad internal subnets.

**Zero Trust approach:**
1. User authenticates via IdP with phishing-resistant MFA.
2. Device posture (patch level, disk encryption, EDR status) is checked by the PDP.
3. PDP grants a scoped, per-application token (ZTNA) rather than network-level access.
4. Session risk is re-evaluated continuously; anomalous behavior triggers step-up auth or termination.

*Pillars involved:* User, Device, Application & Workload, Automation & Orchestration.

## Example: Third-party API access to sensitive data

**Traditional approach:** Static API key with broad, long-lived scope.

**Zero Trust approach:**
1. Data is classified; sensitive fields are tagged.
2. Workload identity (e.g., mTLS certificate) authenticates the calling service, not just a static key.
3. Policy engine authorizes access to specific data fields based on classification and requester identity.
4. All access is logged centrally and correlated with baseline behavior (UEBA) to detect misuse.

*Pillars involved:* Data, Application & Workload, Visibility & Analytics.

## Contributing an example

Keep examples generic and hypothetical — see [CONTRIBUTING.md](../CONTRIBUTING.md).
