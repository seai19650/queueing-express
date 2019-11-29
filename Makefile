main: start log
down: stop

start:
	docker-compose up -d

log:
	docker-compose logs -f

stop:
	docker-compose down