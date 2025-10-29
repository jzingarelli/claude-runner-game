# ADR-01: Choose Node.js + Express for Backend

- Context: We need a high-throughput, well-supported HTTP server with rich ecosystem for auth, queues, and integrations.
- Decision: Use Node.js (TypeScript) with Express 4.x.
- Consequences: Excellent ecosystem (Passport, Stripe, Socket.IO), familiar middleware model; single-threaded but scalable horizontally behind a reverse proxy.
