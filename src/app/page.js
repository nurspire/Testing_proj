'use client';
import React, { useState } from "react";

const Page = () => {
  const [product, setProduct] = useState({
    p_name: "",
    p_image: null,
    p_description: "",
    p_Price: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the JSON payload
    const payload = {
      p_name: product.p_name,
      p_Price: product.p_Price,
      p_image: product.p_image ? product.p_image.name : "", // If file handling is not implemented
      p_description: product.p_description,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Product added successfully!");
        setProduct({ p_name: "", p_image: null, p_description: "", p_Price: "" });
      } else {
        setMessage(result.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Product Upload</h1>
      {message && <p className="message">{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="form-group">
          <label className="label">Enter Product Name</label>
          <input
            type="text"
            className="input"
            placeholder="Product Name"
            name="p_name"
            value={product.p_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Image */}
        <div className="form-group">
          <label className="label">Choose Product Image</label>
          <input
            type="file"
            className="input-file"
            name="p_image"
            onChange={handleChange}
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label className="label">Enter Product Description</label>
          <textarea
            className="input-textarea"
            placeholder="Product Description"
            name="p_description"
            value={product.p_description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Price */}
        <div className="form-group">
          <label className="label">Enter Product Price</label>
          <input
            type="number"
            className="input"
            placeholder="Product Price"
            name="p_Price"
            value={product.p_Price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Page;
