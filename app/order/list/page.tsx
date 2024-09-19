"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE: number = 5; // 페이지당 출력할 항목 수
const PAGES_PER_GROUP: number = 5; // 그룹당 페이지 수

interface orderProps {
  order_id: number;
  order_date: string;
  buyer_name: string;
  total_amount: number;
  point: number;
}

const Home = () => {
  const [start_date, setStart_Date] = useState("");
  const [end_date, setEnd_Date] = useState("");
  const [order_id, setOrder_Id] = useState("");
  const [name, setName] = useState("");
  const [min_amount, setMin_Amount] = useState("");
  const [max_amount, setMax_Amount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<orderProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // 주문 목록을 서버에서 가져오는 함수
  const fetchOrders = async (page_no: number) => {
    try {
      const params: any = {
        page: page_no,
        pageSize: ITEMS_PER_PAGE,
      };

      if (order_id) params.order_id = order_id;
      if (name) params.name = name;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      if (min_amount) params.min_amount = min_amount;
      if (max_amount) params.max_amount = max_amount;

      const response = await axios.get("/api/orders", { params });
      const orderData = response.data;

      setOrders(orderData.data);
      const totalPage = Math.ceil(orderData.total / ITEMS_PER_PAGE);
      setTotalPages(totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 필터 적용 후 1페이지로 리셋하여 데이터 가져오기
  const handleFilter = () => {
    setCurrentPage(1); // 필터 적용 시 1페이지로 리셋
    fetchOrders(1);
  };

  const handlePageClick = (pageNo: number) => {
    setCurrentPage(pageNo);
    fetchOrders(pageNo);
  };

  const handleGroupNavigation = (direction: "prev" | "next") => {
    let newGroupStartPage =
      direction === "prev"
        ? startPage - PAGES_PER_GROUP
        : startPage + PAGES_PER_GROUP;
    newGroupStartPage = Math.max(newGroupStartPage, 1);
    const newPage = newGroupStartPage;

    setCurrentPage(newPage);
    fetchOrders(newPage);
  };

  return (
    <main className="flex container mx-auto">
      <div>
        {/* 필터링 섹션 */}
        <div className="bg-gray-100 p-4 mt-24 mb-4 shadow-md mx-auto flex">
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문자명:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문금액:</label>
            <input
              type="number"
              className="mt-1 block w-full"
              value={min_amount}
              onChange={(e) => setMin_Amount(e.target.value)}
            />
            ~
            <input
              type="number"
              className="mt-1 block w-full"
              value={max_amount}
              onChange={(e) => setMax_Amount(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문일:</label>
            <input
              type="date"
              className="mt-1 block w-full"
              value={start_date}
              onChange={(e) => setStart_Date(e.target.value)}
            />
            ~
            <input
              type="date"
              className="mt-1 block w-full"
              value={end_date}
              onChange={(e) => setEnd_Date(e.target.value)}
            />
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 mx-6 text-sm bg-gray-700 text-white py-2 px-4 rounded-lg block hover:bg-gray-600 border-2 h-11"
          >
            검색
          </button>
        </div>

        {/* 주문 목록 출력 */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문자명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구매금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                포인트
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders &&
              orders.map((order: orderProps) => {
                // 1. order_date를 Date 객체로 변환
                const orderDate = new Date(order.order_date);

                // 2. 9시간을 추가 (KST를 고려한 시간)
                orderDate.setHours(orderDate.getHours() + 9);

                // 3. 년-월-일 형식으로 변환
                const year = orderDate.getFullYear();
                const month = String(orderDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
                const day = String(orderDate.getDate()).padStart(2, "0");

                // 4. YYYY-MM-DD 포맷으로 변환
                const formattedDate = `${year}-${month}-${day}`;

                return (
                  <tr key={order.order_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 hover:text-blue-900">
                        <Link href={`/order/detail/${order.order_id}`}>
                          {order.order_id}
                        </Link>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.buyer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₩{order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Math.floor(order.total_amount * 0.02).toLocaleString()}p
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
            onClick={() => handleGroupNavigation("prev")}
            disabled={startPage === 1}
          >
            이전
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
              key={startPage + index}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === startPage + index
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handlePageClick(startPage + index)}
            >
              {startPage + index}
            </button>
          ))}
          <button
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
            onClick={() => handleGroupNavigation("next")}
            disabled={endPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
