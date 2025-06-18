package model

import (
	"context"
	"github.com/redis/go-redis/v9"
	"time"
)

type RedisData struct {
	Key        string
	Value      interface{}
	Expiration time.Duration
}

type RedisModel interface {
	Add(ctx context.Context, data *RedisData) error
}

type redisModel struct {
	RedisClient *redis.Client
}

func NewRedisModel(client *redis.Client) RedisModel {
	return redisModel{RedisClient: client}
}

func (r redisModel) Add(ctx context.Context, data *RedisData) error {
	return r.RedisClient.Set(ctx, data.Key, data.Value, data.Expiration).Err()
}
