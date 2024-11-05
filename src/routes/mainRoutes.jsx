import LoginPage from "../pages/LoginPage";
import HomeLayout from "../layouts/HomeLayout";
import DashboardPage from "../pages/DashboardPage";
import UserPage from "../pages/UserPage";
import ViewUserPage from "../pages/ViewUserPage";
import ProtectedRoutes from "../components/ProtectedRoutes";
import ProductPage from "../pages/ProductPage";
import ViewProductPage from "../pages/ViewProductPage";
import OrderPage from "../pages/OrderPage";
import AdvertisementPage from "../pages/AdvertisementPage";
import InventoryPage from "../pages/InventoryPage";
import RiderPage from "../pages/RiderPage";
import ViewRiderPage from "../pages/ViewRiderPage";
import SalesPage from "../pages/SalesPage";

export const mainRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <LoginPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/home",
    element: <HomeLayout />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoutes>
            <DashboardPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "advertisements",
        element: (
          <ProtectedRoutes>
            <AdvertisementPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoutes>
            <ProductPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "sales",
        element: (
          <ProtectedRoutes>
            <SalesPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoutes>
            <OrderPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "inventories",
        element: (
          <ProtectedRoutes>
            <InventoryPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoutes>
            <UserPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "riders",
        element: (
          <ProtectedRoutes>
            <RiderPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "product/:id",
        element: (
          <ProtectedRoutes>
            <ViewProductPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "user/:id",
        element: (
          <ProtectedRoutes>
            <ViewUserPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "rider/:id",
        element: (
          <ProtectedRoutes>
            <ViewRiderPage/>
          </ProtectedRoutes>
        ),
      },
    ],
  },
];
