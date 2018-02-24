module.exports = (client, member) => {
  // Load the guild's settings
  const settings = require("../settings.json");
  const welcomeMessage = "⊂((・▽・))⊃ Mrrru! A new kitten has just arrived to  **Neko-Nii**!";
  let guild = client.guild

  client.guild.channels.find("name", settings.welcomeChannel).send(welcomeMessage).catch(console.error);
};