# API Documentation

## Overview

The Social Media Analytics Platform API is a RESTful API that provides comprehensive endpoints for managing social media analytics, posts, users, teams, and more.

**Base URL**: `https://api.socialmediaanalytics.com/api/v1`

**Authentication**: Bearer JWT token in Authorization header

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Posts](#posts)
- [Analytics](#analytics)
- [Reports](#reports)
- [Teams](#teams)
- [Notifications](#notifications)
- [Webhooks](#webhooks)
- [Subscriptions](#subscriptions)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "viewer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Registration successful"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Password Reset
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newSecurePassword123"
}
```

### Two-Factor Authentication
```http
POST /auth/2fa/enable
Authorization: Bearer {accessToken}
```

```http
POST /auth/2fa/verify
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "token": "123456"
}
```

```http
POST /auth/2fa/disable
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "token": "123456"
}
```

## Users

### Get Current User Profile
```http
GET /users/me
Authorization: Bearer {accessToken}
```

### Update Profile
```http
PUT /users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Upload Avatar
```http
POST /users/me/avatar
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: [binary data]
```

### Update Preferences
```http
PUT /users/me/preferences
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "theme": "dark",
  "language": "en",
  "timezone": "America/New_York",
  "notifications": {
    "email": true,
    "push": true,
    "inApp": true
  }
}
```

### Change Password
```http
POST /users/me/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

### Get All Users (Admin)
```http
GET /users?page=1&limit=20&sortBy=createdAt&sortOrder=desc
Authorization: Bearer {accessToken}
```

## Posts

### Create Post
```http
POST /posts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Check out our new product!",
  "platforms": [
    {
      "platform": "twitter",
      "accountId": "account123"
    },
    {
      "platform": "facebook",
      "accountId": "account456"
    }
  ],
  "scheduledFor": "2024-01-15T14:00:00Z",
  "tags": ["product", "launch"],
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ]
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "content": "Check out our new product!",
      "status": "scheduled",
      "scheduledFor": "2024-01-15T14:00:00Z",
      "platforms": [...],
      "tags": ["product", "launch"],
      "createdAt": "2024-01-10T10:00:00Z"
    }
  },
  "message": "Post created successfully"
}
```

### Get All Posts
```http
GET /posts?page=1&limit=20&status=published&platform=twitter
Authorization: Bearer {accessToken}
```

### Get Post by ID
```http
GET /posts/:id
Authorization: Bearer {accessToken}
```

### Update Post
```http
PUT /posts/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Updated content",
  "status": "draft"
}
```

### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer {accessToken}
```

### Get Post Analytics
```http
GET /posts/:id/analytics
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "analytics": {
      "views": 1234,
      "likes": 567,
      "comments": 89,
      "shares": 45,
      "clicks": 234,
      "reach": 5678,
      "impressions": 8901,
      "engagementRate": 12.5
    }
  }
}
```

### Publish Post
```http
POST /posts/:id/publish
Authorization: Bearer {accessToken}
```

## Analytics

### Get Dashboard Analytics
```http
GET /analytics/dashboard
Authorization: Bearer {accessToken}
```

### Get Post Analytics
```http
GET /analytics/posts/:postId
Authorization: Bearer {accessToken}
```

### Get Time Series Data
```http
GET /analytics/time-series?start=2024-01-01&end=2024-01-31&granularity=day
Authorization: Bearer {accessToken}
```

## Reports

### Create Report
```http
POST /reports
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Monthly Performance Report",
  "type": "performance",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": ["views", "likes", "engagement"],
  "format": "pdf"
}
```

### Get All Reports
```http
GET /reports
Authorization: Bearer {accessToken}
```

### Get Report by ID
```http
GET /reports/:id
Authorization: Bearer {accessToken}
```

### Delete Report
```http
DELETE /reports/:id
Authorization: Bearer {accessToken}
```

## Teams

### Create Team
```http
POST /teams
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Marketing Team",
  "description": "Our amazing marketing team"
}
```

### Get All Teams
```http
GET /teams
Authorization: Bearer {accessToken}
```

### Get Team by ID
```http
GET /teams/:id
Authorization: Bearer {accessToken}
```

### Update Team
```http
PUT /teams/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Updated Team Name"
}
```

### Add Team Member
```http
POST /teams/:id/members
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "role": "editor"
}
```

### Remove Team Member
```http
DELETE /teams/:id/members/:userId
Authorization: Bearer {accessToken}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Password Reset**: 3 requests per hour
- **File Uploads**: 10 uploads per hour
- **Report Generation**: 5 reports per hour

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `AUTH_TOKEN_MISSING`: No authentication token provided
- `INVALID_TOKEN`: Invalid or expired token
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (duplicate)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Pagination

List endpoints support pagination:

```http
GET /posts?page=2&limit=20&sortBy=createdAt&sortOrder=desc
```

**Response**:
```json
{
  "success": true,
  "data": {
    "posts": [...]
  },
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Webhooks

See [Webhooks Documentation](../webhooks/README.md) for webhook event documentation.

## Interactive Documentation

Interactive API documentation with live testing is available at:
- **Development**: http://localhost:5000/api/v1/docs
- **Production**: https://api.socialmediaanalytics.com/api/v1/docs
