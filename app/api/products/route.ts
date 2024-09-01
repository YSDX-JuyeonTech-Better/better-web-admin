import pool from "@/lib/db";
import { insertFullProduct } from "@/lib/products/insert";
import { Product } from "@/lib/products/types";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products with optional filtering and pagination
 *     description: Retrieve a list of products from the database. Allows filtering by name, brand, category, status, and price range, with pagination support.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name (partial match)
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter products by brand (partial match)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, out_of_stock, discontinued]
 *         description: Filter products by status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter products with a minimum price (inclusive)
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter products with a maximum price (inclusive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "iPhone 12"
 *                       brand:
 *                         type: string
 *                         example: "Apple"
 *                       price:
 *                         type: integer
 *                         example: 799
 *                       description:
 *                         type: string
 *                         example: "The latest iPhone model with improved performance."
 *                       category:
 *                         type: string
 *                         example: "electronics"
 *                       image_link:
 *                         type: string
 *                         example: "http://example.com/images/iphone12.jpg"
 *                       stock:
 *                         type: integer
 *                         example: 50
 *                       status:
 *                         type: string
 *                         example: "available"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-08-25T12:34:56Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-08-26T12:34:56Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 total:
 *                   type: integer
 *                   example: 50
 *       400:
 *         description: Invalid request parameters
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
 *                   example: "Invalid request parameters"
 *       500:
 *         description: Internal server error
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
 *                   example: "Database query failed"
 *                 details:
 *                   type: string
 *                   example: "Error message details"
 */

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

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with associated colors
 *     description: Inserts a new product into the database along with its associated colors.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example Product
 *               brand:
 *                 type: string
 *                 example: Example Brand
 *               price:
 *                 type: number
 *                 example: 100
 *               category:
 *                 type: string
 *                 example: Example Category
 *               description:
 *                 type: string
 *                 example: This is an example product.
 *               image_link:
 *                 type: string
 *                 example: http://example.com/image.jpg
 *               stock:
 *                 type: number
 *                 example: 10
 *               status:
 *                 type: string
 *                 enum: [available, out_of_stock, discontinued]
 *                 example: available
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               product_colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hex_value:
 *                       type: string
 *                       example: #FFFFFF
 *                     color_name:
 *                       type: string
 *                       example: White
 *     responses:
 *       '201':
 *         description: Successfully created a new product with associated colors
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
 *                   example: Product and colors inserted successfully
 *                 productId:
 *                   type: integer
 *                   example: 123
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
 *                   example: Database insertion failed
 *                 details:
 *                   type: string
 *                   example: Error message here
 */

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
