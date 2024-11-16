import { useMemo, useState } from "react";
import { Table, Image, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, fetchUsers, updateUser } from "../../api/usersApi";
import SearchBarComponent from "../../components/ui/SearchBarComponent";
import ItemsPerPageComponent from "../../components/ui/ItemsPerPageComponent";

export default function UsersList() {
  const queryClient = useQueryClient();
  const {
    data: users = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredItems = useMemo(() => {
    return Array.isArray(users)
      ? users.filter((entry) =>
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
  }, [users, searchTerm]);

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
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const updateIdMutation = useMutation({
    mutationFn: (id) => updateUser(id, { validIdPic: "" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Error updating valid ID:", error);
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteMutation.mutate(id);
  };

  const handleShowId = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const handleRemoveId = () => {
    if (window.confirm("Are you sure you want to delete this valid ID?")) {
      updateIdMutation.mutate(selectedUserId);
    }
  };

  const selectedUser = users.find((user) => user._id === selectedUserId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Phone Number</th>
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
                  <td>
                    <Link className="btn btn-primary m-1" to={`/home/user/${entry._id}`}>
                      View
                    </Link>
                    <Button variant="danger" className="m-1" onClick={() => handleDelete(entry._id)}>
                      Delete
                    </Button>
                    <Button variant="info" className="m-1" onClick={() => handleShowId(entry._id)}>
                      Verify ID
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Modal to display and delete the valid ID */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verification ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser?.validIdPic ? (
            <Image src={selectedUser.validIdPic} alt="Valid ID" fluid />
          ) : (
            <p>No valid ID available for this user.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedUser?.validIdPic && (
            <Button variant="danger" onClick={handleRemoveId}>
              Remove ID
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
