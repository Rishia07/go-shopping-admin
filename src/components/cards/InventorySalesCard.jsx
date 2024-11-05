import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../api/productsApi";
import { Button, Image, Spinner } from "react-bootstrap";
import AddProductModalComponent from "../modals/AddProductModalComponent";

export default function InventorySalesCard() {
  const {
    data: products = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const [showModal, setShowModal] = useState();

  const lowStockProducts = useMemo(() => {
    return Array.isArray(products)
      ? products.filter((entry) => entry.quantity <= 10).slice(0, 5)
      : [];
  }, [products]); 

  if (isLoading) return <Spinner variant="light" />;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Inventory Sales</h4>

        <Button variant="dark" onClick={() => setShowModal(true)}>
          Add Product
        </Button>
      </div>
      {lowStockProducts.length > 0 && (
        <div className="w-100 overflow-auto">
          <table className="w-100 border-collapse bg-primary">
            <thead>
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((entry) => (
                <tr key={entry._id}>
                  <td className="p-2">
                    <Image
                      src={
                        entry.photoURL
                          ? entry.photoURL[0]
                          : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                      width={40}
                      height={40}
                      className="object-fit-cover"
                    />
                  </td>
                  <td className="text-truncate p-2" style={{ maxWidth: 500 }}>
                    {entry.title}
                  </td>
                  <td className="text-danger p-2">
                    {entry.quantity <= 0 ? "Out of Stock" : entry.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddProductModalComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
}
