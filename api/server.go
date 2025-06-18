package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

type Config struct {
	Port        string
	RedisClient *redis.Client
}

func Server(config *Config) error {
	app := fiber.New()
	Router(app, config)
	return app.Listen(config.Port)
}
