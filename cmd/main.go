package main

import (
	"fmt"
	"github/michaelwp/gobin/api"
	"github/michaelwp/gobin/configs"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}

// @title Gobin API
// @version 1.0
// @description A simple pastebin application API for sharing text and code snippets
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api
// @schemes http https
func main() {
	redisClient, err := redisConfig()
	if err != nil {
		panic(err)
	}

	config := &api.Config{
		Port:        os.Getenv("PORT"),
		RedisClient: redisClient,
	}

	log.Fatal(api.Server(config))
}

func redisConfig() (*redis.Client, error) {
	redisDB, err := strconv.Atoi(os.Getenv("REDIS_DB"))
	if err != nil {
		return nil, fmt.Errorf("redis db err: %v", err)
	}

	return configs.NewRedisConnection(&configs.RedisConfig{
		Host:     os.Getenv("REDIS_HOST"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       redisDB,
	}), nil
}
