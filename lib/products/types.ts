// 제품 타입과 색상을 정의하는 코드

// 제품 색상 타입 정의
export interface ProductColor {
  hex_value: string;
  color_name: string;
}

// 제품 타입 정의
export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  description: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  image_link: string;
  product_colors?: ProductColor[];
  stock: number;
}
