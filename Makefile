.PHONY: build
build:
	go build -o ./bin/gobin ./cmd/main.go

.PHONY: run
run:
	./bin/gobin

.PHONY: lint
lint:
	golangci-lint run -c ./configs/.golangci.yml
	cd ./web && npm run lint

.PHONY: lint-fix
lint-fix:
	golangci-lint run --fix -c ./configs/.golangci.yml

.PHONY: swag-init
swag-init:
	swag init -g ./cmd/main.go -d . -o ./docs

.PHONY: run-dev
run-dev:
	make run-be run-client -j

.PHONY: run-be
run-be:
	air -c ./configs/.air.toml


.PHONY: run-client
run-client:
	cd ./web && npm run dev
