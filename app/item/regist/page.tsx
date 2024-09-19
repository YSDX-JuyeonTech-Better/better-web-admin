"use client";
import React, { useState } from "react";
import axios from "axios";

const Home: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [colorName, setColorName] = useState("");
  const [stock, setStock] = useState(0);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const currentTime = new Date().toISOString(); // 현재 시간 ISO 형식
    const data = {
      name: productName,
      brand: brand,
      price: price,
      category: category,
      description: description,
      image_link: imageLink,
      stock: stock,
      status: status,
      created_at: currentTime,
      updated_at: currentTime,
      product_colors: [
        {
          hex_value: null, // hex_value가 null이라고 가정
          color_name: colorName,
        },
      ],
    };

    // 서버에 보내기 전에 콘솔에 출력
    console.log("서버로 전송할 데이터 스키마:", data);

    try {
      const response = await axios.post("/api/products", data);
      if (response.status === 200 || response.status === 201) {
        alert("상품이 성공적으로 등록되었습니다.");
      } else {
        alert("상품 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error registering product:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="container flex flex-col p-6 bg-gray-100 min-h-screen w-auto">
      {/* 상품 입력 섹션 */}
      <div className="bg-white shadow-md rounded-lg py-10 my-3 flex flex-col lg:flex-row justify-between">
        {/* 왼쪽 영역: 나머지 입력 칸 */}
        <div className="lg:w-1/2 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            상품 정보 입력
          </h2>
          <div className="gcontainer flex flex-col place-items-center">
            {/* 상품명 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-3 text-left">
                상품명
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="상품명을 입력하세요"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* 브랜드 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-3 text-left">
                브랜드
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="브랜드명을 입력하세요"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            {/* 가격 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                가격
              </label>
              <input
                type="number"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="가격을 입력하세요"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            {/* 색상 */}
            {/* 색상 이름 입력란 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                색상 이름
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="색상 이름을 입력하세요"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
            </div>

            {/* 재고 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                재고
              </label>
              <input
                type="number"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="재고 수량을 입력하세요"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            {/* 태그 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                태그
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="태그를 입력하세요"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* 카테고리 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                카테고리
              </label>
              <select
                className="mt-1 block w-96 border-b-2 text-center"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="Blush">Blush</option>
                <option value="Bronzer">Bronzer</option>
                <option value="Eyebrow">Eyebrow</option>
                <option value="Eyeliner">Eyeliner</option>
                <option value="Eyeshadow">Eyeshadow</option>
                <option value="Foundation">Foundation</option>
                <option value="Lip liner">Lip liner</option>
                <option value="Lipstick">Lipstick</option>
                <option value="Mascara">Mascara</option>
                <option value="Nail polish">Nail polish</option>
              </select>
            </div>

            {/* 상태 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                상태
              </label>
              <select
                className="mt-1 block w-96 border-b-2 text-center"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">상태를 선택하세요</option>
                <option value="available">판매중</option>
                <option value="out_of_stock">재고없음</option>
                <option value="discount">할인</option>
              </select>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역: 이미지 경로 및 상품 설명 */}
        <div className="lg:w-1/2 p-6">
          <div className="gcontainer flex flex-col place-items-center">
            {/* 이미지 경로 */}
            <div className="pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                이미지 경로
              </label>
              <input
                type="text"
                className="mt-1 block w-96 border-b-2 text-center"
                placeholder="이미지 경로를 입력하세요"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
              />
            </div>

            {/* 상품 설명 */}
            <div className="md:col-span-2 pb-4">
              <label className="block text-base font-bold text-gray-700 mb-1 text-left">
                상품 설명
              </label>
              <textarea
                className="mt-1 block w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={9}
                placeholder="상품 설명을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 이미지 미리보기 */}
            {imageLink && (
              <div className="flex justify-center">
                <img
                  src={imageLink}
                  alt="Product Image"
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="mt-6 text-center">
        <button
          className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>
    </main>
  );
};

export default Home;
