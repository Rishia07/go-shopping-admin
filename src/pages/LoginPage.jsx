import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Card, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import Logo from "../assets/logo.png";
import BackgroundImage from "../assets/background_image.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { email, password } = formData;
      if (!email) {
        setLoading(false);
        return toast.error("Please enter your email!");
      }
      if (!password) {
        setLoading(false);
        return toast.error("Please enter your password!");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_KEY}/api/users/login`,
        formData
      );
      if (response.data.role !== "admin") {
        setLoading(false);
        return toast.error("Only Admins can access this website!");
      }
      Cookies.set("role", response.data.role);
      Cookies.set("token", response.data.token);
      Cookies.set("userId", response.data.userId);
      toast.success("You have successfully logged in!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex bg-dark justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card style={{ width: "25rem" }} className="m-2">
        <Card.Body>
          <div className="d-flex justify-content-center align-items-center mb-4">
            <Image src={Logo} width={200} className="img-fluid" />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-2">
              <Form.Label>Email address: </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                size="lg"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-2">
              <Form.Label>Password: </Form.Label>
              <div className="form-control d-flex align-items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-100 fs-5 border-0 form-control   shadow-none"
                  required
                />
                <div
                  className="outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </div>
              </div>
            </Form.Group>
            <Button
              size="lg"
              type="submit"
              variant="success"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Loading…" : " Login "}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
