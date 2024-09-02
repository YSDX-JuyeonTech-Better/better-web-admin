"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  price: number;
  image_link?: string;
  stock: number;
  category: string;
  description: string;
}

const Home: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [items, setItems] = useState<Item | null>(null); // 단일 객체

  const fetchItems = async () => {
    try {
      await axios
        .get(`/api/products/${itemId}`)
        .then((response) => {
          const item = response.data;
          if (item.image_link && item.image_link.startsWith("//")) {
            item.image_link = `https:${item.image_link}`;
            console.log(item.image_link);
          }
          setItems(item.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  useEffect(() => {
    if (itemId) {
      fetchItems(); // itemId가 있을 때만 데이터를 가져옴
    }
  }, [itemId]);

  return (
    <main className="container flex flex-col p-6 bg-gray-100 min-h-screen w-auto">
      <div className="bg-white shadow-md rounded-lg py-10 my-3 flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            상품 상세페이지
          </h2>
          {items && (
            <div className="gcontainer flex flex-col place-items-center">
              {/* 상품명 */}
              <div className="pb-4">
                <label className="block text-base font-bold text-gray-700 mb-3 text-left">
                  상품명:
                </label>
                <span className="block mt-1 w-96 border-b-2 text-center">
                  {items.name}
                </span>
              </div>

              {/* 가격 */}
              <div className="pb-4">
                <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                  가격:
                </label>
                <span className="block mt-1 w-96 border-b-2 text-center">
                  {items.price}
                </span>
              </div>

              {/* 재고 */}
              <div className="pb-4">
                <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                  재고:
                </label>
                <span className="block mt-1 w-96 border-b-2 text-center">
                  {items.stock}
                </span>
              </div>

              {/* 카테고리 */}
              <div className="pb-4">
                <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                  카테고리:
                </label>
                <span className="block mt-1 w-96 border-b-2 text-center">
                  {items.category}
                </span>
              </div>

              {/* 상품 설명 */}
              <div className="md:col-span-2">
                <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                  상품 설명:
                </label>
                <textarea
                  className="mt-1 block w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={4}
                  value={items.description}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        {/* 이미지 영역 */}
        <div className="lg:w-1/2 flex items-center justify-center p-6">
          {items && items.image_link && (
            <Image
              src={items.image_link}
              alt="Product Image"
              width={200}
              height={200}
              className="object-cover rounded-lg"
            />
          )}
        </div>
      </div>

      {/* 목록 버튼 */}
      <div className="mt-6 text-center">
        <a
          href="/item/list"
          className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          목록
        </a>
      </div>
    </main>
  );
};

export default Home;
