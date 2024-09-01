import pool from "@/lib/db";
import { User } from "@/lib/users/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a list of users with optional search and filter criteria.
 *     description: Retrieves a paginated list of users. Optional query parameters allow for filtering by ID, name, gender, admin status, registration date range, and active status.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: The number of records per page.
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           example: "123"
 *         required: false
 *         description: Filter users by ID (partial match).
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "John"
 *         required: false
 *         description: Filter users by name (partial match).
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         required: false
 *         description: Filter users by gender.
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           example: "true"
 *         required: false
 *         description: Filter users by active status (true for active, false for inactive).
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         required: false
 *         description: Filter users who registered on or after this date.
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-12-31"
 *         required: false
 *         description: Filter users who registered on or before this date.
 *       - in: query
 *         name: is_admin
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           example: "true"
 *         required: false
 *         description: Filter users by admin status (true for admin, false for non-admin).
 *     responses:
 *       200:
 *         description: A paginated list of users.
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
 *                         type: string
 *                         example: "123"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       regist_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-15T08:00:00Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *       500:
 *         description: Database query failed.
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
 *                   example: "Error details here"
 */

// 전체 회원 리스트 조회 (GET)
// 검색 - id/이름/성별/활성화여부/가입일/관리자여부
// 페이지네이션 추가
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // 페이지 기본값 1로 설정
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10); // 페이지에 보여줄 열의 기본값 갯수: 10개
  const offset = (page - 1) * pageSize;

  ////////////////////////* 검색 및 필터링 코드 */////////////////////////
  // 검색 조건 추출
  const id = searchParams.get("id") || "";
  const name = searchParams.get("name") || "";
  const gender = searchParams.get("gender") || "";
  const is_active = searchParams.get("is_active") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  const is_admin = searchParams.get("is_admin") || "";

  // 기본 쿼리 및 필터 조건 추가
  let query = `SELECT * FROM users WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
  let queryParams: any[] = [];
  let countQueryParams: any[] = [];

  // 회원 id로 검색 (일부 검색 가능)
  if (id) {
    query += ` AND id LIKE ?`;
    countQuery += ` AND id LIKE ?`;
    queryParams.push(`%${id}`);
    countQueryParams.push(`%${id}`);
  }

  // 회원명으로 검색 (일부 검색 가능)
  if (name) {
    query += ` AND name LIKE ?`;
    countQuery += ` AND name LIKE ?`;
    queryParams.push(`%${name}%`);
    countQueryParams.push(`%${name}%`);
  }

  // 성별로 필터링
  if (gender) {
    query += ` AND gender = ?`;
    countQuery += ` AND gender = ?`;
    queryParams.push(gender);
    countQueryParams.push(gender);
  }

  // 관리자 여부로 필터링
  if (is_admin) {
    query += ` AND is_admin = ?`;
    countQuery += ` AND is_admin = ?`;
    queryParams.push(is_admin === "true" ? 1 : 0);
    countQueryParams.push(is_admin === "true" ? 1 : 0);
  }

  // 가입일 필터링-시작범위 조건
  if (start_date) {
    query += ` AND regist_date >= ?`;
    countQuery += ` AND regist_date >= ?`;
    queryParams.push(start_date);
    countQueryParams.push(start_date);
  }

  // 가입일 필터링-종료범위 조건
  if (end_date) {
    query += ` AND regist_date <= ?`;
    countQuery += ` AND regist_date <= ?`;
    queryParams.push(end_date);
    countQueryParams.push(end_date);
  }

  // 회원 활성화여부 필터링(탈퇴한 회원인지 아닌지)
  if (is_active) {
    query += ` AND is_active = ?`;
    countQuery += ` AND is_active = ?`;
    queryParams.push(is_active === "true" ? 1 : 0);
    countQueryParams.push(is_active === "true" ? 1 : 0);
  }

  ////////////////////////* 페이지네이션 코드 */////////////////////////
  // 페이지네이션을 위한 LIMIT, OFFSET 추가
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(pageSize, offset);

  try {
    // 데이터 조회
    const [rows] = await pool.query(query, queryParams);

    // 총 레코드 수 조회
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
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Registers a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique identifier for the user.
 *                 example: "user123"
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: The gender of the user.
 *                 example: "male"
 *               phone_num:
 *                 type: string
 *                 description: The phone number of the user.
 *                 example: "010-1234-5678"
 *               address:
 *                 type: string
 *                 description: The address of the user.
 *                 example: "123 Main St, Cityville"
 *     responses:
 *       201:
 *         description: User inserted successfully
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
 *                   example: "User inserted successfully"
 *                 userid:
 *                   type: integer
 *                   description: The ID of the newly created user.
 *                   example: 1
 *       500:
 *         description: Database insertion failed
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
 *                   example: "Database insertion failed"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */

// 회원 등록(POST)
export async function POST(request: any) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const body: User = await request.json(); // 요청된 데이터(json)

    // 삽입할 데이터 준비
    const query = `INSERT INTO users(id, name, email, password, gender, phone_num, address, regist_date, modify_date) VALUES (?,?,?,?,?,?,?,NOW(),NOW())`;
    const values = [
      body.id,
      body.name,
      body.email,
      body.password,
      body.gender,
      body.phone_num,
      body.address,
    ];

    // 데이터베이스에 삽입
    const [result] = await connection.query<ResultSetHeader>(query, values);
    const userId = result.insertId; // 생성된 id 값

    // 트랜잭션 커밋
    await connection.commit();

    // 삽입된 데이터의 id 반환
    return NextResponse.json(
      {
        success: true,
        message: "User inserted successfully",
        userid: userId,
      },
      { status: 201 } // 성공적으로 삽입된 경우, HTTP 상태 코드 201 반환
    );
  } catch (error) {
    // 에러 발생 시 트랜잭션 롤백
    await connection.rollback();

    // 에러가 발생한 경우, 에러 메시지를 로그로 출력하고 적절한 응답 반환
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
  } finally {
    // 연결 해제
    connection.release();
  }
}
