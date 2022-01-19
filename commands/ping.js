const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
    if (interaction.member.id === '304002526141874187') {
      const info = require('/app/embeds/information.json')
      const guidelines = require('/app/embeds/guidelines.json')
      await interaction.channel.send(guidelines)
      interaction.reply('a')
    } else {
      await interaction.reply({content: 'Pong!', ephemeral: true});
    }
	},
};
