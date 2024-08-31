import pool from "../db";
import { User } from "./types";
import { ResultSetHeader } from "mysql2";

// 제품 정보를 데이터베이스에 삽입하고 생성된 id를 반환하는 함수
export async function insertUser(user: User): Promise<number> {
  const query = `INSERT INTO users(name, user_id, password, gender, email, phone_num, regist_date) VALUES (?,?,?,?,?,?,?)`;

  // ISO 8601 날짜 문자열을 MySQL DATETIME 형식으로 변환
  const regist_date = new Date().toISOString().slice(0, 19).replace("T", " ");

  const values = [
    user.name,
    user.user_id,
    user.password,
    user.gender,
    user.email,
    user.phone_num,
    regist_date,
  ];

  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId; // 생성된 id 값을 반환
}

// 제품과 관련된 모든 정보를 데이터베이스에 삽입하는 함수
export async function insertFullProduct(user: User) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    await insertUser(user);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
