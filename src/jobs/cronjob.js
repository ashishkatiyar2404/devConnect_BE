const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("../services/sendEmail");

//job run at 8 am in the morning
cron.schedule("0 8 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterdayDate = subDays(new Date(), 1);

    const yesterdayStartTime = startOfDay(yesterdayDate);
    const yesterdayEndTime = endOfDay(yesterdayDate);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStartTime,
        $lt: yesterdayEndTime,
      },
    }).populate("fromUserId toUserId");

    const emailsList = [
      ...new Set(
        pendingRequests
          .map((req) => req.toUserId?.emailId)
          .filter(Boolean),
      ),
    ];

    for (const email of emailsList) {
      try {
        const response = await sendEmail.run(
          email,
          "You have pending connection requests on DevConnect",
          "You have some connection requests waiting for your response on DevConnect. Please log in to your account to review the requests and choose whether to accept or reject them.",
        );

        console.log(`Reminder email sent successfully for ${email}`, response);
      } catch (err) {
        console.log(`Failed to send reminder for ${email}:`, err.message);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
});
