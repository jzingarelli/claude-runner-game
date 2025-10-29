# ADR-02: MongoDB + Mongoose for Persistence

- Context: Flexible and evolving domain with heterogeneous analytics data and large write throughput.
- Decision: Use MongoDB with Mongoose ODM for schema validation and indexes.
- Consequences: Rapid iteration with dynamic schemas; requires careful index design and pipeline optimizations for analytics queries.
