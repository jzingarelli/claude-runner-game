# ADR-03: Redis for Caching and Queues Backend

- Context: We must cache hot reads and support background job queues.
- Decision: Use Redis for both caching (key/value) and as the Bull queue backend.
- Consequences: Reduces DB load and enables async processing; adds operational dependency on Redis availability.
