package api

import (
	"github.com/gofiber/fiber/v2"
	"github/michaelwp/gobin/model"
)

func Router(app *fiber.App, config *Config) {
	var (
		redisModel    = model.NewRedisModel(config.RedisClient)
		apiController = NewController(redisModel)
	)

	api := app.Group("/api")
	api.Get("/healthcheck", apiController.HealthCheck)

	routerV1(api)
}

func routerV1(app fiber.Router) {
	v1 := app.Group("/v1")
	v1.Post("/add", apiController.Add)
}
