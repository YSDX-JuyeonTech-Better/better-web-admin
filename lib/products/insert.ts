import pool from "../db";
import { Product, ProductColor } from "./types";
import { ResultSetHeader } from "mysql2";

/**
 * 기본 상품 정보를 `products` 테이블에 삽입하고, 생성된 제품 id를 반환하는 함수
 * @param product - 데이터베이스에 삽입할 제품 정보
 * @returns 삽입된 제품의 id
 */
export async function insertProduct(product: Product): Promise<number> {
  const query = `
  INSERT INTO products (name, brand, price, category, description, image_link, stock, status, created_at, updated_at)
  VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())
  `;

  const values = [
    product.name,
    product.brand,
    product.price,
    product.category,
    product.description,
    product.image_link,
    product.stock,
    product.status,
  ];

  // 쿼리를 실행하여 제품 정보를 삽입하고, 생성된 제품의 id를 반환
  const [result] = await pool.query<ResultSetHeader>(query, values);
  return result.insertId; // 삽입된 상품의 id값을 반환
}

/**
 * 주어진 상품 id와 연관된 색상 정보를 `product_colors` 테이블에 삽입하는 함수
 * @param productId - 색상 정보를 연결할 제품의 id
 * @param colors - 데이터베이스에 삽입할 색상 정보 배열
 */
export async function insertProductColors(
  productId: number,
  colors: ProductColor[]
) {
  const query = `
    INSERT INTO product_colors (product_id, hex_value, color_name)
    VALUES (?, ?, ?)
  `;

  // 각 색상 정보에 대해 반복적으로 데이터베이스에 삽입
  for (const color of colors) {
    await pool.query(query, [productId, color.hex_value, color.color_name]);
  }
}

/**
 * 제품 정보와 제품 id값에 연관된 색상 정보를 동시에 삽입하는 함수
 * 트랜잭션을 사용하여 모든 데이터가 성공적으로 삽입되었을 때만 커밋하며, 오류가 발생하면 롤백
 * @param product - 삽입할 제품 정보 및 연관된 색상 정보
 */
export async function insertFullProduct(product: Product) {
  const connection = await pool.getConnection(); // 데이터베이스와 연결

  try {
    await connection.beginTransaction(); // 트랜잭션 시작
    // 1. 제품 정보를 `products` 테이블에 삽입하고, 생성된 제품의 고유 ID를 가져옴
    const productId = await insertProduct(product);
    console.log("Generated Product ID:", productId);

    // 2. 색상 정보가 존재하는 경우 `product_colors` 테이블에 삽입
    if (product.product_colors && product.product_colors.length > 0) {
      console.log("Inserting product colors for Product ID:", productId);
      await insertProductColors(productId, product.product_colors);
    }

    await connection.commit(); // 모든 데이터가 성공적으로 삽입되었을 때 트랜잭션을 커밋
  } catch (error) {
    // 오류 발생 시
    await connection.rollback(); // 데이터 일관성 유지를 위한 트랜잭션 롤백
    throw error; // 오류 던져서 호출자에게 알림
  } finally {
    connection.release(); // 데이터베이스 연결 해제 및 리소스 반환
  }
}
