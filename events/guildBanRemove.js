const Discord = require('discord.js');

module.exports = (guild, user) => {
  guild.defaultChannel.sendMessage(`${user.username} was just unbanned! He/She can come back now!`);
};