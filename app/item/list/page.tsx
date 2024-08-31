"use client";
import React, { useState } from "react";

// 가짜 데이터 생성
const fakeOrders = Array.from({ length: 36 }, (_, index) => ({
  no: index + 1,
  image: `IMG1234567${index + 1}`,
  name: `상품 ${index + 1}`,
  price: `₩${(index + 1) * 1000}`,
  product_colors: "아름다운",
  stock: index % 3 === 0 ? "34" : index % 3 === 1 ? "12" : "20",
  category: "멋진",
  tag_list: "비건",
  date1: "2024-08-08 12:34:56",
  date2: "2024-08-08 12:34:56",
}));

const ITEMS_PER_PAGE = 5; // 페이지당 출력할 항목 수

const Home = () => {
  const [levelType, setLevelType] = useState("");
  const [mailType, setMailType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 표시할 항목들
  const currentOrders = fakeOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 페이지 수 계산
  const totalPages = Math.ceil(fakeOrders.length / ITEMS_PER_PAGE);

  const handleFilter = () => {
    // 필터링 로직을 추가하세요
    console.log("Filtering orders with:", { levelType, startDate, endDate });
  };

  return (
    <main className="flex container mx-auto">
      <div>
        <div className="mt-6 text-right pb-7">
          <a
            href="/item/regist"
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            등록
          </a>
        </div>
        {/* 주문목록리스트출력 */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NO.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                색상
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수정일
              </th>
              <th
                colSpan={2}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.no}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href="/item/detail"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {order.no}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.image}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.product_colors}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.category}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">{order.date1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date2}</td>
                <td>
                  <a
                    href="/item/regist"
                    className="bg-gray-700 text-white py-2 px-4 mx-2 rounded-lg hover:bg-gray-600"
                  >
                    수정
                  </a>
                  <a
                    href="/item/regist"
                    className="bg-gray-700 text-white py-2 px-4  mx-2 rounded-lg hover:bg-gray-600"
                  >
                    삭제
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-gray-700 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
