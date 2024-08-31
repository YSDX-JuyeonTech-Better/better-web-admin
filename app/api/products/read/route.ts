import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request: any) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  const { searchParams } = new URL(request.url);

  const _keyword = searchParams.get("keyword");
  const _type = searchParams.get("type");

  let query = `SELECT * FROM products`;
  if (_keyword !== null && _type !== null && _keyword !== "" && _type !== "") {
    query += ` where ${_type}='${_keyword}'`;
  }

  try {
    const [rows] = await pool.query(query);
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
