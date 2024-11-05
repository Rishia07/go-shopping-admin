import { Card, Button } from "react-bootstrap";

export default function AdvertisementCard({ item, handleDelete }) {
  return (
    <Card
      style={{
        width: "25rem",
        height: "22rem",
        position: "relative",
        borderRadius: 20,
        backgroundSize: "cover",
        backgroundImage: `url(${item.image})`,
      }}
    >
      <Card.Body
        className="d-flex flex-column justify-content-end"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 20,
          color: "white",
        }}
      >
        <Card.Title className="font-bold fs-2">{item.title}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <Button variant="danger" onClick={() => handleDelete(item._id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}
