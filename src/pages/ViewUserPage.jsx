import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Row, Col, Image, Alert, Table } from "react-bootstrap";
import { fetchUser, fetchUserOrder } from "../api/usersApi";
import LoadingComponent from "../components/ui/LoadingComponent";

export default function ViewUserPage() {
  const { id } = useParams();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });

  const { data: userOrder, isLoading: orderLoading } = useQuery({
    queryKey: ["userOrder", id],
    queryFn: () => fetchUserOrder(id),
    enabled: !!id,
  });

  if (userLoading || orderLoading) return <LoadingComponent />;

  return (
    <div className="container mt-4">
      <Card
        className="shadow-lg mb-4"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Row className="g-0">
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <Image
              src={
                user.profilePic
                  ? user.profilePic
                  : "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
              }
              alt={`${user.firstName} ${user.lastName}`}
              width={80}
              height={80}
              roundedCircle
              className="bg-dark object-fit-cover"
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title className="text-primary fw-bold">
                {user?.firstName} {user?.lastName}
              </Card.Title>
              <Card.Text>
                <strong>Email:</strong> {user?.email}
              </Card.Text>
              <Card.Text>
                <strong>Phone Number:</strong> {user?.phoneNumber}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
      <div className="delivery-info">
        <h4 className="mb-3 text-center text-secondary">
          Delivery Information
        </h4>

        {userOrder && userOrder.length > 0 ? (
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
              {userOrder.map((order, index) => (
                <tr key={order._id}>
                  <td style={{ maxWidth: 100 }}>
                    <Image
                      src={order.product?.photoURL[0]}
                      alt={index}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td>{order.product?.title}</td>
                  <td>₱{order?._id}</td>
                  <td>{order?.quantity}</td>
                  <td>{order?.status}</td>
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
