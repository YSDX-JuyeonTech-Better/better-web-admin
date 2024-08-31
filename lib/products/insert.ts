import pool from "../db";
import { Product, ProductColor } from "./types";
import { ResultSetHeader } from "mysql2";

// 제품 정보를 데이터베이스에 삽입하고 생성된 id를 반환하는 함수
export async function insertProduct(product: Product): Promise<number> {
  const query = `
    INSERT INTO products (name, brand, price, category, description, image_link, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // ISO 8601 날짜 문자열을 MySQL DATETIME 형식으로 변환
  const createdAt = new Date(product.created_at)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const updatedAt = new Date(product.updated_at)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const values = [
    product.name,
    product.brand,
    product.price,
    product.category,
    product.description,
    product.image_link,
    createdAt,
    updatedAt,
  ];

  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId; // 생성된 id 값을 반환
}

// 제품 색상 정보를 데이터베이스에 삽입하는 함수
export async function insertProductColors(
  productId: number,
  colors: ProductColor[]
) {
  const query = `
    INSERT INTO product_colors (product_id, hex_value, color_name)
    VALUES (?, ?, ?)
  `;

  for (const color of colors) {
    await pool.query(query, [productId, color.hex_value, color.color_name]);
  }
}

// 제품과 관련된 모든 정보를 데이터베이스에 삽입하는 함수
export async function insertFullProduct(product: Product) {
  const connection = await pool.getConnection();

  await connection.beginTransaction();

  // 1. 제품 정보 삽입 및 생성된 id 값 가져오기
  const productId = await insertProduct(product);
  console.log("Generated Product ID:", productId);

  try {
    // 2. 색상 정보 삽입
    if (product.product_colors && product.product_colors.length > 0) {
      console.log("Inserting product colors for Product ID:", productId);
      await insertProductColors(productId, product.product_colors); // 수정된 부분
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
