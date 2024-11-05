import { useEffect, useState } from "react";
import { Form, Modal, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { storage } from "../../config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { categoryList } from "../../data/categoryList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../api/productsApi";
import Cookies from "js-cookie";

export default function UpdateProductModalComponent({
  id,
  show,
  handleClose,
  photoURL,
  title,
  description,
  category,
  price,
  quantity,
}) {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [productData, setProductData] = useState({
    photoURL: photoURL || [],
    title: title || "",
    description: description || "",
    category: category || "",
    price: price || 0,
    quantity: quantity || 0,
    user: userId,
  });

  useEffect(() => {
    setProductData({
      photoURL: photoURL || [],
      title: title || "",
      description: description || "",
      category: category || "",
      price: price || 0,
      quantity: quantity || 0,
      user: userId,
    });
  }, [photoURL, title, description, category, price, quantity, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageUpload(files);
  };
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error adding product:", error);
    },
  });

  const handleUpdateProduct = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let imageUrls = [];

      if (imageUpload && imageUpload.length > 0) {
        for (let i = 0; i < imageUpload.length; i++) {
          const imageRef = ref(
            storage,
            `/product/images/${Date.now()}_${imageUpload[i].name}`
          );
          const imageUploadTask = await uploadBytes(imageRef, imageUpload[i]);
          const imageUrl = await getDownloadURL(imageUploadTask.ref);
          imageUrls.push(imageUrl);
        }
      }

      const updatedProductData = {
        ...productData,
        photoURL: imageUrls.length > 0 ? imageUrls : productData.photoURL,
      };

      await updateMutation.mutate({ id, updatedProduct: updatedProductData });
      toast.success("You have successfully updated your product");
      handleClose();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPhotoURL" className="mb-3">
            <Form.Label>Photo URL</Form.Label>
            <Form.Control
              type="file"
              name="photoURL"
              multiple
              onChange={handleImageChange}
              accept="image/*"
            />
            {productData.photoURL && productData.photoURL.length > 0 && (
              <div className="mt-2 d-flex flex-wrap">
                {productData.photoURL.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    thumbnail
                    width={60}
                    height={60}
                    className="me-2 mb-2"
                    alt={`Product Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Form.Group>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={productData.title}
              onChange={handleChange}
              placeholder="Enter product title"
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={productData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </Form.Group>
          <Form.Group controlId="formCategory" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categoryList.map((categoryItem, index) => (
                <option key={index} value={categoryItem}>
                  {categoryItem}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPrice" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder="Enter product price"
              min="0"
              step="0.01"
            />
          </Form.Group>
          <Form.Group controlId="formQuantity" className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              placeholder="Enter product quantity"
              min="0"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={loading}
          onClick={handleUpdateProduct}
        >
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
