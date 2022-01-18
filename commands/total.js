const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('total')
      .setDescription('Check your total accepted checkups.')
      .addUserOption(option =>
          option.setName('user')
                .setDescription('User being checked.')),
	async execute(client, interaction) {
        const data = require('/app/.data/data.json');
        const thePerson = interaction.user.id;
        var theRequest = interaction.options.getUser('user');
        const gradingChannel = await client.channels.cache.get('910191784678789160')
        const gradeChannel = await client.channels.cache.get('910192523069255720')
        const fs = require('fs')

        if (!theRequest) {
            if (!data.user[thePerson]) {
              data.user[thePerson] = {
                  "cuDone": 0,
              }
          }
          interaction.reply({ content: "You have gotten " + data.user[thePerson].cuDone + " checkups accepted.", ephemeral: true})
        } else {
          if (interaction.channel === gradingChannel) {
                if (!data.user[thePerson]) {
                data.uses[thePerson] = {
                    "cuDone": 0,
                }
            }
            fs.writeFile('/app/.data/data.json', JSON.stringify(data), function (err) {if (err) throw err;});
            interaction.reply({content: "<@" + theRequest + "> has gotten " + data.user[theRequest.id].cuDone + " checkups accepted.", ephemeral: true})
          } else {
            interaction.reply({content: "Insufficient permissions.", ephemeral: true})
          }
        }
	},
};
