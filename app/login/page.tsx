"use client";

import Image from "next/image";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Better 이미지 영역 */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-16 flex items-center justify-center rounded-md">
            <Image
              src="/logo_lg.png"
              alt="logo"
              width={200}
              height={200}
              className="object-cover rounded-lg"
            />
            <span className="text-transparent">Better</span>
          </div>
        </div>

        {/* ID 입력 필드 */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            ID
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your ID"
          />
        </div>

        {/* Password 입력 필드 */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>

        {/* 로그인 버튼 */}
        <div className="flex items-center justify-between">
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
