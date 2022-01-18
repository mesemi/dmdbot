const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const checkups = require('/app/.data/checkup.json');
//const reports = require('/app/.data/reports.json')
const data = require('/app/.data/data.json')

module.exports = {
  "name": "cudeny",

	async execute(client, interaction) {
    const filter = m => m.author.id.includes(interaction.member.id);
    const collector = interaction.channel.createMessageCollector({ time: 30000 });
    const swagballs = await interaction.channel.messages.fetch(interaction.message.id);

    await swagballs.edit({content: "Checkup denied by " + interaction.member.nickname + ' :x:', components: []})
    interaction.deferReply({ephemeral: true})
    const channel = await client.channels.cache.get('874097034288848896');
    const fchannel = await client.channels.cache.get('731984961480949762');

		collector.on('collect', m => {
      fchannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been denied by <@" + interaction.member.id + ">, with feedback: " + m.content)
      checkups.checkup[interaction.message.id] = {}
      fs.writeFile('/app/.data/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
      interaction.editReply("Done!")
      collector.stop();
    });
    collector.on('end', collected => {
      if (collected.size === 0) {
        fchannel.send("<@" + checkups.checkup[interaction.message.id].user + ">, your checkup has been denied by <@" + interaction.member.id + ">")
        checkups.checkup[interaction.message.id] = {}
        fs.writeFile('/app/.data/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
        interaction.editReply("Done!")
    }});
	},
};
