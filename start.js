const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const config = require('./settings.json');
require('./util/eventLoader')(client);

var antispam = require("discord-anti-spam");
antispam ( client, {
  warnBuffer: 3,
  maxBuffer: 5,
  interval: 1000,
  warningMessage: "Stop spamming or I'll whack your head off!",
  banMessage: "Has been banned for spamming, anyone else?"
});

const games = require('./games.json');

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: {name: games[Math.floor(Math.random() * 10) +1]} });  
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (!message.content.startsWith(config.prefix)) return;
  const input = message.content.slice(config.prefix.length).trim();
  if (!input.length) return;
  const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
});

  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
      let props = require(`./commands/${f}`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    });
  });
  
  client.reload = command => {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`./commands/${command}`)];
        let cmd = require(`./commands/${command}`);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        client.commands.set(command, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.help.name);
        });
        resolve();
      } catch (e){
        reject(e);
      }
    });
  };
  
  client.elevation = message => {
    let permlvl = 0;
    let mod_role = message.guild.roles.find('name', config.modrole);
    if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
    let admin_role = message.guild.roles.find('name', config.adminrole);
    if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
    if (message.author.id === config.ownerid) permlvl = 4;
    return permlvl;
  };
  
  client.on('warn', e => {
    console.log(e);
  });
  
  client.on('error', e => {
    console.log(e);
  });

client.login(process.env.BOT_TOKEN);
