import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Nav, Collapse } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { navigationRoutes } from "../../routes/navigationRoutes";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchRiderCount } from "../../api/ridersApi";
import { fetchClientCount } from "../../api/usersApi";

export default function SidebarComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [openProductManagement, setProductManagement] = useState(false);

  const {
    data: riderCount
  } = useQuery({
    queryKey: ["ridersCount"],
    queryFn: fetchRiderCount,
  });

  const {
    data: clientCount
  } = useQuery({
    queryKey: ["clientsCount"],
    queryFn: fetchClientCount,
  });
  const renderNavigationRoutes = () => {
    return navigationRoutes.map((item, index) => (
      <Nav.Item key={index}>
        {item.name === "Users" ? (
          <div>
            <Nav.Link
              onClick={() => setOpenUserManagement(!openUserManagement)}
              aria-controls="user-management-submenu"
              aria-expanded={openUserManagement}
              className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ${openUserManagement ? "fw-bold " : ""
                }`}
            >
              {<item.icon className="me-2" size={20} />}
              User Management
            </Nav.Link>
            {/* Collapsible sub-menu */}
            <Collapse in={openUserManagement}>
              <div id="user-management-submenu">
                <Nav.Link
                  as={Link}
                  to="/home/users"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/users" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Clients ({clientCount?.count ?? -1})
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/home/riders"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/riders" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Riders ({riderCount?.count ?? -1})
                </Nav.Link>
              </div>
            </Collapse>
          </div>
        ) : item.name === "Products" ?
          <div>
            <Nav.Link
              onClick={() => setProductManagement(!openProductManagement)}
              aria-controls="product-management-submenu"
              aria-expanded={openProductManagement}
              className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ${openProductManagement ? "fw-bold " : ""
                }`}
            >
              {<item.icon className="me-2" size={20} />}
              Product Management
            </Nav.Link>
            {/* Collapsible sub-menu */}
            <Collapse in={openProductManagement}>
              <div id="product-management-submenu">
                <Nav.Link
                  as={Link}
                  to="/home/products"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/products" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/home/orders"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/orders" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Orders
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/home/sales"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/sales" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Sales
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/home/inventories"
                  className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ms-3 ${location.pathname === "/home/inventories" ? "fw-bold bg-dark" : ""
                    }`}
                >
                  Inventory
                </Nav.Link>
              </div>
            </Collapse>
          </div>
          :
          item.name != "Riders" && item.name != "Orders" && item.name != "Sales" && item.name != "Inventory" &&(<Nav.Link
            as={Link}
            to={item.path}
            className={`text-white text-decoration-none p-2 fw-bold d-flex flex-row align-items-center rounded-2 ${item.path === location.pathname
              ? "fw-bold bg-dark"
              : ""
              }`}
          >
            {<item.icon className="me-2" size={20} />}
            {item.name}
          </Nav.Link>)}
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
    <aside className="bg-success bg-gradiant p-3 d-none d-md-flex flex-column justify-content-between rounded-end" style={{ height: "100vh" }}>
      <div>
        <h5 className="fw-bold text-white mb-2 text-uppercase p-2">GoShopping</h5>
        <nav>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {renderNavigationRoutes()}
          </ul>
        </nav>
      </div>
      <Button variant="danger" className="w-100 fw-bold" onClick={handleLogout}>
        Logout
      </Button>
    </aside>
  );
}