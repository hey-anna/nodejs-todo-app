import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";

export default function SignInPage() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signin({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "로그인에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-center">
      <Card style={{ maxWidth: 420, width: "100%" }} className="login-box">
        <Card.Body>
          <Card.Title className="mb-3">로그인</Card.Title>

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
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

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <div className="button-box">
              <Button type="submit" className="button-primary" disabled={loading}>
                {loading ? "로그인 중..." : "Login"}
              </Button>
            </div>

            <div className="mt-3  text-center">
              계정이 없다면? <Link to="/signup">회원가입 하기</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
