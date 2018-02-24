const Discord = require('discord.js');
const green = '#008000';
const palevioletred = '#FF82AB';
const yellow = '#FFD700';

exports.run = function(client, message, args) {
  var embed = new Discord.RichEmbed();
  embed.setTitle('About Hikari')
  embed.setDescription('Hi. I am **HikariBOT**, I am here to kick plebs, ban invadators and make your Discord Server a kawaii place full of nekos. My commands can be viewed by the **_nekocmds_** command. \nHere are some examples of my Fun-Commands: \n:8ball: Interactive 8ball \n:robot: CleverBot/talk \n:rosette: Fun slots. \n\nOr even **Moderation**. \n-Kick \n-Mute \n-Ban \n-Moderation logs \nLock-down and more!');
  embed.setColor('FF82AB');
  embed.setThumbnail('https://cdn.discordapp.com/avatars/334645932408963072/117e23a0183ccc2fd96c0b9441f3543f.webp?size=1024')
  embed.addField('Uptime in mili-seconds', `${client.uptime}`);
  embed.addField('Discriminator', 1147);
  embed.addField('Users <3', `${client.users.size}`)
  embed.addField('Channels (nekos <3)', `${client.channels.size}`)
  embed.addField('Shard(s)', '[object Object]')
  embed.addField('Commands', '29 -- API usen 5. ')
  embed.addField('Made in Kaida\'s basement', 'Locations are subject to copyright.')
  embed.setFooter('Hikari status')
  embed.setTimestamp()

  message.channel.sendEmbed(embed);
};

exports.conf = {
enabled: true,
guildOnly: false,
aliases: [],
permLevel: 0
};

exports.help = {
name: 'about',
description: 'Get all the additional info which arent viewed in other commands.',
usage: 'GET INFO'
};