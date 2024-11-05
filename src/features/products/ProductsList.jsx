import { useMemo, useState } from "react";
import { Table, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProducts } from "../../api/productsApi";
import SearchBarComponent from "../../components/ui/SearchBarComponent";
import SelectCategoryComponent from "../../components/ui/SelectCategoryComponent";
import ItemsPerPageComponent from "../../components/ui/ItemsPerPageComponent";
import UpdateProductModalComponent from "../../components/modals/UpdateProductModalComponent";

export default function ProductsList() {
  const queryClient = useQueryClient();
  const {
    data: products = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredItems = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((entry) => {
          if (entry.category === undefined || entry.category === null)
            return false; // Ensure category is valid

          const matchesSearch = Object.values(entry).some((value) => {
            if (value !== null && value !== undefined) {
              return value
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            }
            return false;
          });

          const matchesCategory =
            selectedCategory === "" || entry.category === selectedCategory;

          return matchesSearch && matchesCategory;
        })
      : [];
  }, [products, searchTerm, selectedCategory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = useMemo(() => {
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, indexOfFirstItem, indexOfLastItem]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    deleteMutation.mutate(id);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
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
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry) => (
                <tr key={entry._id}>
                  <td style={{ width: 100 }}>
                    <Image
                      src={
                        entry.photoURL
                          ? entry.photoURL[0]
                          : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                      width={100}
                      height={60}
                      className="object-fit-cover"
                    />
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 150 }}>
                    {entry.title}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 150 }}>
                    {entry.description}
                  </td>
                  <td>{entry.category}</td>
                  <td>₱{entry.price}</td>
                  <td>{entry.quantity}</td>
                  <td>
                    <Link
                      className="btn btn-primary m-1"
                      to={`/home/product/${entry._id}`}
                    >
                      View
                    </Link>
                    <Button
                      variant="success"
                      className="m-1"
                      onClick={() => handleUpdate(entry)}
                    >
                      Edit
                    </Button>
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
        )}
      </div>
      {selectedProduct && (
        <UpdateProductModalComponent
          id={selectedProduct._id}
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          photoURL={selectedProduct.photoURL}
          title={selectedProduct.title}
          description={selectedProduct.description}
          category={selectedProduct.category}
          price={selectedProduct.price}
          quantity={selectedProduct.quantity}
        />
      )}
    </>
  );
}
