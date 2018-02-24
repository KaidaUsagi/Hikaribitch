const Discord = require('discord.js');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'logs');
  if (!modlog) return message.reply('*sniff sniff!* I cannot find a logs channel');
  if (message.mentions.users.size < 1) return message.reply('Nya!Gimme a name and i\'ll warn him/her!').catch(console.error);
  if (reason.length < 1) return message.reply('meow reason, meow reason what\'s the reason?');
  message.channel.send("Woah! Who's naughty?");
  
  const embed = new Discord.RichEmbed()
  .setColor(0xFFB90F)
  .setTimestamp()
  .addField('Action:', 'Warning')
  .addField('User:', `${user.username}#${user.discriminator}`)
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
  name: 'warn',
  description: 'Issues a warning to the mentioned user.',
  usage: 'warn [mention] [reason]'
};