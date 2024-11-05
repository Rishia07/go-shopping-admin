import { Suspense, lazy, useState } from "react";
import { Button } from "react-bootstrap";
import LoadingComponent from "../components/ui/LoadingComponent";
import AddAdvertisementModalComponent from "../components/modals/AddAdvertisementModalComponent";

const AdvertisementsList = lazy(() =>
  import("../features/advertisements/AdvertisementsList")
);

export default function AdvertisementPage() {
  const [showModal, setShowModal] = useState();
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-success">Advertisements</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Create
        </Button>
      </div>
      <hr />
      <Suspense fallback={<LoadingComponent />}>
        <AdvertisementsList />
      </Suspense>
      <AddAdvertisementModalComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
}
