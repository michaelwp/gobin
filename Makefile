.PHONY: build
build:
	go build -o ./bin/gobin ./cmd/main.go

.PHONY: run
run:
	./bin/gobin

.PHONY: lint
lint:
	golangci-lint run

.PHONY: lint-fix
lint-fix:
	golangci-lint run --fix

.PHONY: swag-init
swag-init:
	swag init -g ./cmd/main.go -d . -o ./docs
