package api

import (
	"github/michaelwp/gobin/model"

	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App, config *Config) {
	var (
		redisModel    = model.NewRedisModel(config.RedisClient)
		apiController = NewController(redisModel)
	)

	app.Get("/:key", apiController.GetContent)

	api := app.Group("/api")
	api.Get("/healthcheck", apiController.HealthCheck)

	routerV1(api, apiController)
}

func routerV1(app fiber.Router, controller Controller) {
	v1 := app.Group("/v1")
	v1.Post("/add", controller.AddNewContent)
}
