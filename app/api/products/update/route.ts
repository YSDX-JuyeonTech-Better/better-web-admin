import { NextResponse } from "next/server";
import { updateProduct } from "../../../../lib/products/update";
import { Product } from "../../../../lib/products/types";
import pool from "../../../../lib/db";

export async function POST(request) {
  // URL에서 쿼리 파라미터를 추출
  const body = await request.json();

  // 예시: { name: "John", age: 30 } 같은 데이터를 받아올 수 있음
  const { id, name, brand, price, category, description, image_link, stock } =
    body;

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  try {
    await updateProduct(
      id,
      name,
      brand,
      price,
      category,
      description,
      image_link,
      stock
    );

    return NextResponse.json({ headers });
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Database query failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new NextResponse(null, { headers });
}
