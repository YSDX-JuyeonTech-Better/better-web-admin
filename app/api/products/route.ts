import pool from "@/lib/db";
import { insertFullProduct } from "@/lib/products/insert";
import { Product } from "@/lib/products/types";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// 전체 상품 리스트 조회(GET) - 페이지네이션 추가
// 유연성을 위해 request 타입을 any로 지정. 추후 변경 필요
export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const offset = (page - 1) * pageSize;

  // 검색 조건 추출
  const name = searchParams.get("name") || "";
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const minPrice =
    searchParams.get("minPrice") !== null
      ? parseInt(searchParams.get("minPrice")!)
      : 0;
  const maxPrice =
    searchParams.get("maxPrice") !== null
      ? parseInt(searchParams.get("maxPrice")!)
      : 1000000;

  // 기본 쿼리 및 필터 조건 추가
  let query = `SELECT * FROM products WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) as total FROM products WHERE 1=1`; // WHERE 1=1값으로 동적 쿼리 생성
  let queryParams: any[] = [];
  let countQueryParams: any[] = [];

  if (name) {
    query += ` AND name LIKE ?`;
    countQuery += ` AND name LIKE ?`;
    queryParams.push(`%${name}%`);
    countQueryParams.push(`%${name}%`);
  }

  if (brand) {
    query += ` AND brand LIKE ?`;
    countQuery += ` AND brand LIKE ?`;
    queryParams.push(`%${brand}%`);
    countQueryParams.push(`%${brand}%`);
  }

  if (category) {
    query += ` AND category = ?`;
    countQuery += ` AND category = ?`;
    queryParams.push(category);
    countQueryParams.push(category);
  }

  if (status) {
    query += ` AND status = ?`;
    countQuery += ` AND status = ?`;
    queryParams.push(status);
    countQueryParams.push(status);
  }

  // isNaN 체크 추가
  if (!isNaN(minPrice)) {
    query += ` AND price >= ?`;
    countQuery += ` AND price >= ?`;
    queryParams.push(minPrice);
    countQueryParams.push(minPrice);
  }

  // isNaN 체크 추가
  if (!isNaN(maxPrice)) {
    query += ` AND price <= ?`;
    countQuery += ` AND price <= ?`;
    queryParams.push(maxPrice);
    countQueryParams.push(maxPrice);
  }

  // 페이지네이션을 위한 LIMIT, OFFSET 추가
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(pageSize, offset);

  try {
    // 데이터 조회
    const [rows] = await pool.query(query, queryParams);

    // 총 레코드 수 조회
    // query의 반환값인 QueryResult 형식을 처리하기 위해 RowDataPacket[] 타입을 명시적으로 지정
    const [totalRows] = await pool.query<RowDataPacket[]>(
      countQuery,
      countQueryParams
    );
    const total = totalRows[0].total;

    // 요청이 성공했을 경우, 페이지네이션 처리된 데이터를 반환
    return NextResponse.json({
      success: true,
      data: rows,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error) {
    // 요청이 실패했을 경우, 서버 응답 코드 500 반환
    // error 객체 타입 확인
    if (error instanceof Error) {
      console.error("Database query failed:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Database query failed",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}

// 상품 등록(POST)
export async function POST(request: any) {
  try {
    const body: Product = await request.json(); // 요청된 데이터(json)

    // 제품과 색상 정보를 데이터베이스에 삽입
    const productId = await insertFullProduct(body);

    // 삽입된 데이터의 id 반환
    return NextResponse.json(
      {
        success: true,
        message: "Product and colors inserted successfully",
        productId: productId,
      },
      { status: 201 } // 성공적으로 삽입된 경우, HTTP 상태 코드 201 반환
    );
  } catch (error) {
    // 에러가 발생한 경우, 에러 메시지를 로그로 출력하고 적절한 응답 반환
    // 에러 처리 및 객체 타입 확인
    if (error instanceof Error) {
      console.error("Database insertion failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "Database insertion failed",
          details: error.message,
        },
        { status: 500 } // 내부 서버 오류 상태 코드 500 반환
      );
    }
  }
}
