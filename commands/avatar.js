const Discord = require("discord.js");
exports.run = async (client, message, args) => {
    let user = message.mentions.users.first();
    const msg = await message.channel.send("Generating avatar...")
    var embed = new Discord.RichEmbed()
    embed.setTitle(`${user}'s avatar:`)
    embed.setColor(0xEECFA1)
    embed.setImage(`${user.avatarURL}`)
    embed.setTimestamp()
   return msg.edit(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'avatar',
    description: 'Profile picture',
    usage: 'avatar [mention]'
  };