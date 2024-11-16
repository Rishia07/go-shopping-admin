import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Spinner } from "react-bootstrap";
import { fetchRiderCount } from "../../api/ridersApi";
import { fetchClientCount } from "../../api/usersApi";

export default function AccountManagementCard() {
  const { data: riderCount, isLoading: isLoadingRiders } = useQuery({
    queryKey: ["ridersCount2"],
    queryFn: fetchRiderCount,
  });

  const { data: clientCount, isLoading: isLoadingClients } = useQuery({
    queryKey: ["clientsCount2"],
    queryFn: fetchClientCount,
  });

  if (isLoadingRiders || isLoadingClients) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="text-center d-flex justify-content-around align-items-center py-3">
      <div className="d-flex flex-column align-items-center mx-4">
        <h4>Users: {clientCount.count || 0}</h4>
        {/* <Button variant="primary" className="px-4" onClick={() => console.log("View Users")}>
          View Users
        </Button> */}
      </div>
      <div className="d-flex flex-column align-items-center mx-4">
        <h4>Riders: {riderCount.count || 0}</h4>
        {/* <Button variant="primary" className="px-4" onClick={() => console.log("View Riders")}>
          View Riders
        </Button> */}
      </div>
    </div>
  );
}
