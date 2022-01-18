const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

/*
Discord bot made for Dauhxe's Medical Department by mesemi#0758
*/

client.once('ready', () => {
	console.log(`[MD Bot] Logged in! ✔️`);
});


client.on('interactionCreate', async interaction => {

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
  
  const gradingChannel = await client.channels.cache.get('910191784678789160')
  const gradeChannel = await client.channels.cache.get('910192523069255720')
  
  module.exports = {
    gradingChannel,
    gradeChannel
  };

	try {
    console.log('[MD Bot] ' + interaction.member.displayName + ' just ran the command "' + interaction.commandName + '" 📝')
		await command.execute(client, interaction);
	} catch (error) {
    console.log('[MD Bot] There was an error while trying to execute ' + command + ' ❌')
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
  
  const checkups = require('./data/checkup.json');
  //const reports = require('./data/reports.json')
  const data = require('./data/data.json')
  const gradingChannel = await client.channels.cache.get('910191784678789160')
  const gradeChannel = await client.channels.cache.get('910192523069255720')
  
  const filter = m => m.author.id.includes(interaction.member.id);
  const collector = interaction.channel.createMessageCollector({ time: 30000 });
  const swagballs = await interaction.channel.messages.fetch(interaction.message.id);
  if (interaction.customId === "cuaccept") { await swagballs.edit({content: "Checkup accepted by " + interaction.member.nickname + ' ✅', components: []}) } else if (interaction.customId === "cudeny") {await swagballs.edit({content: "Checkup denied by " + interaction.member.nickname + ' :x:', components: []})} /*else if (interaction.customId === "raaccept") {await swagballs.edit({content: "Report accepted by " + interaction.member.nickname + ' ✅', components: []})} else if (interaction.customId === "radeny") {await swagballs.edit({content: "Report denied by " + interaction.member.nickname + ' :x:', components: []})}*/ else {await interaction.reply("Litterally how")}
  interaction.deferReply({ephemeral: true})
  if (interaction.customId === 'cuaccept') {
    collector.on('collect', m => {
      if (!data.user[checkups.checkup[interaction.message.id].user]) {
                            data.user[checkups.checkup[interaction.message.id].user] = {
                              'cuDone': 0,
                            }
                          }
      data.user[checkups.checkup[interaction.message.id].user].cuDone += 1
      gradeChannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been accepted by <@" + interaction.member.id + ">, with feedback: " + m.content)
      checkups.checkup[interaction.message.id] = {}
      fs.writeFile('./data/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
      fs.writeFile('./data/data.json', JSON.stringify(data), function (err) {if (err) throw err;});
      interaction.editReply("Done!")
      collector.stop();
    });
    collector.on('end', collected => {
      if (collected.size === 0) {
        if (!data.user[checkups.checkup[interaction.message.id].user]) {
                              data.users[checkups.checkup[interaction.message.id].user] = {
                                'cuDone': 0,
                              }
                            }
        data.user[checkups.checkup[interaction.message.id].user].cuDone += 1
        gradeChannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been accepted by <@" + interaction.member.id + ">")
        checkups.checkup[interaction.message.id] = {}
        fs.writeFile('./data/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
        fs.writeFile('./data/data.json', JSON.stringify(data), function (err) {if (err) throw err;});
        interaction.editReply("Done!")
    }});
  } else if (interaction.customId === "cudeny") {
    collector.on('collect', m => {
      gradeChannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been denied by <@" + interaction.member.id + ">, with feedback: " + m.content)
      checkups.checkup[interaction.message.id] = {}
      fs.writeFile('./app/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
      fs.writeFile('./data/data.json', JSON.stringify(data), function (err) {if (err) throw err;});
      interaction.editReply("Done!")
      collector.stop();
    });
    collector.on('end', collected => {
      if (collected.size === 0) {
        gradeChannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been denied by <@" + interaction.member.id + ">")
        checkups.checkup[interaction.message.id] = {}
        fs.writeFile('./app/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
        fs.writeFile('./data/data.json', JSON.stringify(data), function (err) {if (err) throw err;});
        interaction.editReply("Done!")
    }});
  /*} else if (interaction.customId === "raaccept") {
    collector.on('collect', m => {
      fchannel.send("<@" + reports.report[interaction.message.id].user + ">, your RA report has been accepted by <@" + interaction.member.id + ">, with feedback: " + m.content)
      reports.test[interaction.message.id] = {}
      fs.writeFile('./commands/reports.json', JSON.stringify(reports), function (err) {if (err) throw err;});
      interaction.editReply("Done!")
      collector.stop();
    });
    collector.on('end', collected => {
      if (collected.size === 0) {
        fchannel.send("<@" + reports.report[interaction.message.id].user + ">, your RA report has been accepted by <@" + interaction.member.id + ">")
        reports.report[interaction.message.id] = {}
        fs.writeFile('./commands/reports.json', JSON.stringify(reports), function (err) {if (err) throw err;});
        interaction.editReply("Done!")
    }});
  } else if (interaction.customId === "radeny") {
    collector.on('collect', m => {
      fchannel.send("<@" + reports.report[interaction.message.id].user + ">, your RA report has been denied by <@" + interaction.member.id + ">, with feedback: " + m.content)
      reports.test[interaction.message.id] = {}
      fs.writeFile('./commands/reports.json', JSON.stringify(reports), function (err) {if (err) throw err;});
      interaction.editReply("Done!")
      collector.stop();
    });
    collector.on('end', collected => {
      if (collected.size === 0) {
        fchannel.send("<@" + reports.report[interaction.message.id].user + ">, your RA report has been denied by <@" + interaction.member.id + ">")
        reports.report[interaction.message.id] = {}
        fs.writeFile('./commands/reports.json', JSON.stringify(reports), function (err) {if (err) throw err;});
        interaction.editReply("Done!")
    }});*/
  } else {
    interaction.editReply({content: "Unknown button. How did you do that?"})
  }
});

client.login(process.env.TOKEN);