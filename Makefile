build-docker:
	make build-docker-frontend
	make build-docker-backend

build-docker-frontend:
	docker build -t epi-collect-frontend -f docker/frontend/Dockerfile .
	# TODO: Add versioning
	docker tag epi-collect-frontend epicollect/frontend:latest

build-docker-backend:
	docker build -t epi-collect-backend -f docker/backend/Dockerfile .
	# TODO: Add versioning
	docker tag epi-collect-backend epicollect/backend:latest

run-docker-local:
	docker-compose -f docker/docker-compose.yml up

run-dev:
	yarn start &
	yarn start-api

deploy:
	make build-docker
	docker push epicollect/frontend:latest
	docker push epicollect/backend:latest
	eb deploy epi-collect