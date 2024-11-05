import { Suspense, lazy } from "react";
import LoadingComponent from "../components/ui/LoadingComponent"; 

const UsersList = lazy(() => import("../features/users/UsersList"));

export default function UserPage() {
  return (
    <>
      <h2 className="fw-bold text-success">Users</h2>

      <hr />
      
      <Suspense fallback={<LoadingComponent />}>
        <UsersList />
      </Suspense>
    </>
  );
}
