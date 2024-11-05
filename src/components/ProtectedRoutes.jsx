import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
}
