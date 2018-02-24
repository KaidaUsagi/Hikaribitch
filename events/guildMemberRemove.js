module.exports = (client, member) => {
   // Load the guild's settings
  const settings = require("../settings.json");
  const welcomeMessage = `OOH!One of the nekos left the server unfortunately, Nyaa~! We'll miss you! (っ˘̩╭╮˘̩)っ`;
  let guild = client.guild 
  
  client.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);
};