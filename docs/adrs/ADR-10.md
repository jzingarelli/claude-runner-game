# ADR-10: Docker + Kubernetes for Deployment

- Context: We need reproducible builds and scalable production deployments.
- Decision: Ship Docker images and deploy to Kubernetes (deployments + services, Nginx ingress).
- Consequences: Portable deployments and auto-scaling; requires cluster ops and observability.
