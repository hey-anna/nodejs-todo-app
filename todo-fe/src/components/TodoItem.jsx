import { Col, Row } from "react-bootstrap";

const TodoItem = ({ item, deleteTask, toggleComplete }) => {
  return (
    <Row>
      <Col xs={12}>
        <div className={`todo-item ${item.isComplete ? "done" : ""}`}>
          <div className="todo-content">{item.task}</div>

          <div>
            <button
              className="button-delete"
              onClick={() => deleteTask(item._id)}
            >
              삭제
            </button>
            <button
              className="button-delete"
              onClick={() => toggleComplete(item)}
            >
              끝남
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TodoItem;
