"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  brand: string;
  price: number;
  image_link?: string;
  stock: number;
  category: string;
  description: string;
  status: string;
}

const Home: React.FC = () => {
  const { itemId } = useParams(); // useParams로 itemId 구조 분해 할당
  const [items, setItems] = useState<Item | null>(null); // 단일 객체

  // 상품 정보를 가져오는 함수
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/products/${itemId}`);
        const item = response.data.data;
        setItems(item);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  // 상품 정보를 서버에 업데이트하는 함수
  const handleUpdate = async () => {
    try {
      await axios.put(`/api/products/${itemId}`, {
        name: items?.name,
        brand: items?.brand,
        price: items?.price,
        stock: items?.stock,
        category: items?.category,
        description: items?.description,
        image_link: items?.image_link,
        status: items?.status,
      });

      alert("상품이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("상품 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="container flex flex-col p-6 bg-gray-100 min-h-screen w-auto">
      {/* 상품 입력 섹션 */}
      <div className="bg-white shadow-md rounded-lg py-10 my-3 flex flex-col lg:flex-row justify-between">
        {/* 왼쪽 영역: 나머지 입력 칸 */}
        <div className="lg:w-1/2 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            상품 정보 수정
          </h2>
          <div className="gcontainer flex flex-col place-items-center">
            {/* 상품명 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-3 text-left">
                상품명
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="상품명을 입력하세요"
                value={items?.name || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            {/* 브랜드 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-3 text-left">
                브랜드
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="브랜드명을 입력하세요"
                value={items?.brand || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, brand: e.target.value } : null
                  )
                }
              />
            </div>

            {/* 가격 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                가격
              </label>
              <input
                type="number"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="가격을 입력하세요"
                value={items?.price || 0}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, price: Number(e.target.value) } : null
                  )
                }
              />
            </div>

            {/* 재고 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                재고
              </label>
              <input
                type="number"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="재고 수량을 입력하세요"
                value={items?.stock || 0}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, stock: Number(e.target.value) } : null
                  )
                }
              />
            </div>

            {/* 카테고리 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                카테고리
              </label>
              <select
                className="mt-1 block w-96 border-b-2 text-center"
                value={items?.category || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, category: e.target.value } : null
                  )
                }
              >
                <option value="Blush">Blush</option>
                <option value="Bronzer">Bronzer</option>
                <option value="Eyebrow">Eyebrow</option>
                <option value="Eyeliner">Eyeliner</option>
                <option value="Eyeshadow">Eyeshadow</option>
                <option value="Foundation">Foundation</option>
                <option value="Lip liner">Lip liner</option>
                <option value="Lipstick">Lipstick</option>
                <option value="Mascara">Mascara</option>
                <option value="Nail polish">Nail polish</option>
              </select>
            </div>

            {/* 상태 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                상태
              </label>
              <select
                className="mt-1 block w-96 border-b-2 text-center"
                value={items?.status || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
              >
                <option value="available">판매중</option>
                <option value="out_of_stock">재고없음</option>
                <option value="discount">할인</option>
              </select>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역: 이미지 경로 및 상품 설명 */}
        <div className="lg:w-1/2 p-6">
          <div className="gcontainer flex flex-col place-items-center">
            {/* 이미지 경로 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                이미지 경로
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="이미지 경로를 입력하세요"
                value={items?.image_link || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, image_link: e.target.value } : null
                  )
                }
              />
            </div>

            {/* 상품 설명 */}
            <div className="md:col-span-2 pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                상품 설명
              </label>
              <textarea
                className="mt-1 block w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={9}
                placeholder="상품 설명을 입력하세요"
                value={items?.description || ""}
                onChange={(e) =>
                  setItems((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 업데이트 버튼 */}
      <div className="mt-6 text-center">
        <button
          onClick={handleUpdate}
          className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          업데이트
        </button>
      </div>
    </main>
  );
};

export default Home;
