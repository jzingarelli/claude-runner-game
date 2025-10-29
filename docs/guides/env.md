# Environment Variables

See `.env.example` at the root for a complete list.

- Backend
  - `PORT`: API port
  - `MONGO_URI`: MongoDB connection string
  - `REDIS_HOST` / `REDIS_PORT`: Redis connection
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: JWT secrets
  - `OAUTH_*`: OAuth2 provider credentials
  - `STRIPE_*`: Stripe API keys and webhook secret
  - `AWS_*`: S3 configuration
  - `EMAIL_FROM` / `SMTP_*`: SMTP configuration for emails
