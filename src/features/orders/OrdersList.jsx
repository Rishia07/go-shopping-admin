import { useMemo, useState } from "react";
import { Image, Table } from "react-bootstrap";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchOrders, updateOrder } from "../../api/ordersApi";
import SearchBarComponent from "../../components/ui/SearchBarComponent";
import SelectCategoryComponent from "../../components/ui/SelectCategoryComponent";
import ItemsPerPageComponent from "../../components/ui/ItemsPerPageComponent";

export default function OrdersList() {
  const queryClient = useQueryClient();
  const {
    data: orders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    staleTime: 10000,
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return Array.isArray(orders)
      ? orders.filter((entry) => {
          if (!entry.product) return false;

          const matchesSearchTerm = Object.values(entry).some((value) => {
            if (typeof value === "object" && value !== null) {
              return Object.values(value).some(
                (val) =>
                  val !== null &&
                  val
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              );
            }
            return (
              value !== null &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
          });

          const matchesCategory =
            selectedCategory === "" ||
            (entry.product.category &&
              entry.product.category === selectedCategory);

          return matchesSearchTerm && matchesCategory && entry.status !== "Received";
        })
      : [];
  }, [orders, searchTerm, selectedCategory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = useMemo(() => {
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, indexOfFirstItem, indexOfLastItem]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <SearchBarComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <SelectCategoryComponent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ItemsPerPageComponent
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          length={filteredItems.length}
        />
      </div>

      <div className="w-100 overflow-auto">
        {currentItems.length === 0 ? (
          <div className="text-center">No data available.</div>
        ) : (
          <Table striped bordered hover className="fs-5">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Ordered</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry) => (
                <tr key={entry._id}>
                  <td style={{ width: 100 }}>
                    <Image
                      src={
                        entry.product.photoURL
                          ? entry.product.photoURL[0]
                          : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                      width={100}
                      height={60}
                      className="object-fit-cover"
                    />
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 500 }}>
                    {entry.product.title}
                  </td>
                  <td>{entry.product.category}</td>
                  <td>₱{entry.price}</td>
                  <td>{entry.quantity}</td>
                  <td style={{ minWidth: 150 }}>{entry.status}</td>
                  <td>
                    {entry.user.firstName} {entry.user.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}
