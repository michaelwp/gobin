package configs

import "github.com/redis/go-redis/v9"

type RedisConfig struct {
	Host     string
	Password string
	DB       int
}

func NewRedisConnection(config *RedisConfig) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Host,
		Password: config.Password,
		DB:       config.DB,
	})
}
