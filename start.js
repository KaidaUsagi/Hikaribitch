const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const { Users, CurrencyShop } = require('./dbObjects');
const currency = new Discord.Collection();
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

Reflect.defineProperty(currency, 'add', {
  value: async function add(id, amount) {
      const user = currency.get(id);
      if (user) {
          user.balance += Number(amount);
          return user.save();
      }
      const newUser = await Users.create({ user_id: id, balance: amount });
      currency.set(id, newUser);
      return newUser;
  },
});

Reflect.defineProperty(currency, 'getBalance', {
  value: function getBalance(id) {
      const user = currency.get(id);
      return user ? user.balance : 0;
  },
});
const games = require('./games.json');

client.once('ready', async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => currency.set(b.user_id, b));

  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: {name: games[Math.floor(Math.random() * 10) +1]} });  
});




client.on('message', async message => {
  if (message.author.bot) return;
  currency.add(message.author.id, 1);

  if (!message.content.startsWith(config.prefix)) return;
  const input = message.content.slice(config.prefix.length).trim();
  if (!input.length) return;
  const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

  if (command === 'balance') {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);

  }
  else if (command === 'inventory') {
    const target = message.mentions.users.first() || message.author;
    const user = await Users.findByPrimary(target.id);
    const items = await user.getItems();
    
    if (!items.length) message.channel.send(`${target.tag} has nothing!`);
    return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
  }
  else if (command === 'transfer') {
    const currentAmount = currency.getBalance(message.author.id);
    const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
    const transferTarget = message.mentions.users.first();
    
    if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
    if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
    if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
    
    currency.add(message.author.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);
    
    return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
  }
  else if (command === 'buy') {
    const item = await CurrencyShop.findOne({ where: { name: { $like: commandArgs } } });
    if (!item) return message.channel.send(`That item doesn't exist.`);
    if (item.cost > currency.getBalance(message.author.id)) {
        return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
    }
    
    const user = await Users.findByPrimary(message.author.id);
    currency.add(message.author.id, -item.cost);
    await user.addItem(item);
    
    message.channel.send(`You've bought: ${item.name}.`);
  }
  else if (command === 'shop') {
    const items = await CurrencyShop.findAll();
    return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
  }
  else if (command === 'leaderboard') {
    return message.channel.send(
      currency.sort((a, b) => b.balance - a.balance)
          .filter(user => client.users.has(user.user_id))
          .first(10)
          .map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}💰`)
          .join('\n'),
      { code: true }
  );
  }
});

let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));
const prefix = require("./settings.json")

client.on("message", message => {
  if (!message.content.startsWith(config.prefix)) return;
  if (message.author.bot) return;

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`);
  }

  if (message.content.startsWith(config.prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
  }
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });
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
