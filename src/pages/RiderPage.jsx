import { Suspense, lazy, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import LoadingComponent from "../components/ui/LoadingComponent";
import RidersManagementCard from "../components/cards/RidersManagementCard.jsx";

const RidersList = lazy(() => import("../features/riders/RidersList"));

export default function RiderPage() {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-success">Riders</h2>
        
        <Button variant="success"  onClick={handleShow}>Add Rider</Button>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Rider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RidersManagementCard onClose={handleClose} />
        </Modal.Body>
      </Modal>

      <hr />

      <Suspense fallback={<LoadingComponent />}>
        <RidersList />
      </Suspense>
    </>
  );
}
