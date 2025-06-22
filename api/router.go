package api

import (
	"github/michaelwp/gobin/model"

	_ "github/michaelwp/gobin/docs"

	"github.com/gofiber/fiber/v2"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

func Router(app *fiber.App, config *Config) {
	var (
		redisModel    = model.NewRedisModel(config.RedisClient)
		apiController = NewController(redisModel)
	)

	api := app.Group("/api")
	api.Get("/healthcheck", apiController.HealthCheck)

	routerV1(api, apiController)

	// Swagger UI route - moved to root level
	app.Get("/swagger/*", fiberSwagger.WrapHandler)
}

func routerV1(app fiber.Router, controller Controller) {
	v1 := app.Group("/v1")
	v1.Post("/pastes/add", controller.AddNewContent)
	v1.Get("/pastes/:key", controller.GetContent)
}
