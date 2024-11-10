const mongoose = require("mongoose");
const { Schema } = mongoose;

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    options: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: {
        validator: function (v) {
          console.log("Options being validated:", v); // Debug statement
          return v.length >= 2 && v.length <= 5;
        },
        message: "A poll must have between 2 and 5 options.",
      },
    },
    votes: {
      type: [Number],
      default: function () {
        return Array(this.options.length).fill(0); // Initialized Each option's vote count to 0
      },
      validate: {
        validator: function (v) {
          return v.length === this.options.length; // Making sure votes array matches options array length
        },
        message: "Votes array length must match the options array length.",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
