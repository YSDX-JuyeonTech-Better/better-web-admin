import pool from "@/lib/db";
import { insertFullProduct } from "@/lib/products/insert";
import { Product } from "@/lib/products/types";
import { NextResponse } from "next/server";

// 전체 상품 리스트 조회(GET)
// 유연성을 위해 request 타입을 any로 지정. 추후 변경 필요
export async function GET() {
  let query = "SELECT * FROM products";

  try {
    const [rows] = await pool.query(query);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
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
    } else {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json(
        { success: false, error: "An unexpected error occurred" },
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
