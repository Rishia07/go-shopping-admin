import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchAdvertisements,
  deleteAdvertisement,
} from "../../api/advertisementApi";
import { Carousel, Button } from "react-bootstrap"; // Import Carousel
import AdvertisementCard2 from "../../components/cards/AdvertisementCard2";

export default function AdvertisementsList2() {
  const queryClient = useQueryClient();
  const {
    data: advertisements = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["advertisements"],
    queryFn: fetchAdvertisements,
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return Array.isArray(advertisements)
      ? advertisements.filter((entry) =>
          Object.values(entry).some((value) => {
            if (value !== null && value !== undefined) {
              return value
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            }
            return false;
          })
        )
      : [];
  }, [advertisements, searchTerm]);

  const deleteMutation = useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?"))
      return;
    deleteMutation.mutate(id);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <>
      {filteredItems?.length === 0 ? (
        <div className="text-center">No data available.</div>
      ) : (
        <Carousel>
          {filteredItems.slice(0, itemsPerPage).map((item) => (
            <Carousel.Item key={item.id}>
              <AdvertisementCard2 item={item} handleDelete={handleDelete} />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
}
