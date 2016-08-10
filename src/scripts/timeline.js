// Description:
//   #timeline 用のscript
//   参加しているチャンネルへの投稿が全て#timelineに投稿される
//

"use strict"
const hubotSlack    = require("hubot-slack");
const request       = require("request");
const optoutChannel    = []
const SlackTextMessage = hubotSlack.SlackTextMessage;
const webSlackToken    = process.env.WEB_SLACK_TOKEN;
const timelineChannel  = process.env.TIMELINECHANNEL || "timeline";
const blackList        = [timelineChannel];
const linkNames        = initLinkNames();
const SlackAPI         = require('slackbotapi');

function initSlackApi(token) {
    if ( token === undefined ) {
        return new Error(`WEB_SLACK_TOKEN cannot be empty! value: undefined`);
    }
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

function initLinkNames() {
    const linkNames = process.env.LINK_NAMES;
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

function isValid(response) {
    return response.message &&
        response.message.text &&
        response.envelope &&
        response.envelope.room &&
        response.message.rawMessage &&
        response.message.rawMessage.channel;
}

module.exports = (robot => {
    robot.hear(/(.+)/, res => {
        console.log(res);
        if ( !isValid(res) ) {
            return;
        }
        // channelが消えてた
        const channelId = res.envelope.room;
        if (!isPublic(channelId)) {
            return;
        }
        const userId      = res.message.user.id;
        const userName    = res.message.user.name;
        const message     = res.message.text + ` (at <#${channelId}|${channel}> )`;
        reloadUserImages(robot, userId, () => {
            const userImage   = robot.brain.data.userImages[userId]
            const encoded     = encodeURIComponent(message);
            const req = res.http(`https://slack.com/api/chat.postMessage?token=${webSlackToken}&channel=%23${timelineChannel}&text=${encoded}&username=${userName}&link_names=${linkNames}&pretty=1&icon_url=${userImage}`).get();
            req((err, res, body) => err && robot.logger.error(err));
        });
    });
});
