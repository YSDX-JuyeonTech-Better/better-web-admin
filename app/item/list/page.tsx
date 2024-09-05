"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE: number = 5; // 페이지당 출력할 항목 수
const PAGES_PER_GROUP: number = 5; // 그룹당 페이지 수

interface itemProps {
  id: number;
  brand?: string;
  description?: string;
  image_link: string;
  name: string;
  price: number;
  status?: string;
  product_colors?: string;
  stock?: number;
  category: string;
  created_at: string;
  updated_at: string;
}

const Home = () => {
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async (page_no: number) => {
    try {
      // 기본적으로 빈 필터 값을 제외하기 위해 조건적으로 params 설정
      const params: any = {
        page: page_no,
        pageSize: ITEMS_PER_PAGE,
      };

      // 빈 값이 아닌 필터 값만 params에 추가
      if (startPrice) params.startPrice = startPrice;
      if (endPrice) params.endPrice = endPrice;
      if (productName) params.productName = productName;
      if (brand) params.brand = brand;
      if (category) params.category = category;
      if (status) params.status = status;

      const response = await axios.get("/api/products", { params });
      const item = response.data;
      setItems(item.data);
      console.log(item.data);
      console.log(items.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems(1);

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/products");
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
    fetchItems(pageNo);
  };

  const handleGroupNavigation = (direction: "prev" | "next") => {
    let newGroupStartPage =
      direction === "prev"
        ? startPage - PAGES_PER_GROUP
        : startPage + PAGES_PER_GROUP;
    newGroupStartPage = Math.max(newGroupStartPage, 1);
    const newPage = newGroupStartPage;

    setCurrentPage(newPage);
    fetchItems(newPage);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchItems(1); // 필터링된 데이터를 1페이지부터 다시 가져옴
  };

  return (
    <main className="container flex mx-auto">
      <div className="w-full max-w-4xl">
        <div className="mt-6 text-right pb-7">
          <a
            href="/item/regist"
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            등록
          </a>
        </div>

        {/* 상품명 등 상세검색 */}
        <div className="bg-gray-100 p-4 my-4 shadow-md mx-auto flex w-full box-border">
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">상품가격:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="최소 가격"
                className="mt-1 block w-full"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
              />
              <span className="mt-2">~</span>
              <input
                type="number"
                placeholder="최대 가격"
                className="mt-1 block w-full"
                value={endPrice}
                onChange={(e) => setEndPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">상품명:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">브랜드:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">카테고리:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">상태:</label>
            <select
              className="mt-1 block w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">모든 상태</option>
              <option value="available">판매중</option>
              <option value="out_of_stock">재고없음</option>
              <option value="discount">할인</option>
            </select>
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 mx-6 text-sm bg-gray-700 text-white py-2 px-4 rounded-lg w-32 text-center flex items-center justify-center hover:bg-gray-600 border-2 h-11"
          >
            검색
          </button>
        </div>

        {/* 주문목록리스트출력 */}
        <table className="w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NO.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ maxWidth: "200px" }}
              >
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items &&
              items.map((item: itemProps) => {
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 hover:text-blue-900">
                        <Link href={`/item/detail/${item.id}`}>{item.id}</Link>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={`https:${item.image_link}`}
                        width={100}
                        height={100}
                        alt="img"
                      />
                    </td>
                    <td
                      className="px-6 py-4 overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ maxWidth: "200px" }}
                    >
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.product_colors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.created_at.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.updated_at.slice(0, 10)}
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
