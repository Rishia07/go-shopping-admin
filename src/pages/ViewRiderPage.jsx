import { useParams } from "react-router-dom";
import { fetchRider, fetchRiderOrder } from "../api/ridersApi";
import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Image, Table, Alert } from "react-bootstrap";
import LoadingComponent from "../components/ui/LoadingComponent";

export default function ViewRiderPage() {
  const { id } = useParams();

  const { data: rider, isLoading: riderLoading } = useQuery({
    queryKey: ["rider", id],
    queryFn: () => fetchRider(id),
    enabled: !!id,
  });

  const { data: riderDelivery, isLoading: deliveryLoading } = useQuery({
    queryKey: ["riderOrder", id],
    queryFn: () => fetchRiderOrder(id),
    enabled: !!id,
  });

  if (riderLoading || deliveryLoading) return <LoadingComponent />;

  return (
    <div className="container mt-4">
      <Card
        className="shadow-lg mb-4"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Row className="g-0">
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center p-3"
          >
            <Image
              src={
                rider.profilePic
                  ? rider.profilePic
                  : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
              }
              alt={`${rider.firstName} ${rider.lastName}`}
              width={120}
              height={120}
              roundedCircle
              className="object-fit-cover"
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title className="text-primary fw-bold">
                {rider?.firstName} {rider?.lastName}
              </Card.Title>
              <Card.Text>
                <strong>Email:</strong> {rider?.email}
              </Card.Text>
              <Card.Text>
                <strong>Phone Number:</strong> {rider?.phoneNumber}
              </Card.Text>
              <hr />
              <Card.Text>
                <strong>Vehicle:</strong> {rider?.vehicle}
              </Card.Text>
              <Card.Text>
                <strong>Plate Number:</strong> {rider?.plateNumber}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <div className="delivery-info">
        <h4 className="mb-3 text-center text-secondary">
          Delivery Information
        </h4>

        {riderDelivery && riderDelivery.length > 0 ? (
          <Table striped bordered hover responsive className="text-center">
            <thead>
              <tr>
                <th>Product</th>
                <th>Title</th>
                <th>Status</th>
                <th>Price</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {riderDelivery.map((order, index) => (
                <tr key={order.id}>
                  <td style={{ maxWidth: 100 }}>
                    <Image
                      src={order.product.photoURL[0]}
                      alt={index}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td>{order.product.title}</td>
                  <td>{order.status}</td>
                  <td>₱{order.price}</td>
                  <td>
                    {order.user.firstName} {order.user.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="warning" className="text-center">
            No deliveries yet.
          </Alert>
        )}
      </div>
    </div>
  );
}
