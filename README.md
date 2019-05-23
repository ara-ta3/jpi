a bot
---

[![Build Status](https://travis-ci.com/ara-ta3/jpi.svg?branch=master)](https://travis-ci.com/ara-ta3/jpi)

[![CircleCI](https://circleci.com/gh/ara-ta3/jpi/tree/master.svg?style=svg)](https://circleci.com/gh/ara-ta3/jpi/tree/master)

# Deployment

## HEROKU

[HEROKU](https://id.heroku.com/login)

```zsh
# setup heroku client
$make deploy/heroku/setup heroku_app_name=foo_bar_apps

# edit your env variable
# Please get HUBOT_SLACK_TOKEN from https://slack.com/apps/A0F7XDU93-hubot
# Please get HUBOT_GOOGLE_CSE_ID and HUBOT_GOOGLE_CSE_KEY from https://cse.google.com/cse/create/new
$make .env
$vi .env

# deploy envs to heroku
$make deploy/heroku/env

# deploy application to heroku
$make deploy/heroku

# setting for heroku keep alive
$make heroku/create/scheduler

# see details
$cat Makefile
```
