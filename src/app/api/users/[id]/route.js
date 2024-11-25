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

// Export the GET method
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params; // Extract ID from the route

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID", success: false });
    }

    // Find product by ID
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found", success: false });
    }

    return NextResponse.json({ product, success: true });
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    return NextResponse.json({ error: "Failed to fetch product", success: false });
  }
}
