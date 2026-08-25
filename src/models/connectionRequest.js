const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        // VALUE (always in capital letter), not Value/value
        message: "{VALUE}",
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ firstName: 1, lastName: 1 });

connectionRequestSchema.pre("save", function (next) {
  //   const connectionRequest = this;

  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

// Model Name first Char should be capital letter
const ConnectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;

/** NOTE:
 * Mongoose middleware can also be written using async functions, in which case you often don't need next()
 * 
 * connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});
 */
