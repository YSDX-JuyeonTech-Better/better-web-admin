"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Order {
  user_id: string;
  user_name: string;
  phone_num: string;
  order_id: number;
  order_date: string;
  product_name: string;
  brand: string;
  quantity: number;
  price: number;
  total_price: number;
  total_amount: number;
}

const Home: React.FC = () => {
  const order_id = useParams<{ order_id: string }>();
  const [order, setOrder] = useState<Order | null>(null); // 단일 객체

  const fetchOrders = async () => {
    try {
      const orderId = order_id.orderId;
      const response = await axios.get(`/api/orders/${orderId}`);

      const orderData = response.data.data[0]; // 서버 응답 데이터 배열에서 첫 번째 항목을 가져옴
      console.log(orderData);
      setOrder(orderData); // 단일 주문 데이터를 상태로 설정
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (order_id) {
      console.log("order_id:", order_id);
      fetchOrders(); // order_id가 있을 때만 데이터를 가져옴
    }
  }, [order_id]);

  return (
    <main className="flex container flex-col mx-8 ">
      <div className="bg-white p-6 shadow-md w-full">
        <h1 className="text-xl font-bold mb-4">주문 상세 정보</h1>

        {/* 주문 정보 */}
        {order && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">
                  주문 고객:
                </label>
                <span className="block mt-1">{order.user_name}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  아이디:
                </label>
                <span className="block mt-1">{order.user_id}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  휴대폰 번호:
                </label>
                <span className="block mt-1">{order.phone_num}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  주문 번호:
                </label>
                <span className="block mt-1">{order.order_id}</span>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  주문 일시:
                </label>
                <span className="block mt-1">
                  {new Date(order.order_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 구매 목록 */}
        {order && (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold px-3">{order.product_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{order.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{order.total_price.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
