# Gobin Application Requirements

This document outlines all the requirements needed to run the Gobin pastebin application.

## 🛠️ Development Tools

### Go Programming Language
- **Version**: Go 1.24.1 or higher
- **Installation**:
  ```bash
  # macOS (using Homebrew)
  brew install go

  # Linux
  wget https://golang.org/dl/go1.24.1.linux-amd64.tar.gz
  sudo tar -C /usr/local -xzf go1.24.1.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin

  # Windows
  # Download from https://golang.org/dl/
  ```

## 🗄️ Database Requirements

### Redis Server
- **Version**: Redis 6.0 or higher
- **Installation**:
  ```bash
  # macOS
  brew install redis

  # Linux (Ubuntu/Debian)
  sudo apt-get update
  sudo apt-get install redis-server

  # Linux (CentOS/RHEL)
  sudo yum install redis

  # Docker
  docker run -d --name redis -p 6379:6379 redis:7-alpine
  ```

### Redis Configuration
- **Port**: 6379 (default)
- **Database**: 0 (default)
- **Authentication**: Optional (set via environment variable)
- **Persistence**: Recommended for production

## 📦 Go Dependencies

### Core Dependencies
The following packages are automatically installed when you run `go mod tidy`:

- **github.com/gofiber/fiber/v2** - Web framework
- **github.com/redis/go-redis/v9** - Redis client
- **github.com/joho/godotenv** - Environment variable loader

### Development Dependencies
- **github.com/swaggo/swag** - Swagger documentation generator
- **github.com/swaggo/fiber-swagger** - Swagger UI for Fiber
- **github.com/swaggo/files** - Swagger file handling

### Installation
```bash
# Install all dependencies
go mod tidy

# Install development tools
go install github.com/swaggo/swag/cmd/swag@latest
```

## 🔧 Environment Configuration

### Required Environment Variables
Create a `.env` file in the project root:

```env
# Server Configuration
PORT=8080

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Optional Environment Variables
```env
# Development
GO_ENV=development
LOG_LEVEL=debug

# Production
GO_ENV=production
LOG_LEVEL=info
```

## 🚀 Build Tools

### Make (Optional but Recommended)
- **macOS**: `brew install make`
- **Linux**: Usually pre-installed
- **Windows**: Available via WSL or MinGW

### Air (Hot Reload - Development)
- **Installation**:
  ```bash
  go install github.com/cosmtrek/air@latest
  ```

## 📋 Pre-Installation Checklist

Before running the application, ensure you have:

- [ ] Go 1.24.1+ installed and in PATH
- [ ] Git installed
- [ ] Redis server running
- [ ] All Go dependencies installed (`go mod tidy`)
- [ ] Environment variables configured (`.env` file)
- [ ] Swagger tools installed (`swag` CLI)

## 🔍 Verification Commands

### Check Go Installation
```bash
go version
# Expected: go version go1.24.1 darwin/arm64 (or similar)
```

### Check Redis Connection
```bash
redis-cli ping
# Expected: PONG
```

### Check Dependencies
```bash
go mod verify
# Expected: all modules verified
```

### Check Swagger Tools
```bash
swag --version
# Expected: swag version v1.16.4 (or similar)
```

## 🏗️ Project Structure Requirements

Ensure your project has the following structure:
```
gobin/
├── cmd/
│   └── main.go
├── api/
│   ├── controllers.go
│   ├── router.go
│   └── server.go
├── model/
├── pkg/
├── configs/
├── docs/
├── go.mod
├── go.sum
├── .env
└── README.md
```

### Development Security
- **Local Redis**: Bind to localhost only
- **Environment Isolation**: Use separate Redis databases for different environments

## 📊 Monitoring Requirements (Optional)

### Health Checks
- **Endpoint**: `/api/healthcheck`
- **Expected Response**: 200 OK with status message

## 🚨 Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   ```bash
   # Check if Redis is running
   redis-cli ping

   # Start Redis if not running
   brew services start redis  # macOS
   sudo systemctl start redis  # Linux
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using port 8080
   lsof -i :8080

   # Kill the process or change PORT in .env
   ```

3. **Go Modules Issues**
   ```bash
   # Clean and reinstall
   go clean -modcache
   go mod tidy
   ```

4. **Swagger Not Working**
   ```bash
   # Regenerate docs
   swag init -g cmd/main.go

   # Check if docs are imported
   # Ensure _ "github/michaelwp/gobin/docs" is in router.go
   ```
