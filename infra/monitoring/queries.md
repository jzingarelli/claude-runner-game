# Prometheus/Grafana Queries

- Node process CPU: `process_cpu_user_seconds_total`
- HTTP Requests per second: `rate(http_requests_total[1m])`
- Memory usage: `process_resident_memory_bytes`
- Redis ops: `redis_commands_processed_total`
- Queue job counts: expose custom metrics or poll Bull queues
