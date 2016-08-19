// Description:
//
// Commands:
//   hubot 鳥 - 鳥
//

"use strict"

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
    "　　　　　　　　 Ｕ",
].join("\n");

module.exports = (robot) => {
    robot.respond(/鳥$/i, (msg) => {
        msg.send(["```", tori,"```"].join("\n"));
    })
}
