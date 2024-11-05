import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchAdvertisements,
  deleteAdvertisement,
} from "../../api/advertisementApi";
import SearchBarComponent from "../../components/ui/SearchBarComponent";
import ItemsPerPageComponent from "../../components/ui/ItemsPerPageComponent";
import AdvertisementCard from "../../components/cards/AdvertisementCard";

export default function AdvertisementsList() {
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

      {filteredItems?.length === 0 ? (
        <div className="text-center">No data available.</div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {filteredItems.slice(0, itemsPerPage).map((item) => (
            <AdvertisementCard
              key={item.id}
              item={item}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
