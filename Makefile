credential=./credentials/development

start: 
	./bin/hubot-slack $(credential)

start-local:
	source $(credential);./bin/hubot
