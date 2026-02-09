import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("비밀번호가 서로 달라요.");
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
      navigate("/signin", { replace: true });
    } catch (err) {
      setError(err?.message || "회원가입에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-center">
      <Card style={{ maxWidth: 420, width: "100%" }} className="login-box">
        <Card.Body>
          <Card.Title className="mb-3">회원가입</Card.Title>

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="signupName">
              <Form.Label>Name (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupPassword2">
              <Form.Label>Password Confirm</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password confirm"
                autoComplete="new-password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </Form.Group>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <div className="button-box">
              <Button type="submit" variant="success" className="w-100" disabled={loading}>
                {loading ? "가입 중..." : "Sign Up"}
              </Button>
            </div>

            <div className="mt-3 text-center">
              이미 계정이 있나요? <Link to="/signin">로그인</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
