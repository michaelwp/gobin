package api

import (
	"github.com/gofiber/fiber/v2"
	"github/michaelwp/gobin/model"
)

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type Controller interface {
	HealthCheck(c *fiber.Ctx) error
	Add(c *fiber.Ctx) error
}

type controller struct {
	redisModel model.RedisModel
}

func NewController(redisModel model.RedisModel) Controller {
	return controller{
		redisModel: redisModel,
	}
}

func (r controller) HealthCheck(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(Response{
		Status:  "success",
		Message: "hello world",
	})
}

func (r controller) Add(c *fiber.Ctx) error {
	return nil
}
