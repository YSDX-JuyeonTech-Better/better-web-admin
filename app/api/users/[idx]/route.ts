import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /users/{idx}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user information by ID
 *     description: Retrieves the full information of a user by their unique identifier (idx).
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the user to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's information.
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
 *                     idx:
 *                       type: integer
 *                       example: 1
 *                     id:
 *                       type: string
 *                       example: "user123"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     password:
 *                       type: string
 *                       example: "hashed_password"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     phone_num:
 *                       type: string
 *                       example: "010-1234-5678"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, Cityville"
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     regist_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00Z"
 *       404:
 *         description: User not found.
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
 *                   example: "User not found"
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
 *                   example: "Error message"
 */

// id값으로 회원의 전체 정보 조회(GET)
export async function GET(
  // 유연성을 위해 any 타입 사용. 추후 NextRequest로 변경
  request: any,
  { params }: { params: { idx: number } }
) {
  const userIdx = params.idx; // 조회할 회원 idx

  try {
    // pool.query 메서드의 반환값은 RowDataPacket[] 형식의 결과 데이터와 FieldPacket[] 메타 데이터로 구성된 배열
    // rows에는 반환값의 첫 번째 형식으로 명시적 타입 지정
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE idx = ?",
      [userIdx]
    );

    // idx로 검색한 결과가 없는 경우 (회원이 존재하지 않는 경우), 서버 응답 코드 404 반환
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
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
 * /users/{idx}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user information by ID
 *     description: Updates the information of a user specified by their unique identifier (idx).
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user.
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 description: The updated email address of the user.
 *                 example: "janedoe@example.com"
 *               password:
 *                 type: string
 *                 description: The updated password for the user account.
 *                 example: "newpassword123"
 *               gender:
 *                 type: string
 *                 description: The updated gender of the user.
 *                 example: "female"
 *               phone_num:
 *                 type: string
 *                 description: The updated phone number of the user.
 *                 example: "010-5678-1234"
 *               address:
 *                 type: string
 *                 description: The updated address of the user.
 *                 example: "456 Elm St, Cityville"
 *     responses:
 *       200:
 *         description: User updated successfully.
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
 *                   example: "User updated successfully"
 *       404:
 *         description: User not found or no changes made.
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
 *                   example: "User not found or no changes made"
 *       500:
 *         description: Database update failed.
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
 *                   example: "Database update failed"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */

// id값으로 회원 정보 수정(PUT)
export async function PUT(
  // 유연성을 위해 any 타입 사용. 추후 NextRequest로 변경
  request: any,
  { params }: { params: { idx: string } }
) {
  const userIdx = params.idx;
  const body = await request.json(); // 요청된 데이터(json)

  try {
    // query타입을 명시적으로 ResultSetHeader로 지정 (구.OkPacket)
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE users SET name=?, email=?, password=?, gender=?, phone_num=?, address=?, modify_date = NOW() WHERE idx= ?",
      [
        body.name,
        body.email,
        body.password,
        body.gender,
        body.phone_num,
        body.address,
        userIdx,
      ]
    );

    // 변경된 데이터가 없거나 id와 일치하는 회원을 찾지 못했을 경우, 서버 응답코드 404 반환
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "User not found or no changes made" },
        { status: 404 }
      );
    }

    // 요청이 성공할 경우 서버 응답코드 200 반환
    return NextResponse.json(
      { success: true, message: "User updated successfully" },
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
 * /api/users/{idx}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Deactivate user account
 *     description: Deactivates a user account by setting the is_active field to 0. This effectively marks the account as inactive without physically deleting it from the database.
 *     parameters:
 *       - in: path
 *         name: idx
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier (idx) of the user to deactivate.
 *     responses:
 *       200:
 *         description: User account deactivated successfully.
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
 *                   example: "User account deleted successfully"
 *       404:
 *         description: User not found.
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
 *                   example: "User not found"
 *       500:
 *         description: Failed to deactivate user account.
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
 *                   example: "Failed to delete user account"
 *                 details:
 *                   type: string
 *                   example: "Error message describing the failure"
 */

// 회원 탈퇴 및 삭제(DELETE)
export async function DELETE(
  request: any,
  { params }: { params: { idx: string } }
) {
  const userIdx = params.idx;

  try {
    // SQL 쿼리로 is_active 필드를 0으로 업데이트
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE users SET is_active = 0 WHERE idx = ?",
      [userIdx]
    );

    // 업데이트된 행이 없는 경우, 즉 idx와 일치하는 유저가 없는 경우
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 성공적으로 처리된 경우 응답
    return NextResponse.json(
      { success: true, message: "User account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // 예외 발생 시 500 에러 응답
    if (error instanceof Error) {
      console.error("Failed to delete user account", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete user account",
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
}
