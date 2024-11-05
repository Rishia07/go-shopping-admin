import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../api/usersApi";
import { Image, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function AccountManagementCard() {
  const {
    data: users = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = useMemo(() => {
    return Array.isArray(users) ? users.slice(0, 5) : [];
  }, [users]);
  
  if (isLoading) return <Spinner variant="dark" />;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div>
      <h4>Account Management</h4>
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2">Profile</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((entry) => (
              <tr key={entry._id}>
                <td className="p-2">
                  <Image
                    src={
                      entry.profilePic
                        ? entry.profilePic
                        : "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                    }
                    width={40}
                    height={40}
                    roundedCircle
                    alt={`${entry.firstName} ${entry.lastName}`}
                  />
                </td>
                <td className="w-100 p-2">
                  {entry.lastName}, {entry.firstName}
                </td>
                <td className="w-100 p-2">{entry.email || "N/A"}</td>
                <td className="p-2">
                  <Link
                    to={`/home/user/${entry._id}`}
                    className="btn btn-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
