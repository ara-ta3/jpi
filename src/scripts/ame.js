// Description:
//   ame
//
// Notes:
//   ame
//
// Commands:
//   hubot ame - 雨

"use strict";

const appId = process.env.HUBOT_YAHOO_APP_ID;

module.exports = (robot) => {
    robot.respond(/AME$/i, (msg) => {
        msg.send(`http://map.olp.yahooapis.jp/OpenLocalPlatform/V1/static?appid=${appId}&lat=35.66180890&lon=139.70406480&z=12&width=500&height=500&overlay=type:rainfall`);
    });
};
