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
  id: number;
  user_idx: number;
  total_amount: number;
  order_date: string;
}

const COMPONENT: number = 5; // 페이지당 출력할 항목 수

const Dashboard: React.FC = () => {
  const [barChart7Data, setBarChart7Data] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [categoryDoughnutData, setCategoryDoughnutData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [totalBarChartData, setTotalBarChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 최근 7일간 매출액 데이터 가져오기
    const fetchBarChart7Data = async () => {
      try {
        const response = await axios.get("/api/dashboard/recent-sales");
        const data = response.data.data;

        // 날짜 및 매출 데이터 매핑
        setBarChart7Data({
          labels: data.map((item: any) => {
            // 1. recent_date를 Date 객체로 변환
            const date = new Date(item.recent_date);

            // 2. 9시간을 추가 (KST를 고려한 시간)
            date.setHours(date.getHours() + 9);

            // 3. 년-월-일 형식으로 변환
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
            const day = String(date.getDate()).padStart(2, "0");

            // 4. YYYY-MM-DD 포맷으로 반환
            return `${year}-${month}-${day}`;
          }),
          datasets: [
            {
              label: "매출",
              data: data.map((item: any) => Number(item.total_sales)), // 매출 추출
              backgroundColor: Array(data.length).fill(
                "rgba(75, 192, 192, 0.2)"
              ),
              borderColor: Array(data.length).fill("rgba(75, 192, 192, 1)"),
              hoverBackgroundColor: Array(data.length).fill(
                "rgba(75, 192, 192, 0.4)"
              ),
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
        const response = await axios.get(
          "/api/dashboard/total-sales-by-category"
        );
        const data = response.data.data;

        // 카테고리 및 매출 데이터 매핑
        setCategoryDoughnutData({
          labels: data.map((item: any) => item.category), // 카테고리명 추출
          datasets: [
            {
              label: "판매량",
              data: data.map((item: any) => Number(item.total_sales)), // 카테고리별 매출 추출
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

    // 총 매출액 데이터 가져오기
    const fetchTotalBarChartData = async () => {
      try {
        const response = await axios.get("/api/dashboard/total-sales");
        const data = response.data;

        // 총 매출 데이터가 하나일 경우
        setTotalBarChartData({
          labels: ["총 매출"], // 단일 데이터에 맞게 라벨 설정
          datasets: [
            {
              label: "총 매출",
              data: [Number(data.totalSales)], // 매출 값을 배열로 변환하여 제공
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              hoverBackgroundColor: ["rgba(75, 192, 192, 0.4)"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching total sales data:", error);
      }
    };
    // 최근 주문 목록 데이터 가져오기
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get("/api/dashboard/recent-orders");
        const data = response.data.data;
        console.log(data);
        setRecentOrders(data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    fetchBarChart7Data();
    fetchCategoryDoughnutData();
    fetchTotalBarChartData();
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
              <BarChart data={barChart7Data} />
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">카테고리별 판매순위</h2>
            <div className="h-48">
              <DoughnutChart data={categoryDoughnutData} />
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">총 매출액</h2>
            <div className="h-48">
              <BarChart data={totalBarChartData} />
            </div>
          </div>
        </div>

        {/* 하단 섹션: 최근 주문 목록 테이블 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">최근 주문 목록</h2>

          {/* 테이블을 감싸는 div에 스크롤 추가 */}
          <div className="overflow-y-auto max-h-80">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">주문 번호</th>
                  <th className="py-2 px-4 border-b">고객 ID</th>
                  <th className="py-2 px-4 border-b">가격</th>
                  <th className="py-2 px-4 border-b">날짜</th>
                </tr>
              </thead>
              <tbody>
                {/* 여러 개의 주문 데이터를 map()을 사용해 출력 */}
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: Order) => (
                    <tr key={order.id}>
                      <td className="py-2 px-4 border-b">{order.id}</td>
                      <td className="py-2 px-4 border-b">{order.user_idx}</td>
                      <td className="py-2 px-4 border-b">
                        {(order.total_amount || 20000).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(order.order_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      주문 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
