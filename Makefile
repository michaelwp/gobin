.PHONY: build
build:
	go build -o ./bin/gobin ./cmd/main.go

.PHONY: run
run:
	./bin/gobin