import pool from "../db";
import { User } from "./types";
import { ResultSetHeader } from "mysql2";

// 제품 정보를 데이터베이스에 삽입하고 생성된 id를 반환하는 함수
export async function updateUser(
  name: string,
  user_id: string,
  password: string,
  gender: string,
  email: string,
  phone_num: string
): Promise<number> {
  const query = `
    update users set name=?, password=?, gender=?, email=?, phone_num=? where user_id=?`;

  const _updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  const values = [name, password, gender, email, phone_num, user_id];

  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId; // 생성된 id 값을 반환
}
