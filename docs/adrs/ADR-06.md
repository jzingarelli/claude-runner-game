# ADR-06: Socket.IO for Real-Time Notifications

- Context: Users need real-time updates for notifications and report completions.
- Decision: Use Socket.IO over WebSockets with fallbacks.
- Consequences: Simple client API; requires sticky sessions or separate pub/sub if scaled across nodes (future: use Redis adapter).
