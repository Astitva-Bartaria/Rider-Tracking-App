import React from "react";
import MapWithRoute from "./MapWithRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <MapWithRoute />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
