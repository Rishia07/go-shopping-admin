import { Suspense, lazy } from "react";
import LoadingComponent from "../components/ui/LoadingComponent";

const RidersList = lazy(() => import("../features/riders/RidersList"));

export default function RiderPage() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-success">Riders</h2>
      </div>

      <hr />

      <Suspense fallback={<LoadingComponent />}>
        <RidersList />
      </Suspense>
    </>
  );
}
