const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('inactivity')
        .setDescription('Registers your inactivity.')
        .addStringOption(option =>
            option.setName('request')
                  .setDescription('Start or end an inactivity period.')
                  .setRequired(true)
                  .addChoice('start', 'start')
                  .addChoice('end', 'end'))
        .addStringOption(option =>
            option.setName('enddate')
                  .setDescription('Provide an ending date for inactivity.'))
        .addStringOption(option =>
            option.setName('reason')
                  .setDescription('Provide a reason for starting inactivity.')),
	async execute(client, interaction) {
        const fs = require('fs');
        const inactivities = require('/app/data/inactivity.json');
        const request = interaction.options.getString("request");
        const enddate = interaction.options.getString("enddate");
        const reason = interaction.options.getString("reason");
        const playa = interaction.user.id;
        const { MessageEmbed } = require('discord.js');
        const startEmbed = new MessageEmbed()
            .setColor(3373995)
            .setTitle(interaction.member.displayName + "'s inactivity Notice")
            .setDescription('Reason for Inactivity: ' + reason)
            .addFields(
                { name: 'Start date:', value: interaction.createdAt.toDateString() + ' ', inline: true, },
                { name: 'End date:', value: enddate + ' ', inline: true },
            )
            .setTimestamp()
        const endEmbed = new MessageEmbed()
            .setColor('#261a9e')
            .setTitle(interaction.member.displayName + "'s inactivity has ended.")
            .setTimestamp()
        if (interaction.channel.name !== 'inactivity-notice'){
            await interaction.reply({content: "Wrong channel.", ephemeral: true});
            return;
        } else {
            if (request == 'start') {
                if (!inactivities.inactivities[playa] || inactivities.inactivities[playa] === 0) {
                    inactivities.inactivities[playa] = 1
                    fs.writeFile('/app/data/inactivity.json', JSON.stringify(inactivities), function (err) { if (err) throw err;});
                    const role = interaction.guild.roles.cache.get('910139060830486569');
                    interaction.member.roles.add(role);
                    await interaction.reply({ embeds: [startEmbed] });
                } else {
                    if (!enddate || !reason) {
                        await interaction.reply({content: "Missing arguments.", ephemeral: true});
                    } else if (!inactivities.inactivites[playa] === 1) {
                        await interaction.reply({content: "You already have a inactivity notice active!", ephemeral: true,});
                        return;
                    } else {
                      await interaction.reply({content: "Dont know what happened. Ask mesemi.", ephemeral: true,})
                      return;
                    }
                }
            } else {
                if (inactivities.inactivities[playa] !== 0) {
                    inactivities.inactivities[playa] = 0;
                    fs.writeFile('/app/data/inactivity.json', JSON.stringify(inactivities), function (err) { if (err) throw err;});
                    await interaction.reply({ embeds: [endEmbed] });
                } else {
                    await interaction.reply({content: "No inactivity to end.", ephemeral: true});
                }
            }
        }
	},
};