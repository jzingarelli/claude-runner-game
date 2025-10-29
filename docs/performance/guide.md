# Performance Optimization Guide

- Cache hot GET endpoints in Redis with short TTLs
- Add compound indexes for frequent queries
- Use aggregation pipeline projections to reduce payload size
- Batch writes via queues for heavy workloads
- Stream large exports instead of buffering
- Enable HTTP compression at Nginx
- Use connection pooling for MongoDB
- Profile endpoints and add metrics (Prometheus)
