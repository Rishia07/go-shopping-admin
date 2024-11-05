import { Form } from "react-bootstrap";

export default function ItemsPerPageComponent({ itemsPerPage, handleItemsPerPageChange, length }) {
  return (
    <div className="w-full d-flex align-items-center gap-2">
      <Form.Label htmlFor="itemsPerPageSelect" className="fw-semibold fs-5">
        Items:
      </Form.Label>
      <Form.Select
        id="itemsPerPageSelect"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="w-auto"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value={length}>All</option>
      </Form.Select>
    </div>
  );
}