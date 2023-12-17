const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const verification = require('../../VerificationModule.js')

module.exports = {
  data: new SlashCommandBuilder().setName('verify').setDescription('Start verification.').addStringOption(option =>
    option.setName('verificationcode').setDescription('Your verification code.').setRequired(false) 
  ),

  run: async({ interaction, client, handler }) => {
    const Data = await verification.StartVerify(interaction.member.id)
    const Code = interaction.options.getString('verificationcode')

    if(Code) {
        if(Data["State"] == "AlreadyStarted") {
            if(Data["Code"] == Code) {
                interaction.member.roles.add(process.env["VERIFIED_ROLE_ID"])
                await interaction.reply({
                    embeds: [{
                       title: `Verification`,
                       color: 6029144,
                       description: `Verification complete! You will now have access to all the channels.`,
                    }],
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    embeds: [{
                       title: `Verification`,
                       color: 14145282,
                       description: `Invalid verification code! Please make sure the code is right (It is case sensitive)\n\nConfused? Look in <#1184186039061991524>!`,
                    }],
                    ephemeral: true
                })
            }
        } else {
            await interaction.reply({
                embeds: [{
                   title: `Verification`,
                   color: 14145282,
                   description: `You not started verification yet! Please run this command without arguments.\n\nConfused? Look in <#1184186039061991524>!`,
                }],
                ephemeral: true
            })
        }
    } else {
        if(Data["State"] == "Started") {
            await interaction.reply({
                embeds: [{
                   title: `Verification`,
                   color: 6029144,
                   description: `Your unique verification code is \`${Data["Code"]}\`! Please run the command again using the "verificationcode" argument.\n\nConfused? Look in <#1184186039061991524>!`,
                }],
                ephemeral: true
            })
        } else {
            await interaction.reply({
                embeds: [{
                   title: `Verification`,
                   color: 14145282,
                   description: `You have already started verification! Make sure to specify the "verificationcode" argument with your code that was previously provided.\n\nConfused? Look in <#1184186039061991524>!`,
                }],
                ephemeral: true
            })
        }
    }
  },
  nonVerifiedOnly: true
}