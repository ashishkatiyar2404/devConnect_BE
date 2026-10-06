const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../config/sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (toEmailOrSubject, subjectOrBody, maybeBody) => {
  let toEmail, subject, body;
  if (maybeBody !== undefined) {
    toEmail = toEmailOrSubject;
    subject = subjectOrBody;
    body = maybeBody;
  } else {
    toEmail = "katiyarashish1210@gmail.com";
    subject = toEmailOrSubject;
    body = subjectOrBody;
  }

  const sendEmailCommand = createSendEmailCommand(
    toEmail || "katiyarashish1210@gmail.com",
    "katiyarashish24@gmail.com",
    subject,
    body,
  );
  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
