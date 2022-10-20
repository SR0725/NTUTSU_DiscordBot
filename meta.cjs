const token = "xxxxxxxxxxxxxxxx";
const fburl = "https://graph.facebook.com/v14.0/151195418224993?fields=conversations%7Bmessages%7Bmessage%2Cfrom%2Ccreated_time%7D%7D&access_token=" + token;
const igurl = "https://graph.facebook.com/v14.0/17841406642769043/media?fields=comments%7Bfrom%2Ctimestamp%2Ctext%7D%2Cpermalink&access_token=" + token;

const axios = require('axios');
const { MessageEmbed } = require('discord.js');

var mainChannel;
var rangeTime;

const system = {
    init(_mainChannel, _rangeTime) {
        mainChannel = _mainChannel;
        rangeTime = _rangeTime;
        system.sendNewMessage();
        setInterval(system.sendNewMessage, rangeTime);
    },
    sendNewMessage() {
        system.getFBMessage();
    },
    getFBMessage() {
        axios.get(fburl)
            .then((res) => {
                let users = res.data.conversations.data;
                for (var userIndex = 0; userIndex < users.length; userIndex++) {
                    perUserMessages = users[userIndex].messages.data;
                    for (var messageIndex = 0; messageIndex < perUserMessages.length; messageIndex++) {
                        perMessage = perUserMessages[messageIndex];
                        if (perMessage.from.id === "151195418224993") {
                            continue;
                        }
                        let messageTime = new Date(perMessage.created_time).getTime();
                        if (Date.now() < messageTime + rangeTime + 5000) {
                            let messageDayTime = new Date(perMessage.created_time);
                            const embed = new MessageEmbed()
                                .setTitle(`來自${perMessage.from.name}的新訊息`)
                                .setColor(0x19304a)
                                .setDescription(perMessage.message +
                                    `\n時間: ${messageDayTime.getFullYear()}/${messageDayTime.getMonth()}/${messageDayTime.getDate()} ${messageDayTime.getHours()}:${messageDayTime.getMinutes()}:${messageDayTime.getSeconds()}` +
                                    `\n連結: https://business.facebook.com/latest/home?asset_id=151195418224993&nav_ref=bm_home_redirect`)

                            mainChannel.send(embed);
                        }
                    }
                }
            })
            .catch((error) => { console.error(error) });
    },
    getIGMessage() {
        axios.get(igurl)
            .then((res) => {
                let igComments = res.data.data;
                for (var commentsIndex = 0; commentsIndex < igComments.length; commentsIndex++) {
                    perComments = igComments[commentsIndex].comments.data;
                    for (var ctIndex = 0; ctIndex < perComments.length; ctIndex++) {
                        perCt = perComments[ctIndex];
                        if (perCt.from.id === "17841406642769043") {
                            continue;
                        }
                        let messageTime = new Date(perCt.timestamp).getTime();
                        if (Date.now() < messageTime + rangeTime + 5000) {
                            let messageDayTime = new Date(perCt.timestamp);
                            const embed = new MessageEmbed()
                                .setTitle(`IG 來自${perCt.from.username}的新訊息`)
                                .setColor(0x19304a)
                                .setDescription(perCt.text +
                                    `\n時間: ${messageDayTime.getFullYear()}/${messageDayTime.getMonth()}/${messageDayTime.getDate()} ${messageDayTime.getHours()}:${messageDayTime.getMinutes()}:${messageDayTime.getSeconds()}` +
                                    `\n連結: https://business.facebook.com/latest/home?asset_id=151195418224993&nav_ref=bm_home_redirect`)

                            mainChannel.send(embed);
                        }
                    }
                }
            })
            .catch((error) => { console.error(error) });
    }
}
module.exports = system;
