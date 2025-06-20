package model

import (
	"context"
	"github.com/redis/go-redis/v9"
	"log"
	"time"
)

type RedisData struct {
	Key        string
	Value      interface{}
	Expiration time.Duration
}

type RedisModel interface {
	Add(ctx context.Context, data *RedisData) error
	KeyChecking(ctx context.Context, key ...string) (bool, error)
	Get(ctx context.Context, key string) (string, error)
}

type redisModel struct {
	RedisClient *redis.Client
}

func NewRedisModel(client *redis.Client) RedisModel {
	return redisModel{RedisClient: client}
}

func (r redisModel) Add(ctx context.Context, data *RedisData) error {
	log.Println("data:", data)

	return r.RedisClient.Set(ctx, data.Key, data.Value, data.Expiration).Err()
}

func (r redisModel) Get(ctx context.Context, key string) (string, error) {
	return r.RedisClient.Get(ctx, key).Result()
}

func (r redisModel) KeyChecking(ctx context.Context, key ...string) (bool, error) {
	exists, err := r.RedisClient.Exists(ctx, key...).Result()
	if err != nil {
		return false, err
	}

	return exists == 1, nil
}
