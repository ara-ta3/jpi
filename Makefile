NPM=$(shell which npm)
HEROKU=$(shell which heroku)
credential=./credentials/development
env=./.env
heroku_app_name=

start/local: $(env)
	set -o allexport && source $< && \
		$(NPM) run start -- --name $(name) --adapter slack

start/local/shell:
	$(NPM) run start -- --name $(name)

deploy/heroku:
	git push heroku master

deploy/heroku/env:
	$(HEROKU) config:push --file $(env)

deploy/heroku/setup: $(HEROKU)
	$(HEROKU) git:remote --app $(heroku_app_name)
	$(HEROKU) plugins:install heroku-config

$(HEROKU):
	which heroku || echo 'please install heroku cli https://devcenter.heroku.com/articles/heroku-cli'

.env:
	cp -f env.sample $@
