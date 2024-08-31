"use client";
import React, { useState } from "react";

// 가짜 데이터 생성
const fakeOrders = Array.from({ length: 36 }, (_, index) => ({
  no: index + 1,
  orderState: index % 3 === 0 ? "주문" : index % 3 === 1 ? "반품" : "주문",
  date: "2024-08-12 12:34:56",
  orderNum: `ODR1234567${index + 1}`,
  product_Info: "아름다운",
  userId: `P1234567${index + 1}`,
  orderPrice: `₩${(index + 2.3) * 1000}`,
  signState:
    index % 3 === 0 ? "결재완료" : index % 3 === 1 ? "결재중" : "결재완료",
  deliverState:
    index % 4 === 0
      ? "주문확인"
      : index % 4 === 1
        ? "배송준비중"
        : index % 4 === 2
          ? "배송중"
          : "배송완료",
}));

const ITEMS_PER_PAGE = 5; // 페이지당 출력할 항목 수

const Home = () => {
  const [orderType, setOrderType] = useState("");
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
    console.log("Filtering orders with:", { orderType, startDate, endDate });
  };

  return (
    <main className=" container px-9 block">
      <span className="pt-3 text-lg font-semibold px-3 pb-4 flex">
        전체주문목록
      </span>

      <div>
        {/* 주문일 등 상세검색 */}
        <div className="bg-gray-100 p-4 mb-4 shadow-md  mx-auto flex">
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문유형:</label>
            <select
              className="mt-1 block w-full"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="order">주문</option>
              <option value="return">반품</option>
              <option value="cancel">취소</option>
            </select>
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문일시:</label>
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
            className="mt-4 mx-6  text-sm bg-gray-700 text-white py-2 px-4 rounded-lg block hover:bg-gray-600 border-2 h-11"
          >
            필터 적용
          </button>
        </div>

        {/* 주문목록리스트출력 */}
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-300  ">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                번호
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문유형
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문일시
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문번호
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                상품정보
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문고객
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                결제금액
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                결재상태
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문 및 배송상태
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderState}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderNum}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.product_Info}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderPrice}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {order.signState}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.deliverState}
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
