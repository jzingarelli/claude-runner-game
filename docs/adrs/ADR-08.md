# ADR-08: Redux Toolkit + React Query

- Context: Complex local UI state and remote server cache need different tools.
- Decision: Use Redux Toolkit for app state (auth, UI) and React Query for server state with caching and mutations.
- Consequences: Clear separation of concerns; fewer ad-hoc thunks and manual cache invalidation.
