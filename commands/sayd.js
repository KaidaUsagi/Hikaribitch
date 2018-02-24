exports.run = (client, message, args) => {
    const sayMessage = args.join(" ");

    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 4
  };
  
  exports.help = {
    name: "sayd",
    description: "Says something...",
    usage: "sayd [message]"
  };