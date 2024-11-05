import { InputGroup, FormControl } from "react-bootstrap";

export default function SearchBarComponent ({ searchTerm, setSearchTerm }) {
  return (
    <InputGroup>
      <FormControl
        placeholder="Search here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="lg"
      />
    </InputGroup>
  );
}