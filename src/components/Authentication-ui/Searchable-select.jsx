import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  const selectedOption = options.find((option) => option.id === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = useCallback(
    (optionId) => {
      onChange(optionId);
      setSearchTerm(options.find((opt) => opt.id === optionId)?.label || "");
      setIsOpen(false);
    },
    [onChange, options]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(selectedOption?.label || "");
      }
    },
    [selectedOption]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setSearchTerm(selectedOption?.label || "");
  }, [selectedOption]);

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className="relative cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm("");
        }}
      >
        <input
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
          readOnly={!isOpen}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No results found.
            </div>
          ) : (
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-gray-100 text-sm ${
                    option.id === value ? "bg-gray-50 font-semibold" : ""
                  }`}
                  onClick={() => handleSelect(option.id)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {selectedOption && !isOpen && (
        <p className="mt-2 text-sm text-gray-600">
          Selected District: <strong>{selectedOption.label}</strong>
        </p>
      )}
    </div>
  );
}
