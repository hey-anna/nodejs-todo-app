const Task = require("../model/Task");

const taskController = {};

// 할 일 생성 (owner는 auth 미들웨어에서 세팅한 req.userId)
taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;

    if (!task) {
      return res
        .status(400)
        .json({ status: "fail", message: "task is required" });
    }

    const newTask = await Task.create({ task, isComplete, owner: req.userId });

    await newTask.populate("owner", "name email");
    newTask.__v = undefined;

    res.status(201).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "server error" });
  }
};

// 할 일 목록 조회

taskController.getTask = async (req, res) => {
  try {
    // const taskList = await Task.find({}, "-__v"); // 버전 정보 제외하기
    const taskList = await Task.find({ owner: req.userId })
      .select("-__v")
      .sort({ createdAt: -1 })
      .populate("owner", "name email");
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "server error" });
  }
};

// 할 일 수정
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

    // _id + owner 조건으로 "내 것만" 수정 가능하게 제한
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, owner: req.userId },
      updateData,
      { new: true },
    )
      .select("-__v")
      .populate("owner", "name email");

    if (!updatedTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "task not found" });
    }

    res.status(200).json({ status: "ok", data: updatedTask });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "server error" });
  }
};

// 할 일 삭제
taskController.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ status: "fail", message: "task not found" });
    }

    res.status(200).json({ status: "ok", message: "task deleted" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "server error" });
  }
};

module.exports = taskController;
