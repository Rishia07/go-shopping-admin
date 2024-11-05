import { Suspense } from "react";
import InventorySalesCard2 from "../components/cards/InventorySalesCard2";
import LoadingComponent from "../components/ui/LoadingComponent"; 

export default function OrderPage() {
  return (
    <>
      <h2 className="fw-bold text-success">Inventory</h2>

      <hr />

      <Suspense fallback={<LoadingComponent />}>
        <InventorySalesCard2 />
      </Suspense>
    </>
  );
}
