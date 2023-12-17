module.exports = (interaction, commandObj, handler, client) => {
    if (commandObj.adminOnly) {
      if (!interaction.member.roles.cache.has(process.env["ADMIN_ROLE_ID"])) {
        interaction.reply({
          embeds: [
            {
              "title": "Insufficient Permissions",
              "description": "You do not have the correct permissions to run this command!",
              "color": 14697540,
              "footer": {
                "text":  `${process.env["BOT_NAME"]} Bot`
              }
            }
          ],
          ephemeral: true
        });
        return true;
      }
    }
};