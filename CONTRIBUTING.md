# Contributing to Social Media Analytics Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB 6.0+
- Redis 7.0+
- Docker and Docker Compose (for local development)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/social-media-analytics-platform.git
   cd social-media-analytics-platform
   ```

3. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Start services with Docker:
   ```bash
   npm run docker:up
   ```

6. Run database migrations and seed:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

7. Start development servers:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code standards

3. Write or update tests for your changes

4. Run tests and linting:
   ```bash
   npm run lint
   npm run test
   ```

5. Commit your changes using conventional commits:
   ```bash
   git commit -m "feat: add new analytics endpoint"
   ```

   Commit types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

6. Push to your fork and create a pull request

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types - use proper type definitions
- Document complex types with JSDoc comments

### Code Style

- Follow the ESLint configuration
- Use Prettier for formatting (run `npm run format`)
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Add JSDoc comments for all public APIs

### Example:

```typescript
/**
 * Retrieves analytics data for a specific user
 * @param userId - The unique identifier of the user
 * @param options - Additional filtering options
 * @returns Promise resolving to analytics data
 * @throws {NotFoundError} If user doesn't exist
 * @example
 * const analytics = await getUserAnalytics('user123', { period: '30d' });
 */
async function getUserAnalytics(
  userId: string,
  options: AnalyticsOptions
): Promise<AnalyticsData> {
  // Implementation
}
```

## Testing Requirements

### Unit Tests

- Write unit tests for all new functions and components
- Aim for >80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'secure123' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
    });
  });
});
```

### Integration Tests

- Test API endpoints with realistic scenarios
- Test database interactions
- Verify error handling

### E2E Tests

- Test critical user flows
- Use Playwright for browser automation
- Test across multiple browsers

## Pull Request Process

1. **Update Documentation**: Ensure README and docs are updated

2. **Add Tests**: Include tests for your changes

3. **Update Changelog**: Add entry to CHANGELOG.md

4. **Pass CI/CD**: Ensure all checks pass

5. **Code Review**: Address reviewer feedback

6. **Squash Commits**: Clean up commit history before merge

### PR Title Format

Use conventional commit format:
```
feat: add user profile export feature
fix: resolve memory leak in analytics processor
docs: update API documentation for webhooks
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Dependent changes merged
```

## Reporting Bugs

### Before Submitting

1. Check existing issues
2. Verify bug exists in latest version
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node Version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Additional Context**
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Other solutions or features considered

**Additional context**
Any other relevant information, mockups, etc.
```

## Documentation

- Update API documentation in OpenAPI format
- Add JSDoc comments for public APIs
- Update user guides for UI changes
- Include code examples where helpful

## Questions?

Feel free to:
- Open a GitHub Discussion
- Join our Discord community
- Email us at dev@socialmediaanalytics.com

Thank you for contributing! 🎉
