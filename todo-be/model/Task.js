const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }, // createdAt/updatedAt 자동 생성
);

const Task = model("Task", taskSchema);

module.exports = Task;
