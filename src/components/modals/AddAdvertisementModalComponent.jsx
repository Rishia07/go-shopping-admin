import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { storage } from "../../config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdvertisement } from "../../api/advertisementApi";

export default function AddAdvertisementModalComponent({ show, handleClose }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [advertisementData, setAdvertisementData] = useState({
    image: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvertisementData({
      ...advertisementData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);
  };

  const addMutation = useMutation({
    mutationFn: createAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error adding product:", error);
    },
  });

  const handleAddAdvertisement = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let imageUrl = "";

      if (imageUpload) {
        const imageRef = ref(
          storage,
          `/advertisement/images/${imageUpload.name}`
        );
        const imageSnapshot = await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(imageSnapshot.ref);
      }

      const newAdvertisementData = {
        ...advertisementData,
        image: imageUrl,
      };

      await addMutation.mutate(newAdvertisementData);

      toast.success("Advertisement added successfully!");
      setAdvertisementData({
        image: "",
        title: "",
        description: "",
      });
      handleClose();
    } catch (error) {
      console.error("Error on uploading image:", error);
      toast.error("Error on creating advertisement!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Advertisement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPhotoURL">
            <Form.Label>Picture</Form.Label>
            <Form.Control
              type="file"
              name="photoURL"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={advertisementData.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={advertisementData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="success"
          disabled={loading}
          onClick={handleAddAdvertisement}
        >
          {loading ? "Loading..." : "Add  Advertisement"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
