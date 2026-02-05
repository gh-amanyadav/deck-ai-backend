# Clash Royale API Proxy Backend

A robust Node.js Express backend that proxies Clash Royale API endpoints with comprehensive error handling, validation, and optimization.

## Features

- ✅ **Two Core Endpoints**: Player information and battle log
- 🛡️ **Robust Error Handling**: Handles all HTTP status codes (400, 403, 404, 429, 500, 503)
- 🔐 **Security**: Helmet middleware, CORS configuration, input validation
- 📝 **Validation**: Player tag format validation and URL encoding
- ⚡ **Optimized**: Request timeout, proper logging, and error mapping
- 🎯 **Clean Architecture**: Organized folder structure with separation of concerns

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Clash Royale API Key ([Get one here](https://developer.clashroyale.com/))

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/systemthree/development/Projects/deck-ai-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Clash Royale API key:
   ```env
   CLASH_ROYALE_API_KEY=your_actual_api_key_here
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```bash
GET /health
```

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-05T10:43:59.000Z",
  "environment": "development"
}
```

### 1. Get Player Information

```bash
GET /api/players/:playerTag
```

**Parameters**:
- `playerTag` (string, required): Player tag (with or without # prefix)

**Example Requests**:
```bash
# With URL-encoded tag
curl http://localhost:3000/api/players/%232ABC

# Without # (will be added automatically)
curl http://localhost:3000/api/players/2ABC
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "tag": "#2ABC",
    "name": "PlayerName",
    "trophies": 5000,
    "wins": 150,
    "losses": 100,
    // ... full player object from Clash Royale API
  },
  "meta": {
    "requestedTag": "#2ABC",
    "timestamp": "2026-02-05T10:43:59.000Z"
  }
}
```

### 2. Get Player Battle Log

```bash
GET /api/players/:playerTag/battlelog
```

**Parameters**:
- `playerTag` (string, required): Player tag (with or without # prefix)

**Example Requests**:
```bash
# With URL-encoded tag
curl http://localhost:3000/api/players/%232ABC/battlelog

# Without # (will be added automatically)
curl http://localhost:3000/api/players/2ABC/battlelog
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "type": "PvP",
      "battleTime": "20260205T104359.000Z",
      "team": [...],
      "opponent": [...],
      // ... battle details
    }
  ],
  "meta": {
    "requestedTag": "#2ABC",
    "battleCount": 25,
    "timestamp": "2026-02-05T10:43:59.000Z"
  }
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": {
      "reason": "errorReason",
      "type": "errorType"
    }
  }
}
```

### Error Status Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid player tag format or parameters |
| 403 | Forbidden - Invalid or missing API key |
| 404 | Not Found - Player does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Unexpected error |
| 503 | Service Unavailable - API maintenance or unreachable |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLASH_ROYALE_API_KEY` | Your Clash Royale API key | **Required** |
| `CLASH_ROYALE_BASE_URL` | Base URL for Clash Royale API | `https://api.clashroyale.com/v1` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `REQUEST_TIMEOUT` | API request timeout in ms | `10000` |

## Project Structure

```
deck-ai-backend/
├── src/
│   ├── config/
│   │   └── config.js              # Configuration management
│   ├── controllers/
│   │   └── playerController.js    # Request handlers
│   ├── middleware/
│   │   └── errorMiddleware.js     # Error handling
│   ├── routes/
│   │   └── playerRoutes.js        # Route definitions
│   ├── services/
│   │   └── clashRoyaleService.js  # API client
│   ├── utils/
│   │   ├── errorHandler.js        # Error utilities
│   │   └── playerTagValidator.js  # Validation utilities
│   └── server.js                  # Application entry point
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies
└── README.md                      # This file
```

## Player Tag Format

Player tags in Clash Royale:
- Start with `#` character
- Contain alphanumeric characters (0-9, A-Z)
- Are case-insensitive

**Examples**:
- Valid: `#2ABC`, `#9L88GR8V`, `#PLAYER123`
- Invalid: `2ABC` (missing #), `#ABC-123` (contains hyphen), `#` (empty)

**Note**: The API automatically adds `#` if missing for convenience.

## Security Features

- **Helmet.js**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Prevents injection attacks
- **API Key Protection**: Stored in environment variables
- **Error Sanitization**: Prevents information leakage

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add service method in `src/services/clashRoyaleService.js`
3. Define routes in `src/routes/`
4. Register routes in `src/server.js`

### Running Tests

```bash
npm test
```

## License

ISC

## Support

For issues or questions, please refer to the [Clash Royale API Documentation](https://developer.clashroyale.com/).
