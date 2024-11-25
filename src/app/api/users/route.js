import mongoose from "mongoose";
import { Product } from "@/utils/models/product";
import { NextResponse } from "next/server";

// MongoDB connection utility
async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// Create a new product
export async function POST(request) {
  try {
    await connectDB();
    const { p_name, p_Price, p_image, p_description } = await request.json();

    const productExists = await Product.findOne({ p_name });
    if (productExists) {
      return NextResponse.json({ error: "Product already exists", success: false });
    }

    const product = await Product.create({ p_name, p_Price, p_image, p_description });
    return NextResponse.json({ message: "Product added successfully", product, success: true });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: error.message, success: false });
  }
}

// Fetch all products
export async function GET() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      const products = await Product.find(); // Fetch all products
      console.log( products);
      return NextResponse.json({ products, success: true });
    
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Failed to fetch products", success: false });
    }
  }
  

// Update a product
export async function PUT(request) {
  try {
    await connectDB();
    const { id, p_name, p_Price, p_image, p_description } = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { p_name, p_Price, p_image, p_description },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found", success: false });
    }

    return NextResponse.json({ message: "Product updated successfully", updatedProduct, success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message, success: false });
  }
}

// Delete a product
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found", success: false });
    }

    return NextResponse.json({ message: "Product deleted successfully", deletedProduct, success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message, success: false });
  }
}
