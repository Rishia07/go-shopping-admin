import { Suspense } from "react";
import LoadingComponent from "../components/ui/LoadingComponent";
import SalesChart from "../components/charts/SalesChart";

export default function SalesPage() {
    return (
        <>
          <h2 className="fw-bold text-success">Sales</h2>
    
          <hr />
    
          <Suspense fallback={<LoadingComponent />}>
            <SalesChart />
          </Suspense>
        </>
      );
}
