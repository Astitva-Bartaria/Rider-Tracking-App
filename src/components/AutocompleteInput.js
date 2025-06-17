import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";

const AutocompleteInput = ({ label, value, setValue, text, setText }) => {
  const [options, setOptions] = useState([]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setOptions([]);
      return;
    }
    // try {
    //   const res = await fetch(
    //     `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${query}`
    //   );
    //   const data = await res?.json();
    //   setOptions(data?.slice(0, 5) || []);
    // } catch (error) {
    //   toast.error("Error fetching suggestions!");
    // }
  };

  useEffect(() => {
    fetchSuggestions(text);
  }, [text]);

  const handleChange = (selected) => {
    if (selected?.length > 0) {
      const place = selected?.[0];
      setText(place?.display_name);
      setValue(`${place?.lat},${place?.lon}`);
    }
  };

  return (
    <>
      <label htmlFor={`autocomplete-${label}`} className="form-label mb-0">
        {label}
      </label>
      <Typeahead
        id={`autocomplete-${label}`}
        labelKey="display_name"
        onInputChange={(input) => setText(input)}
        onChange={handleChange}
        options={options}
        placeholder={label}
        selected={text ? [{ display_name: text }] : []}
        renderMenuItemChildren={(option) => <div>{option?.display_name}</div>}
        disabled
      />
    </>
  );
};

export default AutocompleteInput;
