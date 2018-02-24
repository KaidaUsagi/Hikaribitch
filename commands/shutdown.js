exports.run = async (client, message) => {
    await message.reply(':wave: Shutting down. Bye!');
    process.exit(666);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 4
  };
  
  exports.help = {
    name: 'shutdown',
    description: 'Hikari goes to sleep!',
    usage: 'shutdown'
  };