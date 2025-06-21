package api

import (
	"context"
	"github/michaelwp/gobin/model"
	"github/michaelwp/gobin/pkg/uuid"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

// AddRequest represents the request body for adding new content
// @Description Request body for adding new content
type AddRequest struct {
	Content string `json:"content"`
	Expires string `json:"expires"`
}

// Response represents the standard API response
// @Description Standard API response structure
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type Controller interface {
	HealthCheck(c *fiber.Ctx) error
	AddNewContent(c *fiber.Ctx) error
	GetContent(c *fiber.Ctx) error
}

type controller struct {
	redisModel model.RedisModel
}

func NewController(redisModel model.RedisModel) Controller {
	return controller{
		redisModel: redisModel,
	}
}

// HealthCheck godoc
// @Summary Health check
// @Description Check if the API is running and healthy
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} Response
// @Router /healthcheck [get]
func (r controller) HealthCheck(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(Response{
		Status:  "success",
		Message: "hello world",
	})
}

// AddNewContent godoc
// @Summary Add new content
// @Description Create a new paste with the provided content and expiration date
// @Tags paste
// @Accept json
// @Produce json
// @Param request body AddRequest true "Content to add"
// @Success 200 {object} Response
// @Failure 400 {object} Response
// @Failure 500 {object} Response
// @Router /v1/pastes/add [post]
func (r controller) AddNewContent(c *fiber.Ctx) error {
	request := new(AddRequest)
	if err := c.BodyParser(request); err != nil {
		log.Println("error on parsing body request:", err)

		return c.Status(fiber.StatusBadRequest).JSON(&Response{
			Status:  "error",
			Message: "error on parsing body request",
		})
	}

	redisKey, err := r.generateRedisKey(c.Context())
	if err != nil {
		log.Println("error on generate redis key:", err)

		return c.Status(fiber.StatusInternalServerError).JSON(&Response{
			Status:  "error",
			Message: "error on generate redis key",
		})
	}

	timeDuration, err := parseExpirationDuration(request.Expires)
	if err != nil {
		log.Println("error on parsing expiration duration:", err)

		return c.Status(fiber.StatusInternalServerError).JSON(&Response{
			Status:  "error",
			Message: "error on parsing expiration duration",
		})
	}

	err = r.redisModel.Add(c.Context(), &model.RedisData{
		Key:        redisKey,
		Value:      request.Content,
		Expiration: timeDuration,
	})
	if err != nil {
		log.Println("error on add new content:", err)

		return c.Status(fiber.StatusInternalServerError).JSON(&Response{
			Status:  "error",
			Message: "error on add new content",
		})
	}

	return c.Status(fiber.StatusOK).JSON(Response{
		Status:  "success",
		Message: "content successfully added",
		Data:    map[string]interface{}{"key": redisKey},
	})
}

// GetContent godoc
// @Summary Get content
// @Description Retrieve content by its unique key
// @Tags paste
// @Accept json
// @Produce json
// @Param key path string true "Content key"
// @Success 200 {object} Response
// @Failure 404 {object} Response
// @Failure 500 {object} Response
// @Router /v1/pastes/{key} [get]
func (r controller) GetContent(c *fiber.Ctx) error {
	log.Println("key:", c.Params("key"))

	content, err := r.redisModel.Get(c.Context(), c.Params("key"))
	if err != nil {
		log.Println("error on get content:", err)

		return c.Status(fiber.StatusInternalServerError).JSON(&Response{
			Status:  "error",
			Message: "error on get content",
		})
	}

	return c.Status(fiber.StatusOK).JSON(Response{
		Status:  "success",
		Message: "get content successfully",
		Data:    map[string]interface{}{"content": content},
	})
}

func (r controller) generateRedisKey(ctx context.Context) (string, error) {
	exists := true
	var (
		redisKey string
		err      error
	)

	for exists {
		redisKey, err = uuid.GenerateUUID(4)
		if err != nil {
			return "", err
		}

		exists, err = r.redisModel.KeyChecking(ctx, redisKey)
		if err != nil {
			return "", err
		}
	}

	return redisKey, nil
}

func parseExpirationDuration(expiration string) (time.Duration, error) {
	expirationTime, err := time.Parse("2006-01-02", expiration)
	if err != nil {
		return 0, err
	}

	return time.Until(expirationTime), nil
}
