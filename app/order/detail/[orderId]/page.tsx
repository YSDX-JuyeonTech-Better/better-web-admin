"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";

interface Order {
  no: number;
  userName: string;
  userId: string;
  phoneNum: string;
  orderNum: string;
  date: string;
  orderList: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}
const Home: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const [orders, setOrders] = useState<Order | null>(null); // 단일 객체

  const fetchOrders = async () => {
    try {
      await axios
        .get(`/api/orders/${orderNo}`)
        .then((response) => {
          const order = response.data;

          setOrders(order.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  useEffect(() => {
    if (orderNo) {
      fetchOrders(); // itemId가 있을 때만 데이터를 가져옴
    }
  }, [orderNo]);

  return (
    <main className="flex container flex-col mx-8 ">
      <div className="bg-white p-6 shadow-md w-full">
        <h1 className="text-xl font-bold mb-4">주문 상세 정보</h1>

        {/* 주문 정보 */}
        {orders && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">
                  주문 고객:
                </label>
                <span className="block mt-1">{orders.userName}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  아이디:
                </label>
                <span className="block mt-1">{orders.userId}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  휴대폰 번호:
                </label>
                <span className="block mt-1">{orders.phoneNum}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  주문 번호:
                </label>
                <span className="block mt-1">{orders.orderNum}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  주문 일시:
                </label>
                <span className="block mt-1">{orders.date}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  택배 번호:
                </label>
                <span className="block mt-1">TBA987654321</span>
              </div>
            </div>
          </div>
        )}

        {/* 주문 및 배송 상태
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
        </div> */}

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
              {orders?.orderList.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold px-3">{item.productName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Home;
