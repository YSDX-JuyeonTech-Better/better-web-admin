import { NextResponse } from "next/server";
import { insertFullProduct } from "../../../../lib/products/insert";
import { Product } from "../../../../lib/products/types";

export async function POST(request: Request) {
  try {
    const product: Product = await request.json();

    await insertFullProduct(product);

    return NextResponse.json({ message: "Product inserted successfully" });
  } catch (error) {
    console.error("Database insertion failed:", error);
    return NextResponse.json(
      { error: "Database insertion failed", details: error.message },
      { status: 500 }
    );
  }
}
