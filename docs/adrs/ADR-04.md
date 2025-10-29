# ADR-04: Bull for Background Processing

- Context: Email delivery, analytics aggregation, and data exports should be handled asynchronously.
- Decision: Use Bull with Redis to process jobs and support retries/backoff.
- Consequences: Improved UX and resilience; must monitor queues and designate idempotent processors.
