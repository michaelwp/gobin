.PHONY: build
build:
	go build -o ./bin/gobin ./cmd/main.go

.PHONY: run
run:
	./bin/gobin

.PHONY: lint
lint:
	golangci-lint run -c ./configs/.golangci.yml

.PHONY: lint-fix
lint-fix:
	golangci-lint run --fix -c ./configs/.golangci.yml

.PHONY: swag-init
swag-init:
	swag init -g ./cmd/main.go -d . -o ./docs

.PHONY: run-dev
run-dev:
	air -c ./configs/.air.toml
	cd ./web && npm run dev
