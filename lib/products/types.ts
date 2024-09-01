// 제품 색상 타입 정의
export interface ProductColor {
  hex_value: string;
  color_name: string;
}

// status 칼럼에 사용할 수 있는 값들을 타입으로 정의
export type ProductStatus = "available" | "out_of_stock" | "discontinued";

// 제품 타입 정의
export interface Product {
  id: number; // INT, PK, Auto Increment
  name: string; // VARCHAR(255)
  brand: string; // VARCHAR(255)
  price: number; // INT
  description: string; // TEXT
  category: string; // VARCHAR(255)
  image_link: string; // TEXT
  stock: number; // INT, 기본값 5
  status: ProductStatus; // ENUM('available', 'out_of_stock', 'discontinued'), 기본값 'available'
  created_at: Date; // DATETIME
  updated_at: Date; // DATETIME
  product_colors?: ProductColor[]; // 제품 색상들 (선택적)
}
