"use client";

// pages/dashboard.tsx

import BarChart from "@/components/Barchart";
import DoughnutChart from "@/components/DoughnutChart";
import React from "react";

const Home: React.FC = () => {
  // 일매출현황 데이터
  const barChartData = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    datasets: [
      {
        label: "매출",
        data: [500, 700, 1000, 1200, 900, 1400],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 카테고리별 판매순위 데이터
  const categoryDoughnutData = {
    labels: ["Electronics", "Books", "Clothing"],
    datasets: [
      {
        label: "판매량",
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // 태그별 판매순위 데이터
  const tagDoughnutData = {
    labels: ["Sale", "New", "Popular"],
    datasets: [
      {
        label: "판매량",
        data: [150, 200, 100],
        backgroundColor: ["#4BC0C0", "#FF9F40", "#FFCD56"],
        hoverBackgroundColor: ["#4BC0C0", "#FF9F40", "#FFCD56"],
      },
    ],
  };

  return (
    <main>
      <div className="container  px-4 py-8">
        <div className="text-2xl font-bold mb-6">Dashboard</div>

        {/* Top section: Graphs */}
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

        {/* Bottom section: Recent Orders Table */}
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
              <tr>
                <td className="py-2 px-4 border-b">001</td>
                <td className="py-2 px-4 border-b">John Doe</td>
                <td className="py-2 px-4 border-b">Product A</td>
                <td className="py-2 px-4 border-b">2</td>
                <td className="py-2 px-4 border-b">$20.00</td>
                <td className="py-2 px-4 border-b">2024-08-10</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Home;
