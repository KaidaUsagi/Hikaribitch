const Discord = require('discord.js');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'logs');
  if (!modlog) return message.reply('*sniff sniff!* I cannot find a logs channel!');
  if (message.mentions.users.size < 1) return message.reply('Huh!? Who\'s gonna fly on the server\'s door?').catch(console.error);
  if (reason.length < 1) return message.reply('Mrreow!Gimme a reason for the ban.');
  message.channel.send('Let\'s punch the bad nekos! *miu*')

  if (!message.guild.member(user).bannable) return message.reply('OOF!I cannot ban that member');
  message.guild.ban(user, 2);

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Ban')
    .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Reason', reason);
  return client.channels.get(modlog.id).sendEmbed(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2,
};

exports.help = {
  name: 'ban',
  description: 'Bans the mentioned user.',
  usage: 'ban [mention] [reason]'
};