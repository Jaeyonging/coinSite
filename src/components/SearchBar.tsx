import React from 'react';
import { Form } from 'react-bootstrap';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <Form.Control
      type="text"
      placeholder="코인 이름으로 검색"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      style={{
        marginBottom: '20px',
        width: '100%',
        maxWidth: '500px',
      }}
    />
  );
};

export default SearchBar;
