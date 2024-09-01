import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

// id값으로 상품의 전체 정보 조회(GET)
export async function GET(
  // 유연성을 위해 any 타입 사용. 추후 NextRequest로 변경
  request: any,
  { params }: { params: { id: string } }
) {
  const productId = params.id; // 조회할 상품 id

  try {
    // pool.query 메서드의 반환값은 RowDataPacket[] 형식의 결과 데이터와 FieldPacket[] 메타 데이터로 구성된 배열
    // rows에는 반환값의 첫 번째 형식으로 명시적 타입 지정
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    // id로 검색한 결과가 없는 경우 (상품이 존재하지 않는 경우), 서버 응답 코드 404 반환
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    // 요청이 성공한 경우 그 결과를 반환
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    // 요청에 실패한 경우, 서버 응답코드 500 반환
    // error 객체 타입 체크
    if (error instanceof Error) {
      console.error("Database query failed", error);
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

// id값으로 상품 정보 수정(PUT)
export async function PUT(
  // 유연성을 위해 any 타입 사용. 추후 NextRequest로 변경
  request: any,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const body = await request.json(); // 요청된 데이터(json)

  try {
    // query타입을 명시적으로 ResultSetHeader로 지정 (구.OkPacket)
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE products SET name = ?, brand = ?, price = ?, category = ?, description = ?, image_link = ?, stock = ?, status = ?, updated_at = NOW() WHERE id= ?",
      [
        body.name,
        body.brand,
        body.price,
        body.category,
        body.description,
        body.image_link,
        body.stock,
        body.status,
        productId,
      ]
    );

    // 변경된 데이터가 없거나 id와 일치하는 상품을 찾지 못했을 경우, 서버 응답코드 404 반환
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found or no changes made" },
        { status: 404 }
      );
    }

    // 요청이 성공할 경우 서버 응답코드 200 반환
    return NextResponse.json(
      { success: true, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // 요청에 실패한 경우 서버 응답 코드 500 반환
    // error 객체 타입 체크
    if (error instanceof Error) {
      console.error("Dabatase updated failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "Database update failed",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}

// id값으로 상품 삭제(DELETE)
export async function DELETE(
  // 유연성을 위해 any 타입 사용. 추후 NextRequest로 변경
  request: any,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    // id와 일치하는 상품이 없는 경우, 서버 응답 코드 404 반환
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 요청이 성공한 경우, 서버 응답코드 200 반환
    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // 요청 실패 시 응답 코드 500 반환
    // error 객체 타입 체크
    if (error instanceof Error) {
      console.error("Database deletion failed", error);
      return NextResponse.json(
        {
          success: false,
          error: "Database deletion failed",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}
