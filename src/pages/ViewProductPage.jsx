import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingComponent from "../components/ui/LoadingComponent";
import { fetchProduct } from "../api/productsApi";
import { Carousel, Image } from "react-bootstrap";

export default function ViewProductPage() {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="w-100 overflow-auto p-2">
      <div>
        {product.photoURL && (
          <Carousel>
            {product.photoURL.map((photo, index) => (
              <Carousel.Item key={index}>
                <Image
                  src={photo}
                  className="w-100"
                  height={300}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  rounded
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
        <div>
          <div className="d-flex justify-content-between align-items-centergap-2">
            <h1 className="fs-1 fw-bold">{product.title}</h1>
            <h1 className="fs-1 fw-bold">₱ {product.price}</h1>
          </div>
          <p>{product.description}</p>
          <div className="d-flex gap-3">
            <p>Ratings: {product.totalRatings}</p>
          </div>
        </div>
        <p className="fs-4 fw-bold">Customer Reviews</p>
        {product.reviews && (
          <ul>
            {product.reviews.length === 0
              ? "No reviews yet"
              : product.reviews.map((review, index) => (
                  <li key={index}>
                    {review.review} by {review.user.firstName}{" "}
                    {review.user.lastName}
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
}
