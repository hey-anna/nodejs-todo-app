import { Outlet, Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../auth/useAuth";

import "../App.css";

export default function RootLayout() {
  const { isAuthed, user, signout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Todo App
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center gap-2">
              {isAuthed ? (
                <>
                  <Navbar.Text className="me-2">
                    <span className="text-white-50">Signed in as </span>
                    <span className="text-white">{user?.email}</span>
                  </Navbar.Text>
                  <Button variant="outline-light" size="sm" onClick={onLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signin">
                    로그인
                  </Nav.Link>
                  <Button as={Link} to="/signup" variant="primary" size="sm">
                    회원가입
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
