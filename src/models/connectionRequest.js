const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User collection
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

// Compound indexes for query optimization
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.index({ toUserId: 1, status: 1 });

connectionRequestSchema.pre("save", function () {
  //   const connectionRequest = this;

  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
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
