# Security Best Practices

- Use HTTPS and HSTS in production
- Rotate JWT secrets and Stripe/webhook secrets
- Enforce strong passwords and 2FA for admins
- Sanitize and validate all inputs (Zod)
- Apply RBAC checks on every protected route
- Use parameterized DB queries and indexes
- Limit upload sizes and validate MIME types
- Store secrets in a secure vault (e.g., Kubernetes Secrets, AWS Secrets Manager)
- Run containers as non-root and keep images updated
