import { useEffect, useState } from "react";
import "./App.css";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import api from "./utils/api";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // 리스트 요청
  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };

  // 추가
  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });

      if (response.status === 200) {
        setTodoValue("");
        getTasks();
      } else {
        throw new Error("task can not be added");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  // 삭제
  const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) getTasks();
    } catch (err) {
      console.log("delete error", err);
    }
  };

  // 끝남(완료 토글)
  const toggleComplete = async (item) => {
    try {
      const response = await api.put(`/tasks/${item._id}`, {
        task: item.task,
        isComplete: !item.isComplete,
      });

      if (response.status === 200) getTasks();
    } catch (err) {
      console.log("toggle error", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(e) => setTodoValue(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>
            추가
          </button>
        </Col>
      </Row>

      <TodoBoard todoList={todoList} deleteTask={deleteTask} toggleComplete={toggleComplete} />
    </Container>
  );
}

export default App;
