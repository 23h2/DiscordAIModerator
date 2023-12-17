const ModerationModule = require('../../ModerationModule.js')

module.exports = async (Message, client, handler) => {
    return ModerationModule.ModerateMessage(Message, client)
}