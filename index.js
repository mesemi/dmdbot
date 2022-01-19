const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
client.commands = new Collection();
client.buttons = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
const dataFiles = fs.readdirSync('./.data').filter(file => file.endsWith('.json'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	client.buttons.set(button.name, button);
}

/*
Discord bot made for Dauhxe's Medical Department by mesemi#0758
*/

client.once('ready', () => {
	console.log(`[MD Bot] Logged in! ✔️`);
	console.log(`[MD Bot] Currently registered data files: ` + dataFiles)
});


client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(client, interaction);
      } catch (error) {
        console.log('[MD Bot] There was an error while trying to execute: ' + interaction.commandName + ' ❌')
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
  } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId)
      if (!button) return;
      try {
        await button.execute(client, interaction);
      } catch (error) {
        console.log('[MD Bot] There was an error while trying to respond to button: ' + interaction.customId + ' ❌')
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
  } else {
    return;
  }
});


client.login(process.env.TOKEN);
