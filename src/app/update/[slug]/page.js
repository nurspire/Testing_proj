'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const UpdatePage = () => {
  const { slug: id } = useParams(); // Use dynamic slug (product ID)
  const router = useRouter();

  const [formData, setFormData] = useState({
    p_name: "",
    p_Price: "",
    p_image: "",
    p_description: "",
  });
  const [imagePreview, setImagePreview] = useState(null); // For showing image preview
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const result = await response.json();
        if (result.success) {
          const { p_name, p_Price, p_image, p_description } = result.product;
          setFormData({ p_name, p_Price, p_image, p_description });
          setImagePreview(p_image); // Set image preview
        } else {
          setMessage(result.error || "Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
        setMessage("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, p_image: file }); // Store file
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("p_name", formData.p_name);
    formDataToSend.append("p_Price", formData.p_Price);
    formDataToSend.append("p_description", formData.p_description);

    if (formData.p_image instanceof File) {
      formDataToSend.append("p_image", formData.p_image); // Only append if it's a new file
    }

    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        body: JSON.stringify({
          id,
          ...formData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Product updated successfully!");
        router.push("/product"); // Redirect to product list page
      } else {
        setMessage(result.error || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
      setMessage("Something went wrong.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1 className="heading">Update Product</h1>
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
            value={formData.p_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Image */}
        <div className="form-group">
          <label className="label">Choose Product Image</label>
          {imagePreview && <img src={imagePreview} alt="Product Preview" className="image-preview" />}
          <input
            type="file"
            className="input-file"
            name="p_image"
            onChange={handleImageChange}
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label className="label">Enter Product Description</label>
          <textarea
            className="input-textarea"
            placeholder="Product Description"
            name="p_description"
            value={formData.p_description}
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
            value={formData.p_Price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdatePage;
