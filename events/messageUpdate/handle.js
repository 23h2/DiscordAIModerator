const ModerationModule = require('../../ModerationModule.js')

module.exports = async (OldMessage, NewMessage, client, handler) => {
    return ModerationModule.ModerateMessage(NewMessage, client)
}