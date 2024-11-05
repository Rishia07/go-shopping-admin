import { Col, Container, Row } from "react-bootstrap";
import InventorySalesCard from "../components/cards/InventorySalesCard";
import AccountManagementCard from "../components/cards/AccountManagementCard";
import RidersManagementCard from "../components/cards/RidersManagementCard";
import ReportsCard from "../components/cards/ReportsCard";
import SalesChart from "../components/charts/SalesChart";

export default function DashboardPage() {
  return (
    <>
      <h2 className="fw-bold text-success">Dashboard</h2>

      <hr />

      <Container>
        <Row>
          <Col className="w-100 bg-primary m-1 p-2 rounded-2">
            <InventorySalesCard />
          </Col>
          <Col className="w-100 bg-warning m-1 p-2 rounded-2">
            <AccountManagementCard />
          </Col>
        </Row>
        <Row>
          <Col className="w-100 bg-secondary m-1 p-2 rounded-2">
            <RidersManagementCard />
          </Col>
          <Col className="w-100 h-100 bg-success m-1 p-2 rounded-2">
            <ReportsCard />
          </Col>
        </Row>
        <SalesChart />
      </Container>
    </>
  );
}
