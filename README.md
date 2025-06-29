# gobin

**gobin** is a simple pastebin app. It allows users to quickly and easily share text or code snippets online. The app is designed to be lightweight, fast, and easy to use, making it ideal for sharing temporary notes, code, or any other text content.

## Features
- Create and share text or code snippets instantly
- Minimal and user-friendly interface
- Fast and lightweight
- RESTful API with comprehensive documentation
- **Direct URL access**: Access pastes directly via URL (e.g., `http://localhost:8080/{key}`)

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/michaelwp/gobin.git
   cd gobin
   ```
2. Build and run the application:
   ```sh
   go build -o gobin cmd/main.go
   ./gobin
   ```

## API Documentation

### Generate Swagger Documentation

1. Install swag CLI tool:
   ```bash
   go install github.com/swaggo/swag/cmd/swag@latest
   ```

2. Add to PATH (if not already added):
   ```bash
   export PATH=$PATH:~/go/bin
   ```

3. Generate the documentation:
   ```bash
   swag init -g cmd/main.go
   ```

### Access Swagger UI

Once your application is running, you can access the interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger/index.html`
- **Raw JSON spec**: `http://localhost:8080/swagger/doc.json`

### API Endpoints

#### Health Check
- **GET** `/api/healthcheck`
- **Description**: Check if the API is running and healthy
- **Response**: Returns a success message with status 200

#### Create New Paste
- **POST** `/api/v1/pastes/add`
- **Description**: Create a new paste with the provided content and expiration date
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "content": "Your text or code content here",
    "expires": "2024-12-31"
  }
  ```
- **Response**: Returns the generated key for accessing the content
- **Status Codes**:
  - `200`: Content successfully added
  - `400`: Bad request (invalid request body)
  - `500`: Internal server error

#### Retrieve Content
- **GET** `/api/v1/pastes/{key}`
- **Description**: Retrieve content by its unique key
- **Parameters**:
  - `key` (path, required): The unique identifier for the paste
- **Response**: Returns the stored content
- **Status Codes**:
  - `200`: Content successfully retrieved
  - `404`: Content not found
  - `500`: Internal server error

### Data Models

#### AddRequest
```json
{
  "content": "string",  // The content to be stored
  "expires": "string"   // Expiration date in YYYY-MM-DD format
}
```

#### Response
```json
{
  "status": "string",   // "success" or "error"
  "message": "string",  // Description of the result
  "data": {}           // Optional response data
}
```

### Example Usage

#### Create a new paste
```bash
curl -X POST http://localhost:8080/api/v1/pastes/add \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, World! This is my first paste.",
    "expires": "2024-12-31"
  }'
```

**Response**:
```json
{
  "status": "success",
  "message": "content successfully added",
  "data": {
    "key": "abc123"
  }
}
```

#### Retrieve content
```bash
curl http://localhost:8080/api/v1/pastes/abc123
```

**Response**:
```json
{
  "status": "success",
  "message": "get content successfully",
  "data": {
    "content": "Hello, World! This is my first paste."
  }
}
```

#### Health check
```bash
curl http://localhost:8080/api/healthcheck
```

**Response**:
```json
{
  "status": "success",
  "message": "hello world"
}
```

## Usage
- Open your browser and navigate to the app's URL (e.g., `http://localhost:8080`).
- Paste your text or code and submit to get a shareable link.
- Use the Swagger UI to explore and test the API endpoints.

## Direct URL Access

One of the key features of gobin is the ability to access pastes directly via URL. This makes sharing content extremely simple:

### How it works
1. **Create a paste** using the web interface or API
2. **Get the key** (e.g., `abc123`)
3. **Share the direct URL**: `http://localhost:8080/abc123`

### Benefits
- **No need to copy/paste keys**: Just share the URL directly
- **Bookmarkable**: Users can bookmark paste URLs for later access
- **Clean URLs**: Simple, readable URLs without query parameters
- **Mobile-friendly**: Works seamlessly on mobile devices

### Example
1. Create a paste with content "Hello World"
2. Receive key: `xyz789`
3. Share URL: `http://localhost:8080/xyz789`
4. Anyone with the URL can access the content directly

The web interface also shows the direct URL when you retrieve a paste, making it easy to copy and share.

## License
MIT
