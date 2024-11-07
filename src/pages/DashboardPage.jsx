import { Col, Container, Row } from "react-bootstrap";
import { Suspense, lazy } from "react";
import InventorySalesCard from "../components/cards/InventorySalesCard";
import AccountManagementCard from "../components/cards/AccountManagementCard";
import RidersManagementCard from "../components/cards/RidersManagementCard";
import ReportsCard from "../components/cards/ReportsCard";
import SalesChart from "../components/charts/SalesChart";
import LoadingComponent from "../components/ui/LoadingComponent";

const AdvertisementsList2 = lazy(() =>
  import("../features/advertisements/AdvertisementsList2")
);

export default function DashboardPage() {
  return (
    <>
      <h2 className="fw-bold text-success">Dashboard</h2>

      <hr />

      <Container>
        <Row>
          <Col className="my-2 p-2">
      <Suspense fallback={<LoadingComponent />}>
        <AdvertisementsList2 />
      </Suspense>
      </Col>
        </Row>
        <Row>
          <Col className="w-100 bg-primary ms-5 me-1 p-2 rounded-2">
            <InventorySalesCard />
          </Col>
          <Col className="w-100 bg-warning me-5 ms-1 p-2 rounded-2">
            <AccountManagementCard />
          </Col>
        </Row>
        <Row>
          {/* <Col className="w-100 bg-secondary m-1 p-2 rounded-2">
            <RidersManagementCard />
          </Col> */}
          <Col className="bg-success mx-5 mt-2 p-2 rounded-2">
            <ReportsCard />
          </Col>
        </Row>
        <SalesChart />
      </Container>
    </>
  );
}
