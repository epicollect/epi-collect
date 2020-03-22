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

run-db-local:
	docker run -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgis/postgis
	sleep 5
	./venv/bin/python epi_collect/api/db.py --create

stop-db-local:
	docker ps -q --filter ancestor="postgis/postgis" | xargs docker stop

run-dev:
	yarn start &
	yarn start-api

deploy:
	make build-docker
	docker push epicollect/frontend:latest
	docker push epicollect/backend:latest
	eb deploy epi-collect