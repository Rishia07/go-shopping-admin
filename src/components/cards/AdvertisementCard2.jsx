import { Card, Button } from "react-bootstrap";

export default function AdvertisementCard2({ item, handleDelete }) {
  return (
    <Card
      style={{
        width: "70rem",  // adjust card width
        height: "22rem", // adjust card height
        position: "relative",
        borderRadius: 20,
        backgroundSize: "contain",  // Ensures the background image covers the whole card
        backgroundPosition: "center",  // Centers the background image
        backgroundImage: `url(${item.image})`,
        margin: "0 auto",  // Centers the card horizontally in the carousel
      }}
      className="mx-auto" // Use mx-auto to center card
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
      </Card.Body>
    </Card>
  );
}
