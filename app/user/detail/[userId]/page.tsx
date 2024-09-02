"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";

interface User {
  userName: string;
  userId: string;
  userEmail: string;
  phoneNum: string;
  address: string;
  date: string;
  amount: number;
  point: number;
}

const Home: React.FC = () => {
  const { userNo } = useParams<{ userNo: string }>();
  const [users, setUsers] = useState<User | null>(null); // 단일 객체

  const fetchItems = async () => {
    try {
      await axios
        .get(`/api/users/${userNo}`)
        .then((response) => {
          const user = response.data;

          setUsers(user.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  useEffect(() => {
    if (userNo) {
      fetchItems(); // itemId가 있을 때만 데이터를 가져옴
    }
  }, [userNo]);
  return (
    <main className=" container px-9 block">
      <span className="pt-3 text-lg font-semibold px-3 pb-4 flex">
        회원상세페이지
      </span>
      {/* User Information Table */}
      <div className="w-full bg-gray-50 text-gray-800 py-3 px-6 ">
        <h2 className="text-lg font-semibold mb-4">가입 정보</h2>
        {users && (
          <table className="min-w-full bg-white border">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">이름</td>
                <td className="py-2 px-4 border-b">{users.userName}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">아이디</td>
                <td className="py-2 px-4 border-b">{users.userId}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">이메일</td>
                <td className="py-2 px-4 border-b">{users.userEmail}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">휴대폰번호</td>
                <td className="py-2 px-4 border-b">{users.phoneNum}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">주소</td>
                <td className="py-2 px-4 border-b">{users.address}</td>
              </tr>
              {/* Add more rows as necessary */}
            </tbody>
          </table>
        )}
      </div>

      {/* User Information Table */}
      <div className="w-full bg-gray-50 text-gray-800 py-3 px-6">
        <h2 className="text-lg font-semibold mb-4">이용 정보</h2>
        <table className="min-w-full bg-white border">
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">이용약관</td>
              <td className="py-2 px-4 border-b">동의(2024-08-09 12:34:56)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">개인정보 처리방침</td>
              <td className="py-2 px-4 border-b">동의(2024-08-09 12:34:56)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">개인정보 제3자 제공</td>
              <td className="py-2 px-4 border-b">동의(2024-08-09 12:34:56)</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">마케팅 정보제공동의</td>
              <td className="py-2 px-4 border-b">동의(2024-08-09 12:34:56)</td>
            </tr>
            {/* Add more rows as necessary */}
          </tbody>
        </table>
      </div>

      {/* User Information Table */}

      <div className="w-full bg-gray-50 text-gray-800 py-3 px-6">
        <h2 className="text-lg font-semibold mb-4">이용 정보</h2>
        {users && (
          <table className="min-w-full bg-white border">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">가입일시</td>
                <td className="py-2 px-4 border-b">동의({users.date})</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">총 구매금액</td>
                <td className="py-2 px-4 border-b">{users.amount}</td>
              </tr>

              <tr>
                <td className="py-2 px-4 border-b">포인트</td>
                <td className="py-2 px-4 border-b">{users.point}</td>
              </tr>
              {/* Add more rows as necessary */}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Home;
