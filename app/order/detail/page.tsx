"use client";
import React, { useState } from "react";

const Home = () => {
  const [orderStatus, setOrderStatus] = useState("processing");

  return (
    <main className="flex container flex-col mx-8 ">
      <div className="bg-white p-6 shadow-md w-full">
        <h1 className="text-xl font-bold mb-4">주문 상세 정보</h1>

        {/* 주문 정보 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                주문 고객:
              </label>
              <span className="block mt-1">홍길동</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700">아이디:</label>
              <span className="block mt-1">user1234</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                휴대폰 번호:
              </label>
              <span className="block mt-1">010-1234-5678</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                주문 번호:
              </label>
              <span className="block mt-1">ORD12345678</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                주문 일시:
              </label>
              <span className="block mt-1">2024-08-08 12:34:56</span>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                택배 번호:
              </label>
              <span className="block mt-1">TBA987654321</span>
            </div>
          </div>
        </div>

        {/* 주문 및 배송 상태 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">주문 및 배송 상태</h2>
          <select
            className="mt-1 block w-96 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="processing">처리 중</option>
            <option value="shipped">배송 완료</option>
            <option value="delivered">배달 완료</option>
            <option value="cancelled">취소됨</option>
          </select>
        </div>

        {/* 구매 목록 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">구매 목록</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수량
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  합계
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">상품 A</td>
                <td className="px-6 py-4 whitespace-nowrap">2</td>
                <td className="px-6 py-4 whitespace-nowrap">₩10,000</td>
                <td className="px-6 py-4 whitespace-nowrap">₩20,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">상품 B</td>
                <td className="px-6 py-4 whitespace-nowrap">1</td>
                <td className="px-6 py-4 whitespace-nowrap">₩15,000</td>
                <td className="px-6 py-4 whitespace-nowrap">₩15,000</td>
              </tr>
              {/* 추가 구매 목록 항목을 여기에 추가하세요 */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Home;
