import { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { storage } from "../../config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { categoryList } from "../../data/categoryList";
import { createProduct } from "../../api/productsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export default function AddProductModalComponent({ show, handleClose }) {
  const queryClient = useQueryClient();
  const userId = Cookies.get("userId");
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [productData, setProductData] = useState({
    photoURL: [],
    title: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
    user: userId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageUpload(files);
  };

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error adding product:", error);
    },
  });

  const handleAddproduct = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let imageUrls = [];

      if (imageUpload) {
        for (let i = 0; i < imageUpload.length; i++) {
          const imageRef = ref(
            storage,
            `/product/images/${imageUpload[i].name}`
          );
          const imageUploadTask = uploadBytes(imageRef, imageUpload[i]);

          const imageSnapshot = await imageUploadTask;

          const imageUrl = await getDownloadURL(imageSnapshot.ref);
          imageUrls.push(imageUrl);
        }
      }

      const newProductData = {
        ...productData,
        photoURL: imageUrls,
      };

      await addMutation.mutate(newProductData);

      toast.success("Product added successfully!");
      setProductData({
        photoURL: [],
        title: "",
        description: "",
        category: "",
        price: 0,
        quantity: 0,
        user: userId,
      });
      handleClose();
    } catch (error) {
      console.error("Error on uploading images:", error);
      toast.error("Error on uploading images!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPhotoURL">
            <Form.Label>Pictures</Form.Label>
            <Form.Control
              type="file"
              name="photoURL"
              multiple
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categoryList.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" disabled={loading} onClick={handleAddproduct}>
          {loading ? "Loading..." : "Add Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
