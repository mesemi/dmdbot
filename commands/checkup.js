const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('checkup')
      .setDescription('Submit your checkup log.')
      .addStringOption(option =>
              option.setName('thedate')
                    .setDescription('Date the checkup took place.')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('departmentrank')
                    .setDescription('Current rank in the Medical Department.')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('dclass')
                    .setDescription('Class-D(s) being checked on.')
                    .setRequired(true))
      .addIntegerOption(option =>
              option.setName('combatives')
                    .setDescription('Number of combatives escorting the checkup.')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('description')
                    .setDescription('The checkup described in detail.')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('conclusion')
                    .setDescription('The conclusion derived from the checkup.')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('proof')
                    .setDescription('MUST BE A LINK')
                    .setRequired(true))
      .addStringOption(option =>
              option.setName('spectators')
                    .setDescription('The spectators watching the checkup')
                    .setRequired(false))
      .addStringOption(option =>
              option.setName('notes')
                    .setDescription('Any additional notes.')),
	async execute(client, interaction) {
        const fs = require('fs');
        const checkups = require('/app/data/checkup.json');

        function saveData() {
            fs.writeFile('/app/data/checkup.json', JSON.stringify(checkups), function (err) { 
                if (err) throw err;
            });
        }

        const { MessageEmbed } = require('discord.js');

		    const Date = interaction.options.getString('thedate');
        const Rank = interaction.options.getString('departmentrank');
        const CDs = interaction.options.getString('dclass');
        const Combatives = interaction.options.getInteger('combatives');
        let Specs = interaction.options.getString('spectators')
        const Conclusion = interaction.options.getString('conclusion');
        const Desc = interaction.options.getString('description');
        const Proof = interaction.options.getString('proof');
        let Notes = interaction.options.getString('notes');
        
    
        if (!Notes) {
          Notes = 'N/A';
        }
        if (!Specs) {
          Specs = 'N/A';
        }
        const gradingChannel = await client.channels.cache.get('910191784678789160')
        const gradeChannel = await client.channels.cache.get('910192523069255720')

        
        if (interaction.channel.id == '910191739963330570') {
          
          const row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('cuaccept')
                  .setLabel('Accept')
                  .setStyle('SUCCESS'),
                new MessageButton()
                  .setCustomId('cudeny')
                  .setLabel('Deny')
                  .setStyle('DANGER')
              );

          const theEmbed = new MessageEmbed()
              .setColor('#233287')
              .setTitle(interaction.member.displayName + "'s Checkup")
              .setAuthor(interaction.member.displayName, interaction.user.avatarURL())
              .setDescription("Date of Checkup: " + Date + "\nDepartment Rank: " + Rank + "\n\n# of Class-D used: " + CDs + "\n\n# of Combatives: " + Combatives + "\n\nSpectators: " + Specs + "\n\nThe test described in detail: " + Desc + "\n\nConclusion: " + Conclusion + "\n\nProof: " + Proof + "\n\nNotes: " + Notes)
              .setTimestamp()
          const checkUpMessage = await gradingChannel.send({ embeds: [theEmbed], components: [row] });
          //const testNumber = toString(testyf.id);
          checkups.checkup[checkUpMessage.id] = {'user': interaction.user.id};
          fs.writeFile('/app/data/checkup.json', JSON.stringify(checkups), function (err) {if (err) throw err;});
          interaction.reply({content: 'Your log was successfully sent.', ephemeral: true});
        } else {
          interaction.reply({content: "Wrong channel.", ephemeral: true})
        }
    },
};