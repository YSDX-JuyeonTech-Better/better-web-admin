"use client";
import React, { useState } from "react";

// 가짜 데이터 생성
const fakeOrders = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  date: "2024-08-08 12:34:56",
  userName: `회원 ${index + 1}`,
  userId: `P1234567${index + 1}`,
  level: index % 3 === 0 ? "4" : index % 3 === 1 ? "3" : "1",
  amount: `₩${(index + 1) * 1000}`,
  point: `₩${(index + 1) * 10}`,
  mail: index % 3 === 0 ? "수신" : index % 3 === 1 ? "거부" : "수신",
}));

const ITEMS_PER_PAGE = 5; // 페이지당 출력할 항목 수

const Home = () => {
  const [levelType, setLevelType] = useState("");
  const [mailType, setMailType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilter = () => {
    // 필터링 로직을 추가하세요
    console.log("Filtering orders with:", { levelType, startDate, endDate });
  };

  // 현재 페이지에 표시할 항목들
  const currentOrders = fakeOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 페이지 수 계산
  const totalPages = Math.ceil(fakeOrders.length / ITEMS_PER_PAGE);

  return (
    <main className="flex container mx-auto">
      <div>
        {/* 주문일 등 상세검색 */}
        <div className="bg-white p-4 mb-4 shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">회원등급:</label>
            <select
              className="mt-1 block w-full"
              value={levelType}
              onChange={(e) => setLevelType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">가입일:</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="mt-1 block w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="mt-2">~</span>
              <input
                type="date"
                className="mt-1 block w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            className="mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            필터 적용
          </button>
          <div className="mb-4">
            <label className="block text-gray-700">메일수신:</label>
            <select
              className="mt-1 block w-full"
              value={mailType}
              onChange={(e) => setMailType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="accept">수신</option>
              <option value="reject">거부</option>
            </select>
          </div>
        </div>

        {/* 주문목록리스트출력 */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아이디
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원등급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구매금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                포인트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                메일수신여부
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href="/user/detail"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {order.id}
                  </a>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.level}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.point}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.mail}</td>
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
