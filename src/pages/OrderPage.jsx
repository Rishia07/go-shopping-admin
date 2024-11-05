import { Suspense, lazy } from "react";
import LoadingComponent from "../components/ui/LoadingComponent"; 

const OrdersList = lazy(() => import("../features/orders/OrdersList"));

export default function OrderPage() {
  return (
    <>
      <h2 className="fw-bold text-success">Orders</h2>

      <hr />

      <Suspense fallback={<LoadingComponent />}>
        <OrdersList />
      </Suspense>
    </>
  );
}
