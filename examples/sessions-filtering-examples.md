# Sessions Filtering and Sorting Examples

This file contains practical examples of how to use the new filtering and sorting system for the `/prayer-session/all` endpoint.

## Basic Examples

### 1. Get all active sessions
```bash
GET /api/prayer-session/all?status=active
```

### 2. Get all completed sessions
```bash
GET /api/prayer-session/all?status=completed
```

### 3. Get sessions with pagination
```bash
GET /api/prayer-session/all?page=1&limit=10
```

## Geographic Filtering

### 4. Get sessions in a specific city
```bash
GET /api/prayer-session/all?cityId=123
```

### 5. Get sessions in a specific country by code
```bash
GET /api/prayer-session/all?countryCode=US
```

### 6. Get sessions in a specific country by name
```bash
GET /api/prayer-session/all?countryName=United States
```

### 7. Get sessions in a specific continent by code
```bash
GET /api/prayer-session/all?continent=EU
```

### 8. Get sessions in a specific continent by name
```bash
GET /api/prayer-session/all?continentName=Europe
```

## Combined Filtering

### 9. Get active sessions in the United States
```bash
GET /api/prayer-session/all?status=active&countryCode=US
```

### 10. Get completed sessions in Europe with pagination
```bash
GET /api/prayer-session/all?status=completed&continent=EU&page=1&limit=25
```

### 11. Get sessions in a specific city with status filter
```bash
GET /api/prayer-session/all?cityId=456&status=active
```

## Sorting Examples

### 12. Sort by creation date (newest first - default)
```bash
GET /api/prayer-session/all?sortBy=createdAt&sortOrder=desc
```

### 13. Sort by creation date (oldest first)
```bash
GET /api/prayer-session/all?sortBy=createdAt&sortOrder=asc
```

### 14. Sort by status (alphabetical)
```bash
GET /api/prayer-session/all?sortBy=status&sortOrder=asc
```

### 15. Sort by last update (newest first)
```bash
GET /api/prayer-session/all?sortBy=updatedAt&sortOrder=desc
```

## Advanced Combinations

### 16. Get active sessions in North America, sorted by creation date, with pagination
```bash
GET /api/prayer-session/all?status=active&continentName=North America&sortBy=createdAt&sortOrder=desc&page=2&limit=50
```

### 17. Get completed sessions in France, sorted by status
```bash
GET /api/prayer-session/all?status=completed&countryName=France&sortBy=status&sortOrder=asc
```

### 18. Get all sessions in Asia with custom pagination
```bash
GET /api/prayer-session/all?continent=AS&page=1&limit=100
```

## cURL Examples

### 19. Get active sessions in the United States
```bash
curl -X GET "http://localhost:3000/api/prayer-session/all?status=active&countryCode=US" \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

### 20. Get sessions with complex filtering
```bash
curl -X GET "http://localhost:3000/api/prayer-session/all?status=active&continent=EU&sortBy=createdAt&sortOrder=desc&page=1&limit=25" \
  -H "Cookie: session=YOUR_SESSION_COOKIE"
```

## JavaScript/Node.js Examples

### 21. Using fetch API
```javascript
const response = await fetch('/api/prayer-session/all?status=active&countryCode=US&page=1&limit=20', {
  credentials: 'include' // This includes cookies
});

const data = await response.json();
console.log('Sessions:', data.data.sessions);
console.log('Pagination:', data.data.pagination);
```

### 22. Using axios
```javascript
const response = await axios.get('/api/prayer-session/all', {
  params: {
    status: 'active',
    countryCode: 'US',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  withCredentials: true // This includes cookies
});

console.log('Total sessions:', response.data.data.pagination.total);
console.log('Current page:', response.data.data.pagination.page);
```

## Response Structure

All responses include pagination metadata:

```json
{
  "message": "Sessions retrieved",
  "data": {
    "sessions": [...],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

## Error Handling

### Invalid status parameter
```bash
GET /api/prayer-session/all?status=invalid
# Returns: 400 Bad Request with validation error
```

### Invalid sortBy parameter
```bash
GET /api/prayer-session/all?sortBy=invalid
# Returns: 400 Bad Request with validation error
```

### Limit too high
```bash
GET /api/prayer-session/all?limit=150
# Returns: 400 Bad Request with validation error (max is 100)
```

## Notes

- All filters can be combined for more specific queries
- Pagination is always applied (default: page 1, limit 20)
- Maximum limit is 100 items per page
- Default sorting is by creation date (newest first)
- Geographic filters work through city associations
- The system automatically includes necessary associations (subject, user, location)
- Authentication is handled via session cookies, not Bearer tokens
