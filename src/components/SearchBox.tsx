import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  buttonText?: string;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  buttonText = 'Search',
  className = '',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex items-center bg-white rounded-md shadow-md overflow-hidden ${className}`}
    >
      <div className="flex-grow px-4 py-3 flex items-center">
        <Search size={20} className="text-sky-gray-400 mr-2" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none text-sky-gray-800 placeholder-sky-gray-400"
        />
      </div>
      
      <Button 
        variant="primary" 
        type="submit"
        className="rounded-l-none h-full px-5"
      >
        {buttonText}
      </Button>
    </form>
  );
};

export default SearchBox;