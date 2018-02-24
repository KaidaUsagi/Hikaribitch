const Discord = require('discord.js');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'logs');
  if (!modlog) return message.reply('*sniff sniff!*I cannot find a logs channel!');
  if (message.mentions.users.size < 1) return message.reply('who will leave the neko house? /ᐠ｡ꞈ｡ᐟ ').catch(console.error);
  if (reason.length < 1) return message.reply('Mrreow!Gimme a reason for the kick.');

  if (!message.guild.member(user).kickable) return message.reply('OOF! I cannot kick that member (^._.^)ﾉ');
  message.guild.member(user).kick();

  const embed = new Discord.RichEmbed()
    .setColor(0xC0FF3E)
    .setTimestamp()
    .addField('Action:', 'kick')
    .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Reason', reason);
  return client.channels.get(modlog.id).sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick [mention] [reason]'
};