main: start log
down: stop

start:
	docker-compose up -d

log:
	docker-compose logs -f express

stop:
	docker-compose down