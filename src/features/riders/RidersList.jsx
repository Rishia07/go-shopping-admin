import { useMemo, useState } from "react";
import { Table, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRider, fetchRiders } from "../../api/ridersApi";
import SearchBarComponent from "../../components/ui/SearchBarComponent";
import ItemsPerPageComponent from "../../components/ui/ItemsPerPageComponent";

export default function RidersList() {
  const queryClient = useQueryClient();
  const {
    data: riders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["riders"],
    queryFn: fetchRiders,
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return Array.isArray(riders)
      ? riders.filter((entry) =>
          Object.values(entry).some((value) => {
            if (value !== null && value !== undefined) {
              const matchesSearch = value
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
  
              return matchesSearch;
            }
            return false;
          })
        )
      : [];
  }, [riders, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = useMemo(() => {
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, indexOfFirstItem, indexOfLastItem]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteRider,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <SearchBarComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ItemsPerPageComponent
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          length={50}
        />
      </div>

      <div className="w-100 overflow-auto">
        {currentItems.length === 0 ? (
          <div className="text-center">No data available.</div>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Vehicle</th>
                  <th>Plate Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((entry) => (
                  <tr key={entry._id}>
                    <td style={{ width: 60 }}>
                      <Image
                        src={
                          entry.profilePic
                            ? entry.profilePic
                            : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                        }
                        width={60}
                        height={60}
                        roundedCircle
                        className="object-fit-cover"
                      />
                    </td>
                    <td>{entry.lastName}</td>
                    <td>{entry.firstName}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phoneNumber}</td>
                    <td>{entry.vehicle}</td>
                    <td>{entry.plateNumber}</td>
                    <td>
                      <Link
                        className="btn btn-primary m-1"
                        to={`/home/rider/${entry._id}`}
                      >
                        View
                      </Link>
                      <Button
                        variant="danger"
                        className="m-1"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </>
  );
}
