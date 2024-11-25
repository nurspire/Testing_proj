import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  p_name: { type: String, required: true },
  p_Price: { type: String, required: true },
  p_image: { type: String, required: true },
  p_description: { type: String, required: true },
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
