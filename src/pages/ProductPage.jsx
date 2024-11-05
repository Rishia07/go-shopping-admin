import { Suspense, lazy, useState } from "react"; // Import necessary dependencies
import { Button } from "react-bootstrap";
import LoadingComponent from "../components/ui/LoadingComponent";
import AddProductModalComponent from "../components/modals/AddProductModalComponent";

const ProductsList = lazy(() => import("../features/products/ProductsList"));

export default function ProductPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-success">Products</h2>
        <Button variant="success" onClick={() => setShowAddModal(true)}>Create</Button>
      </div>
      <hr />
      <Suspense fallback={<LoadingComponent />}>
        <ProductsList />
      </Suspense>
      <AddProductModalComponent
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
    </>
  );
}
