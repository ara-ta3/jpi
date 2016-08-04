// Description:
//   Images
//
// Notes:
//   Image
// Commands:
//   jpi - ...

"use strict";

module.exports = (robot) => {
    robot.hear(/^jpi (.+)/i, (msg) => {
        const message = msg.message;
        const matched = msg.match[1];
        message.text = `${robot.name} image ${matched}`;
    });
};
