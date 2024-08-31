import pool from "../db";
import { Product, ProductColor } from "./types";
import { ResultSetHeader } from "mysql2";

// 제품 정보를 데이터베이스에 삽입하고 생성된 id를 반환하는 함수
export async function updateProduct(
  id,
  name,
  brand,
  price,
  category,
  description,
  image_link,
  stock
): Promise<number> {
  const query = `
    update products set name=?, brand=?, price=?, category=?, description=?, image_link=?, updated_at=?, stock=? where id=?
  `;

  const _updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  const values = [
    name,
    brand,
    price,
    category,
    description,
    image_link,
    _updatedAt,
    stock,
    id,
  ];

  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId; // 생성된 id 값을 반환
}
