# Sessions API - Filtering and Sorting Guide

## GET /prayer-session/all

This endpoint retrieves all prayer sessions with advanced filtering, sorting, and pagination capabilities.

### Query Parameters

#### Filtering Parameters

- **status** (optional): Filter by session status
  - Values: `active`, `completed`
  - Example: `?status=active`

- **cityId** (optional): Filter by specific city ID
  - Example: `?cityId=123`

- **countryCode** (optional): Filter by country code (ISO 3166-1 alpha-2)
  - Example: `?countryCode=US`

- **countryName** (optional): Filter by country name
  - Example: `?countryName=United States`

- **continent** (optional): Filter by continent code
  - Example: `?continent=NA`

- **continentName** (optional): Filter by continent name
  - Example: `?continentName=North America`

#### Sorting Parameters

- **sortBy** (optional): Field to sort by
  - Values: `createdAt`, `updatedAt`, `status`, `cityId`
  - Default: `createdAt`

- **sortOrder** (optional): Sort order
  - Values: `asc`, `desc`
  - Default: `desc`

#### Pagination Parameters

- **page** (optional): Page number (starts from 1)
  - Default: `1`
  - Example: `?page=2`

- **limit** (optional): Number of items per page
  - Default: `20`
  - Maximum: `100`
  - Example: `?limit=50`

### Example Requests

#### Get all active sessions in the United States
```
GET /prayer-session/all?status=active&countryCode=US
```

#### Get completed sessions in Europe, sorted by creation date (oldest first)
```
GET /prayer-session/all?status=completed&continent=EU&sortBy=createdAt&sortOrder=asc
```

#### Get sessions in a specific city with pagination
```
GET /prayer-session/all?cityId=456&page=1&limit=10
```

#### Get all sessions in North America, sorted by status
```
GET /prayer-session/all?continentName=North America&sortBy=status&sortOrder=asc
```

### Response Format

The response includes both the sessions data and pagination information:

```json
{
  "message": "Sessions retrieved",
  "data": {
    "sessions": [
      {
        "id": 1,
        "status": "active",
        "description": "Prayer session description",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "subject": {
          "id": 1,
          "title": "Prayer Subject Title",
          "state": "active",
          "description": "Subject description"
        },
        "user": {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "location": {
          "id": 1,
          "name": "New York",
          "countryCode": "US",
          "countryName": "United States",
          "continent": "NA",
          "continentName": "North America"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

### Notes

- All filters can be combined for more specific queries
- The system automatically includes necessary associations (subject, user, location)
- Pagination is always applied, even if not specified
- Invalid filter values will return a validation error
- The response includes total count and pagination metadata for better UX
- Authentication is handled via session cookies
