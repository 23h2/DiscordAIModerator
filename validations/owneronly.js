module.exports = (interaction, commandObj, handler, client) => {
    if (commandObj.ownerOnly) {
      if (!interaction.member.id == process.env["THEO_ID"]) {
        interaction.reply({
          embeds: [
            {
              "title": "Insufficient Permissions",
              "description": "You do not have the correct permissions to run this command!",
              "color": 14697540,
              "footer": {
                "text": `${process.env["BOT_NAME"]} Bot`
              }
            }
          ],
          ephemeral: true
        });
        return true;
      }
    }
};