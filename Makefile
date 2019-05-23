YARN=yarn
DOCKER_COMPOSE=docker-compose
HEROKU=heroku
env=./.env
heroku_app_name=

install:
	$(YARN) install

start/docker: $(env) compile
	set -o allexport && source $< && $(DOCKER_COMPOSE) up

start/local: $(env) compile
	set -o allexport && source $< && $(MAKE) start

start: compile
	$(YARN) run start -- --name $(name) --adapter slack

start/shell: compile
	$(YARN) run start -- --name $(name)

compile:
	$(YARN) tsc

deploy/heroku:
	git push heroku master

deploy/heroku/env:
	$(HEROKU) config:push --file $(env)

deploy/heroku/setup: $(HEROKU)
	$(HEROKU) git:remote --app $(heroku_app_name)
	$(HEROKU) plugins:install heroku-config

heroku/create/scheduler: $(HEROKU)
	$(HEROKU) addons:create scheduler:standard --app $(heroku_app_name)
	$(HEROKU) addons:open scheduler --app $(heroku_app_name)

$(HEROKU):
	which heroku || echo 'please install heroku cli https://devcenter.heroku.com/articles/heroku-cli'

.env:
	cp -f env.sample $@
