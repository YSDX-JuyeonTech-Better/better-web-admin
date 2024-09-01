import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve details of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve.
 *     responses:
 *       '200':
 *         description: Successfully retrieved product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Product Name
 *                     brand:
 *                       type: string
 *                       example: Brand Name
 *                     price:
 *                       type: number
 *                       example: 100.00
 *                     category:
 *                       type: string
 *                       example: Category Name
 *                     description:
 *                       type: string
 *                       example: This is a product description.
 *                     image_link:
 *                       type: string
 *                       example: http://example.com/image.jpg
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                     status:
 *                       type: string
 *                       example: available
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T12:00:00Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T12:00:00Z
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Product not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Database query failed
 *                 details:
 *                   type: string
 *                   example: Error message here
 */

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

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     description: Update details of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               brand:
 *                 type: string
 *                 example: Updated Brand Name
 *               price:
 *                 type: number
 *                 example: 150.00
 *               category:
 *                 type: string
 *                 example: Updated Category Name
 *               description:
 *                 type: string
 *                 example: This is an updated product description.
 *               image_link:
 *                 type: string
 *                 example: http://example.com/updated-image.jpg
 *               stock:
 *                 type: integer
 *                 example: 100
 *               status:
 *                 type: string
 *                 example: out_of_stock
 *     responses:
 *       '200':
 *         description: Successfully updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *       '404':
 *         description: Product not found or no changes made
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Product not found or no changes made
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Database update failed
 *                 details:
 *                   type: string
 *                   example: Error message here
 */

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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     description: Delete a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete.
 *     responses:
 *       '200':
 *         description: Successfully deleted product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Product not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Database deletion failed
 *                 details:
 *                   type: string
 *                   example: Error message here
 */

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
