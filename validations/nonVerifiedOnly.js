module.exports = (interaction, commandObj, handler, client) => {
  if (commandObj.nonVerifiedOnly) {
    if (interaction.member.roles.cache.has(process.env["VERIFIED_ROLE_ID"])) {
      interaction.reply({
        embeds: [
          {
            "title": "Already Verified",
            "description": "You are already verified!",
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