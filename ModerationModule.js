const Functions = {}
const OpenAIModule = require('openai')

const OpenAI = new OpenAIModule({
    apiKey: process.env.OPENAI_KEY,
})

async function AskAIOpinion(Message, Attachments) {
    const OldMessage = Message
    Message = Message.content
    var AttachmentString = ""

    Attachments.forEach(Attachment => {
        AttachmentString = AttachmentString + `
${Attachment.id} = ${Attachment.name}`
    })

    if(AttachmentString == "") { AttachmentString = "None" }
    var ChannelType = "NON-NSFW"

    console.log(Message)
    if(OldMessage.channel.nsfw) {
        ChannelType = "NSFW (Allow sexual content)"
    }

    const Messages = [{ role: 'system', content: `
You are an AI content moderation bot. Your job is to take a message sent from a user and determine if it is breaking the rules and instructions listed below.

Rules:

No suggestion / directly promoting racism / homophobia, etc.
Only allow safe file extensions in URL's (Media, text, programming languages, etc. No files like .exe, .bat, .lnk, .jar, etc).
No advertisements / promotion of third party products / websites / services.
No promoting scams / suspicious website URLS.
No spamming / flooding text.
No sexual messages. (Only allow in NSFW channels)
No leaking of personal information.

Specificly blacklisted links / words:

SS Batallion
Any text in the format of [x](URL)
Any URL containing "dox" / "doxx" or "doxbin"
DISALOW URL's starting in "discord.gg" links EXACTLY ignore similar links
ALLOW "media.discordapp.net" & "discordapp.net" links. 
Also attempt to detect any methods of bypassing the filter.

Other instructions:

Strictly ALLOW anything to do with "bypassing", or anything to do with "hate"
Allow ANY swearing / offensive language (such as "fuck", "shit", "bitch", "fuck you", "you are a bitch", etc) WHATSOEVER
Allow anyone speaking about the rules only disallow if they BREAK the rules.
Disallow any suspicious / uncommon unicode characters such as "ⓖ", "g̷̨̞̹̟̺̝̜̉̓͋̋̿̾́", "🇳", "ꌗ", "𝕘", "𝖌", "𝓰" and so on. Allow any symbols such as "!", ",", etc.

Simply respond with "YES" if it IS breaking rules / contains a blacklisted string / matches any other instructions given and "NO" if it ISNT breaking rules. Also specify the reason why you have chosen "YES" (in less than one sentence) after YES/NO separated by a comma.
` }, { role: 'user', content: `User input: "${Message}\nAttachments: ${AttachmentString || "None"}\nChannel type: ${ChannelType}`}]

    const Response = await OpenAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: Messages,
      max_tokens: 256,
    }).catch((error) => {
      console.log(`OpenAI Error (AskAIOpinion function): ${error}`);
    })

    try {
        const ActualResponse = Response.choices[0].message.content

        if(ActualResponse.includes('YES')) {
            const Reason = ActualResponse.split('YES, ')[1]
            return {
                "Success": true,
                "BreakingRules": true,
                "RuleBroken": Reason,
                "FullResponse": ActualResponse
            }
        } else {
            return {
                "Success": true,
                "BreakingRules": false,
                "FullResponse": ActualResponse
            }
        }
    } catch(e) {
        return {
            "Success": false,
            "Error": e.toString()
        }
    }
}

async function ModerateMessage(Message, client) {
    try {
        const Member = Message.guild.members.cache.get(Message.author.id)
        if(Member.roles.cache.some(role => role.id === process.env.EXCLUDE_ROLE_ID) || Message.author.bot) { return }
        const Result = await AskAIOpinion(Message, Message.attachments)
    
        if(process.env.BOTDEBUG == "true") {
            console.log("[DEBUG]", Result)
        }
        if(Message.content == "") { Message.content = "None" }

        if(Result["Success"]) {
            if(Result["BreakingRules"] && Result["RuleBroken"]) {
                const LogChannel = Message.guild.channels.cache.get(process.env.LOG_CHANNEL_ID)
                Message.delete({ reason: `${process.env.BOT_NAME} - ${Result["RuleBroken"]}` })
                Message.author.send(`Your message in \`${Message.guild.name}\` has been deleted! 
    
**Message**: \`${Message.content}\`
**Reason**: \`${Result["RuleBroken"]}\`
    
*⚠️ Warning: This bot is ran by AI and is in BETA, mistakes may be made.*
    `)
                LogChannel.send(`A message from <@${Message.author.id}> in <#${Message.channel.id}> has been deleted! 
    
**Message**: \`${Message.content}\`
**Reason**: \`${Result["RuleBroken"]}\`
                `)

                if(process.env.BOTDEBUG == "true") {
                    console.log("[DEBUG] Breaking rules:", Message.content)
                }
            } else {
                if(process.env.BOTDEBUG == "true") {
                    console.log("[DEBUG] Not breaking rules:", Message.content)
                }
            }
        } else {
            try {
                await Message.delete({ reason: `${process.env.BOT_NAME} - Moderation error, deleting as a precaution.` })
            } catch {
                return
            }
        }
    } catch(e) {
        console.log("Error in ModerateMessage, ModerationModule.js:", e.toString())
    }
}

Functions.ModerateMessage = ModerateMessage

module.exports = Functions