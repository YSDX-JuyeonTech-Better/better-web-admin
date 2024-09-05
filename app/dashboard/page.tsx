"use client";

import axios from "axios";
import BarChart from "@/components/Barchart";
import DoughnutChart from "@/components/DoughnutChart";
import React, { useEffect, useState } from "react";

// 인터페이스 정의
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  date: string;
}

const COMPONENT: number = 5; // 페이지당 출력할 항목 수

const Dashboard: React.FC = () => {
  const [barChartData, setBarChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [categoryDoughnutData, setCategoryDoughnutData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [tagDoughnutData, setTagDoughnutData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 월매출현황 데이터 가져오기
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get("/api/dashboard/sales-by-category", {
          params: { Size: COMPONENT },
        });
        const data = response.data;

        setBarChartData({
          labels: data.months,
          datasets: [
            {
              label: "매출",
              data: data.sales,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              hoverBackgroundColor: ["rgba(75, 192, 192, 0.4)"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    // 카테고리별 판매순위 데이터 가져오기
    const fetchCategoryDoughnutData = async () => {
      try {
        const response = await axios.get("/api/dashboard/sales-by-category", {
          params: { Size: COMPONENT },
        });
        const data = response.data;

        setCategoryDoughnutData({
          labels: data.categories,
          datasets: [
            {
              label: "판매량",
              data: data.sales,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching category sales data:", error);
      }
    };

    // 태그별 판매순위 데이터 가져오기
    const fetchTagDoughnutData = async () => {
      try {
        const response = await axios.get("/api/dashboard/sales-by-tag", {
          params: { Size: COMPONENT },
        });
        const data = response.data;

        setTagDoughnutData({
          labels: data.tags,
          datasets: [
            {
              label: "판매량",
              data: data.sales,
              backgroundColor: [
                "#4BC0C0",
                "#FF9F40",
                "#FFCD56",
                "#36A2EB",
                "#FF6384",
              ],
              hoverBackgroundColor: [
                "#4BC0C0",
                "#FF9F40",
                "#FFCD56",
                "#36A2EB",
                "#FF6384",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching tag sales data:", error);
      }
    };

    // 최근 주문 목록 데이터 가져오기
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          params: { pageSize: COMPONENT },
        });
        const data = response.data;

        setRecentOrders(data.orders);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    fetchBarChartData();
    fetchCategoryDoughnutData();
    fetchTagDoughnutData();
    fetchRecentOrders();
  }, []);

  return (
    <main>
      <div className="container px-4 py-8">
        <div className="text-2xl font-bold mb-6">Dashboard</div>

        {/* 상단 섹션: 그래프 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">일매출현황</h2>
            <div className="h-48">
              <BarChart data={barChartData} />
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">카테고리별 판매순위</h2>
            <div className="h-48">
              <DoughnutChart data={categoryDoughnutData} />
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">태그별 판매순위</h2>
            <div className="h-48">
              <DoughnutChart data={tagDoughnutData} />
            </div>
          </div>
        </div>

        {/* 하단 섹션: 최근 주문 목록 테이블 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">최근 주문 목록</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">주문 번호</th>
                <th className="py-2 px-4 border-b">고객명</th>
                <th className="py-2 px-4 border-b">상품명</th>
                <th className="py-2 px-4 border-b">수량</th>
                <th className="py-2 px-4 border-b">가격</th>
                <th className="py-2 px-4 border-b">날짜</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: Order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b">{order.orderNumber}</td>
                  <td className="py-2 px-4 border-b">{order.customerName}</td>
                  <td className="py-2 px-4 border-b">{order.productName}</td>
                  <td className="py-2 px-4 border-b">{order.quantity}</td>
                  <td className="py-2 px-4 border-b">{order.price}</td>
                  <td className="py-2 px-4 border-b">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
