const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
      .setName('change')
      .setDescription("Changes a users' data.")
      .addUserOption(option =>
            option.setName('damention')
                  .setDescription('User being changed.')
                  .setRequired(true))
      .addIntegerOption(option =>
            option.setName('davalue')
                  .setDescription('What are you changing their total to?')
                  .setRequired(true)),
	async execute(client, interaction) {
		const fs = require('fs');
		function saveDatad() {
            fs.writeFile('/app/.data/data.json', JSON.stringify(data), function (err) {
                if (err) throw err;
            });
        }
		var data = require('/app/.data/data.json');
		const daMention = interaction.options.getUser("damention");
		const daValue = interaction.options.getInteger("davalue");

      const channel = await client.channels.cache.get('874097034288848896');
      if (interaction.channel === channel) {

			if (!data.users[daMention.id]) {
				data.users[daMention.id] = {
					'testsDone': 0,
				}
			}

			data.users[daMention.id].testsDone = daValue;
			saveDatad();
			interaction.reply({content: "The tests accepted for <@" + daMention + "> has been changed to " + daValue, ephemeral: true});
		} else {
			interaction.reply({content: "Insufficent permissions.", ephemeral: true}); return;
		};
	},
};
