# ADR-05: JWT + Refresh + 2FA + OAuth2 for Auth

- Context: Enterprise-grade auth requires stateless access tokens, session renewal, MFA, and social login.
- Decision: Use JWT access tokens, refresh tokens persisted in DB, TOTP 2FA, and OAuth2 via Google/GitHub.
- Consequences: Scales well behind load balancers; implement token revocation and enforce 2FA for sensitive flows.
