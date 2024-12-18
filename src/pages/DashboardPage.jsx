import { Col, Container, Row } from "react-bootstrap";
import { Suspense, lazy } from "react";
import InventorySalesCard from "../components/cards/InventorySalesCard";
import AccountManagementCard from "../components/cards/AccountManagementCard";
import RidersManagementCard from "../components/cards/RidersManagementCard";
import ReportsCard from "../components/cards/ReportsCard";
import SalesChart from "../components/charts/SalesChart";
import Analysis from "../components/cards/Analysis";
import LoadingComponent from "../components/ui/LoadingComponent";
import StatisticalAnalysis from "../components/cards/StatisticalAnalysis";

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
          
        <Col className="w-100 bg-warning mx-5 rounded-2">
            <AccountManagementCard />
          </Col>
        </Row>
        <Row>
          <Col className="w-100 bg-primary mx-5 mt-2 p-2 rounded-2">
            <InventorySalesCard />
          </Col>
        </Row>
        <Row>
          {/* <Col className="w-100 bg-secondary m-1 p-2 rounded-2">
            <RidersManagementCard />
          </Col> */}
          <Col className="bg-success ms-5 me-1 mt-2 p-2 rounded-2">
            <ReportsCard />
          </Col>
          <Col className="bg-warning me-5 ms-1 mt-2 p-2 rounded-2">
            <StatisticalAnalysis/>
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <Analysis/>
          </Col>
        </Row> */}
        <SalesChart />
      </Container>
    </>
  );
}
