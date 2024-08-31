"use client";
import React from "react";

const Home: React.FC = () => {
  return (
    <main className="container flex flex-col p-6 bg-gray-100 min-h-screen w-auto">
      {/* 상품 정보 입력 섹션 */}
      <div className="bg-white shadow-md rounded-lg py-10 my-3">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          상품 상세페이지
        </h2>
        <div className="gcontainer flex flex-col place-items-center">
          {/* grid grid-cols-2 gap-4 */}
          {/* lg:grid grid-cols-1 md:grid-cols-2 gap-6 */}
          {/* grid grid-cols-1 */}
          {/* 상품명 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-3 text-left">
              상품명:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">
              홍길동
            </span>
          </div>

          {/* 가격 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-1 text-left">
              가격:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">
              30,000
            </span>
          </div>

          {/* 색상 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-1 text-left">
              색상:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">멋진</span>
          </div>

          {/* 재고 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-1 text-left">
              재고:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">12</span>
          </div>

          {/* 태그 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-1 text-left">
              태그:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">비건</span>
          </div>

          {/* 카테고리 */}
          <div className="pb-4">
            <label className="block text-base font-bold text-gray-700 mb-1 text-left">
              카테고리:
            </label>
            <span className="block mt-1 w-96 border-b-2 text-center">
              블러셔
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
              placeholder="상품 설명을 입력하세요"
            ></textarea>
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
      </div>
    </main>
  );
};

export default Home;
