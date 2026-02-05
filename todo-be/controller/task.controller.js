const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const newTask = new Task({ task, isComplete });
    await newTask.save();
    res.status(200).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.getTask = async (req, res) => {
  try {
    // const taskList = await Task.find({}, "-__v"); // 버전 정보 제외하기
    const taskList = await Task.find({}).select("-__v"); // 버전 정보 제외하기
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

// 생성 날짜 보여주고 싶을 때 스키마 수정
taskController.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, isComplete } = req.body;

    const updateData = {};
    if (task !== undefined) updateData.task = task;
    if (isComplete !== undefined) updateData.isComplete = isComplete;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "no fields to update" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "task not found" });
    }

    res.status(200).json({ status: "ok", data: updatedTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "task not found" });
    }

    res.status(200).json({ status: "ok", message: "task deleted" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

module.exports = taskController;
