'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/users"); // Corrected endpoint for products
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.success) {
        setProducts(result.products);
      } else {
        setMessage(result.error || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setProducts(products.filter((product) => product._id !== id));
        setMessage("Product deleted successfully.");
      } else {
        setMessage(result.error || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Something went wrong.");
    }
  };

  // Placeholder update function
  const handleUpdate = (id) => {
   
    // Navigate to the update page
    router.push(`/update/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-display-container">
      <h1 className="page-heading">All Products</h1>
      {message && <p className="message">{message}</p>}
      <div className="product-cards-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.p_image} alt={product.p_name} className="product-image" />
              <div className="product-details">
                <h2 className="product-name">{product.p_name}</h2>
                <p className="product-description">{product.p_description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.p_Price}</span>
                  <div className="product-actions">
                  <button className="btn-update" onClick={() => handleUpdate(product._id)}>
                      Update
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
