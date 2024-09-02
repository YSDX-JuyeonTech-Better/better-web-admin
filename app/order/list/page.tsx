"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 5; // 페이지당 출력할 항목 수
const PAGES_PER_GROUP = 5; // 그룹당 페이지 수

interface orderProps {
  no: number;
  date: string;
  orderNum: string;
  userId: string;
  orderPrice: number;
}

const Home = () => {
  const [orderType, setOrderType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page_no: number) => {
    try {
      const params = {
        page: page_no,
        pageSize: ITEMS_PER_PAGE,
        startDate,
        endDate,
        orderNum,
        userId,
      };
      const response = await axios.get("/api/orders", { params });
      const order = response.data;
      setOrders(order.data);
      console.log(order.data);
      console.log(order.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    const fetchData = async () => {
      try {
        const response = await axios.get("api/orders");
        const data = response.data;
        const totalPage = Math.ceil(data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

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

  const handleFilter = () => {
    setCurrentPage(1);
    fetchOrders(1); // 필터링된 데이터를 1페이지부터 다시 가져옴
  };

  return (
    <main className="flex container mx-auto">
      <div>
        {/* 주문일 등 상세검색 */}
        <div className="bg-gray-100 p-4  mt-24 mb-4 shadow-md mx-auto flex">
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

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문번호:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">주문고객:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 mx-6 text-sm bg-gray-700 text-white py-2 px-4 rounded-lg block hover:bg-gray-600 border-2 h-11"
          >
            검색
          </button>
        </div>

        {/* 주문목록리스트출력 */}
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                번호
              </th>

              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문일시
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문번호
              </th>

              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                주문고객
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                결제금액
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders &&
              orders.map((order: orderProps) => (
                <tr key={order.no}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 hover:text-blue-900">
                      <Link href={`/order/detail/${order.no}`}>{order.no}</Link>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.orderNum}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.orderPrice}
                  </td>
                </tr>
              ))}
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
              className={`px-4 py-2 mx-1 rounded ${currentPage === startPage + index ? "bg-gray-700 text-white" : "bg-gray-200"}`}
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
