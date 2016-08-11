// Description:
//   #timeline 用のscript
//   参加しているpublicチャンネルへの投稿が全て#timelineに投稿される
// Commands:
//   hubot join all - 存在する全てのpublicチャンネルに参加する
//   hubot timeline exclude {channel name} - #timelineに通知するチャンネルから除外する
//   hubot timeline include {channel name} - #timelineに通知するチャンネルに含める(除外していなければ通知される)
//

"use strict"
const hubotSlack    = require("hubot-slack");
const request       = require("request");
const optoutChannel    = []
const SlackTextMessage = hubotSlack.SlackTextMessage;
const webSlackToken    = process.env.WEB_SLACK_TOKEN;
const timelineChannel  = process.env.TIMELINECHANNEL || "timeline";
const blackList        = [timelineChannel];
const linkNames        = initLinkNames(process.env.LINK_NAMES);
const SlackAPI      = require('slackbotapi');
const slack         = initSlackApi(webSlackToken);
const HUBOT_TIMELINE= "TIMELINE_CHANNEL_EXCLUDED"

function initSlackApi(token) {
    try {
        return new SlackAPI({
            'token': token,
            'logging': false,
            'autoReconnect': true
        });
    } catch (e) {
        return e;
    }
};

function initLinkNames(linkNames) {
    if (linkNames !== "0" && linkNames !== "1") {
        return 0;
    };

    return linkNames;
}

function isPublic(channelId) {
    return channelId.substring(0,1) === 'C';
}

function isBlackListChannel(ch) {
    return blackList.indexOf(ch) !== -1;
}

function reloadUserImages(robot, userId, callback) {
    if (!robot.brain.data.userImages) {
        robot.brain.data.userImages = {};
    }
    if( !robot.brain.data.userImages[userId] ) {
        robot.brain.data.userImages[userId] = "";
    }
    if (robot.brain.data.userImages[userId] != "") {
        return callback();
    }
    // TODO using slack api
    const options = {
        url: `https://slack.com/api/users.list?token=${webSlackToken}&pretty=1`,
            timeout: 2000,
        headers: {}
    };

    request(options, (error, response, body) => {
        error && robot.logger.error(error);
        const json = JSON.parse(body);
        for (let i = 0; i < json.members.length; ++i) {
            const image = json.members[i].profile.image_48
            robot.brain.data.userImages[json.members[i].id] = image
        }
        callback();
    });
}

class TimelineRepository {
    constructor(brain) {
        this.brain = brain;
    }

    exclude(channel) {
        const current = this.brain.get(HUBOT_TIMELINE) || [];
        const next = current.concat([channel]);
        this.brain.set(HUBOT_TIMELINE, next);
        return next;
    }

    include(channel) {
        const current = this.brain.get(HUBOT_TIMELINE) || [];
        const next = current.filter((ch) => ch !== channel);
        this.brain.set(HUBOT_TIMELINE, next);
        return next;
    }

    getExcludedList() {
        return this.brain.get(HUBOT_TIMELINE);
    }
}

module.exports = (robot => {
    const timelineRepository = new TimelineRepository(robot.brain);

    robot.hear(/(.+)/, res => {
        const channelId   = res.message.rawMessage.channel
        const channel     = res.envelope.room;
        if (!isPublic(channelId)) {
            return;
        }

        const blackList = timelineRepository.getExcludedList();
        if ( blackList.indexOf(channel) !== -1 ) {
            return;
        }
        const userId      = res.message.user.id;
        const userName    = res.message.user.name;
        const message     = res.message.text + ` (at <#${channelId}|${channel}> )`;
        reloadUserImages(robot, userId, () => {
            const userImage   = robot.brain.data.userImages[userId]
            const encoded     = encodeURIComponent(message);
            // TODO using slack api
            const req = res.http(`https://slack.com/api/chat.postMessage?token=${webSlackToken}&channel=%23${timelineChannel}&text=${encoded}&username=${userName}&link_names=${linkNames}&pretty=1&icon_url=${userImage}`).get();
                req((err, res, body) => err && robot.logger.error(err));
        });
    });

    robot.respond(/timeline exclude (.+)/, res => {
        const target = res.match[1].replace(/\#/, "");
        slack.reqAPI("channels.list", {
            exclude_archived: 1
        }, (listResponse) => {
            if(!listResponse.ok) {
                robot.logger.error(`something ocuured ${listResponse}`);
                return;
            }
            if (listResponse.channels.map((ch) => ch.name).indexOf(target) === -1) {
                return res.send(`channel ${target} は見つからないぱか`);
            }
            timelineRepository.exclude(target);
            res.send(`channel ${target} は #timeline に通知されないぱか`);
        });
    });

    robot.respond(/timeline include (.+)/, res => {
        const target = res.match[1].replace(/\#/, "");
        slack.reqAPI("channels.list", {
            exclude_archived: 1
        }, (listResponse) => {
            if(!listResponse.ok) {
                robot.logger.error(`something ocuured ${listResponse}`);
                return;
            }
            if (listResponse.channels.map((ch) => ch.name).indexOf(target) === -1) {
                return res.send(`channel ${target} は見つからないぱか`);
            }
            timelineRepository.include(target);
            res.send(`channel ${target} は #timeline に通知されるぱか`);
        });
    });

    robot.respond(/timeline status/, res => {
        const blackListTargets = timelineRepository.getExcludedList();
        if (blackListTargets.length === 0) {
            return res.send(`今は全てのpublibチャンネルが #timeline に通知されるぱか`)
        }
        const channels = blackListTargets.join(",")
        res.send(`今 #timeline に通知されないのは ${channels} のチャンネルぱか`)
    });

    robot.respond(/join all/i, res => {
        if (slack instanceof Error) {
            robot.logger.error(slack);
            return res.send("Something ocuured to slack api client!");
        }

        const bot = slack.getUser(robot.name);
        slack.reqAPI("channels.list",{
            exclude_archived: 1
        }, (listResponse) => {
            if(!listResponse.ok) {
                robot.logger.error(`something ocuured ${listResponse}`);
                return;
            }
            listResponse.channels
            .filter((ch) => (ch.id.substring(0, 1) === 'C') )
            .forEach((ch) => {
                slack.reqAPI("channels.invite", {
                    channel: ch.id,
                    user: bot.id
                }, (inviteResponse) => {
                    if( inviteResponse.ok ) {
                        res.send(`joined <#${ch.id}|${ch.name}>`)
                    } else {
                        if (inviteResponse.error !== 'already_in_channel' ) {
                            robot.logger.error(`failed to join to ${ch.name}`);
                            robot.logger.error(inviteResponse);
                        };
                    }
                });
            });
        });
    })
});
