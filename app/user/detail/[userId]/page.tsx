"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface User {
  idx: number;
  id: string;
  name: string;
  email: string;
  password: string;
  gender: string;
  phone_num: string;
  address: string;
  is_active: boolean;
  regist_date: string;
}

const Home: React.FC = () => {
  const idx = useParams<{ idx: any }>();
  const [users, setUsers] = useState<User | null>(null); // 단일 객체

  const fetchUsers = async () => {
    try {
      const numericIdx = Number(idx.userId);
      console.log(numericIdx);
      await axios
        .get(`/api/users/${numericIdx}`)
        .then((response) => {
          const user = response.data;
          console.log(user.data);
          setUsers(user.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // 9시간을 더한 후, YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateWithOffset = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9); // 9시간 더하기
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
  };

  useEffect(() => {
    if (idx) {
      console.log("order_id:", idx);
      fetchUsers(); // itemId가 있을 때만 데이터를 가져옴
    }
  }, [idx]);

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
                <td className="py-2 px-4 border-b">{users.name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">아이디</td>
                <td className="py-2 px-4 border-b">{users.id}</td>
              </tr>

              <tr>
                <td className="py-2 px-4 border-b">이메일</td>
                <td className="py-2 px-4 border-b">{users.email}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">휴대폰번호</td>
                <td className="py-2 px-4 border-b">{users.phone_num}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">주소</td>
                <td className="py-2 px-4 border-b">{users.address}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">성별</td>
                <td className="py-2 px-4 border-b">{users.gender}</td>
              </tr>
              {/* Add more rows as necessary */}
            </tbody>
          </table>
        )}
      </div>

      {/* User Information Table */}
      <div className="w-full bg-gray-50 text-gray-800 py-3 px-6">
        <h2 className="text-lg font-semibold mb-4">이용 정보</h2>
        {users && (
          <table className="min-w-full bg-white border">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">이용약관</td>
                <td className="py-2 px-4 border-b">
                  동의({formatDateWithOffset(users.regist_date)})
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">개인정보 처리방침</td>
                <td className="py-2 px-4 border-b">
                  동의({formatDateWithOffset(users.regist_date)})
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">개인정보 제3자 제공</td>
                <td className="py-2 px-4 border-b">
                  동의({formatDateWithOffset(users.regist_date)})
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">마케팅 정보제공동의</td>
                <td className="py-2 px-4 border-b">
                  동의({formatDateWithOffset(users.regist_date)})
                </td>
              </tr>
              {/* Add more rows as necessary */}
            </tbody>
          </table>
        )}
      </div>

      {/* User Information Table */}
      <div className="w-full bg-gray-50 text-gray-800 py-3 px-6">
        <h2 className="text-lg font-semibold mb-4">이용 정보</h2>
        {users && (
          <table className="min-w-full bg-white border">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">가입일시</td>
                <td className="py-2 px-4 border-b">
                  {formatDateWithOffset(users.regist_date)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">상태</td>
                <td className="py-2 px-4 border-b">
                  {users.is_active ? "활성" : "비활성"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Home;
