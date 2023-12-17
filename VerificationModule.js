const Functions = {}
const VerificationCodes = {}

function StringGenerator(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function StartVerify(UserId) {
    if (VerificationCodes[UserId]) {
        if(VerificationCodes[UserId]["Completed"]) {
            return {
                State: "AlreadyComplete"
            }
        } else {
            return {
                State: "AlreadyStarted",
                Code: VerificationCodes[UserId]["Code"]
            }
        }
    } else {
        const Code = StringGenerator(7)
        VerificationCodes[UserId] = {
            "Code": Code,
            "Completed": false
        }

        return {
            State: "Started",
            Code
        }
    }
}

Functions.StartVerify = StartVerify

module.exports = Functions