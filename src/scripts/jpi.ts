// Description
//
// Notes:
//   Image
// Commands:
//   jpi - ...

import * as hubot from "hubot";

type HubotRobot = hubot.Robot<any>;
type HubotResponse = hubot.Response<HubotRobot>;

module.exports = (robot: HubotRobot) => {
  const tori = [
    "オエーー!!!!",
    "　　　　　　　＿＿_",
    "　　　 ＿＿_／　　 ヽ",
    "　　 ／　 ／　／⌒ヽ|",
    "　　/ (ﾟ)/　／ /",
    "　 /　　 ﾄ､/｡⌒ヽ。",
    "　彳　　 ＼＼ﾟ｡∴｡ｏ",
    "`／　　　　＼＼｡ﾟ｡ｏ",
    "/　　　　 /⌒＼Ｕ∴)",
    "　　　　 ｜　　ﾞＵ｜",
    "　　　　 ｜　　　||",
    "　　　　　　　　 Ｕ"
  ].join("\n");
  const ksks = [
    "https://www.airsoft-military-news.com/wp-content/uploads/2013/09/1277186_402903759810518_1577915165_o.jpg",
    "http://specialoperations.com/wp-content/uploads/2013/02/German-KSK-Security-Set1.jpg",
    "https://i.ytimg.com/vi/IG_E4z42eGE/hqdefault.jpg",
    "https://img.ifcdn.com/images/4ac95078ab14f9205306d51ad0faa7c147cb4599676861a6551482967538a935_1.jpg",
    "http://66.media.tumblr.com/7246cdb84bf8036d2bd131a7875e13c6/tumblr_mru5adWWx21rgw5pgo1_1280.jpg"
  ];

  robot.respond(/鳥$/i, (response: HubotResponse) => {
    response.send(["```", tori, "```"].join("\n"));
  });

  robot.hear(/^jpi (.+)/i, (response: HubotResponse) => {
    const message = response.message;
    const matched = response.match[1];
    message.text = `${robot.name} image ${matched}`;
  });

  robot.respond(/KSK$/i, (response: HubotResponse) => {
    ksks.forEach(ksk => response.send(ksk));
  });
};
