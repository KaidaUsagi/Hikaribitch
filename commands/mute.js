const Discord = require('discord.js');

exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let member = message.mentions.members.first();
  let modlog = message.guild.channels.find('name', 'logs');
  let muteRole = message.guild.roles.find('name', 'muted');
  if (!modlog) return message.reply('*sniff sniff!* I cannot find a logs channel').catch(console.error);
  if (!muteRole) return message.reply('*sniff sniff!* I cannot find a mute role').catch(console.error);
  if (reason.length < 1) return message.reply('meow reason, meow reason what\'s the reason?').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('Nya!Gimme a name and He/She\'ll keep silent!').catch(console.error);
  const embed = new Discord.RichEmbed()
  .setColor(0x8B8378)
  .setTimestamp()
  .addField('Action:', 'Mute')
  .addField('User:', `${member.user.tag}`)
  .addField('Moderator:', `${message.author.tag}`)
  .addField('Reason', reason);

  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (member.roles.has(muteRole.id)) {
    member.removeRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    })
    .catch(e=>console.error("Cannot remove muted role: " + e));
  } else {
    member.addRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    })
    .catch(e=>console.error("Cannot add muted role: " + e));
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['unmute'],
  permLevel: 3
};

exports.help = {
  name: 'mute',
  description: 'mutes or unmutes a mentioned user',
  usage: 'un/mute [mention] [reason]'
};