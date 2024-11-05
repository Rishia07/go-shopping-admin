import { Form } from "react-bootstrap";
import { categoryList } from "../../data/categoryList";

export default function SelectCategoryComponent({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <Form.Select
      size="lg"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      aria-label="Category Filter"
    >
      <option value="">All Categories</option>
      {categoryList.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </Form.Select>
  );
}
