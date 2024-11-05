import { Link, useLocation, useNavigate } from "react-router-dom";
import { Nav, Navbar, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { navigationRoutes } from "../../routes/navigationRoutes";
import Cookies from "js-cookie";

export default function NavbarComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const renderNavigationRoutes = () => {
    return navigationRoutes.map((item, index) => (
      <Nav.Item key={index}>
        <Nav.Link
          as={Link}
          to={item.path}
          className={`text-white text-decoration-none fs-6 d-flex flex-row align-items-center ${
            item.path === location.pathname
              ? "fw-bold bg-secondary p-2 rounded-2"
              : ""
          }`}
        >
          {<item.icon className="me-2" />}
          {item.name}
        </Nav.Link>
      </Nav.Item>
    ));
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      Cookies.remove("userId");
      Cookies.remove("token");
      Cookies.remove("role");
      toast.success("You have successfully logged out!");
      navigate("/");
    }
  };

  return (
    <Navbar
      bg="success"
      variant="dark"
      expand="md"
      className=" d-md-none p-2"
    >
      <Navbar.Brand href="#home" className="fw-bold">
        Dashboard
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {renderNavigationRoutes()}
          <Button
            variant="danger"
            size="lg"
            className="w-100 fw-bold"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
