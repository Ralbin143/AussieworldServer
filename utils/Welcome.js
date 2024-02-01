const accountSid = 'AC752ff6f3319c2b29a32fe28fefb7a7d0';
const authToken = '476edb23aaf90b5f0e47ff109f715794';
const client = require('twilio')(accountSid, authToken);

const createMessage = async (contactNo) => {
  client.messages
    .create({
      body: 'Your account has been created now you can check your mail for more details.',
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${contactNo}` // Corrected to use the variable contactNo
    })
    .then(message => console.log(message.sid))
};

module.exports = createMessage;