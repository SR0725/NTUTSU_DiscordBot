const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const { token } = require('./token.json');
const talkAI = require('./talk/index.cjs');
const meta = require('./meta.cjs');

const client = new Client();
var mainChannel;
const fs = require('fs')
var deleteMsgUser = '';
client.on('message', async msg => {
    if (msg.author.bot) {
        return;
    }

    //刪除訊息
    if (msg.content === 'Hey機器人 幫我刪除訊息') {
        if (deleteMsgUser) {
            msg.channel.send('有人正在刪除訊息，為避免衝突請稍後再試)');
        } else if (msg.member.hasPermission("ADMINISTRATOR")) {
            deleteMsgUser = msg.author.id;
            setTimeout(function () {
                if (msg.author.id === deleteMsgUser) {
                    msg.channel.send('刪除操作過時，請重新下達指令');
                    deleteMsgUser = 0;
                }
            }, 10000);
            msg.channel.send('好的，幾條訊息呢?(請輸入純數字 最高50條)');
        } else {
            msg.channel.send('權限不足，無法進行該操作(需要最高權限)');
        }
        return;
    } else if (deleteMsgUser === msg.author.id) {
        let deleteNumber = parseInt(msg.content);
        deleteNumber = (deleteNumber > 50) ? 50 : deleteNumber;
        if (deleteNumber <= 0) {
            return;
        }
        msg.channel.messages.fetch({ limit: deleteNumber }).then(messages => {
            messages.forEach(message => message.delete())
        })
        setTimeout(function () {
            deleteMsgUser = 0;
        }, 30000);
        return;
    }
    //紀錄點
    if (msg.content === '訊息頻道在這裡喔!北科學生會機器人><!!  以後網頁通知就傳在這裡即可') {
        let newChannelID = msg.channel.id;
        fs.writeFileSync('./Modules/discordBot/channel.json', newChannelID);
        mainChannel = await client.channels.fetch(newChannelID)
        mainChannel.send('好的，窩知道ㄌowob');
        return;
    }

    //聊天功能
    let response = await talkAI.talk(msg.content);
    if (response) {
        msg.channel.send(response);
    }
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var channelID = fs.readFileSync('./Modules/discordBot/channel.json', 'utf8')
    mainChannel = await client.channels.cache.get(channelID)
    meta.init(mainChannel, 30000);
    system.ready = true;
});

client.login(token);


const system = {
    data: {
        articleFilled: {

        }
    },
    announcement(title, content) {
        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(0x19304a)
            .setDescription(content)

        mainChannel.send(embed);
    },
    articleFilledNeedAnnouncement(articleTitle) {
        if (system.data.articleFilled[articleTitle]) {
            system.data.articleFilled[articleTitle]++;
        } else {
            system.data.articleFilled[articleTitle] = 1;
        }
    },
    updateAnnouncement() {
        let announcementContent = '';
        for (const [title, number] of Object.entries(system.data.articleFilled)) {
            announcementContent +=
                `**${title}**表單有${number}則新回復 => https://ntutsu.com/Article/${title}\n`
        }
        if (announcementContent) {
            system.announcement('表單回復報告', announcementContent);
        }
        system.data.articleFilled = {};
        setTimeout(system.updateAnnouncement, 21600000);
    }
}

system.updateAnnouncement();
module.exports = system;
