import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request) {
  // URL에서 쿼리 파라미터를 추출
  const { searchParams } = new URL(request.url);

  // 특정 파라미터 추출 예시 (예: /api/endpoint?name=John)
  const user_id = searchParams.get("user_id");

  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  try {
    const [rows] = await pool.query(
      `DELETE FROM users where user_id="${user_id}"`
    );
    return NextResponse.json(rows, { headers });
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
