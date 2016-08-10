credential=./credentials/development

start: 
	source $(credential);./bin/hubot --adapter slack

start-local:
	source $(credential);./bin/hubot
