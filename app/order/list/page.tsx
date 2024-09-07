"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE: number = 5; // 페이지당 출력할 항목 수
const PAGES_PER_GROUP: number = 5; // 그룹당 페이지 수

interface userProps {
  no: number;
  date: string;
  userName: string;
  userId: string;
  admin: string;
  amount: number;
  point: number;
  state: string;
}

const Home = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [adminType, setAdminType] = useState("");
  const [statusType, setStatusType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // URL에 필터와 페이지를 포함해 새로고침
  const fetchUsers = async (page_no: number) => {
    try {
      const params: any = {
        page: page_no,
        pageSize: ITEMS_PER_PAGE,
      };

      if (userId) params.userId = userId;
      if (userName) params.userName = userName;
      if (adminType) params.adminType = adminType;
      if (statusType) params.statusType = statusType;

      const response = await axios.get("/api/users", { params });
      const user = response.data;
      setUsers(user.data);

      const totalPage = Math.ceil(user.total / ITEMS_PER_PAGE);
      setTotalPages(totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  // 페이지 클릭 시 URL 변경
  const handlePageClick = (pageNo: number) => {
    setCurrentPage(pageNo);
    fetchUsers(pageNo);
  };

  const handleGroupNavigation = (direction: "prev" | "next") => {
    let newGroupStartPage =
      direction === "prev"
        ? startPage - PAGES_PER_GROUP
        : startPage + PAGES_PER_GROUP;
    newGroupStartPage = Math.max(newGroupStartPage, 1);
    const newPage = newGroupStartPage;

    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };

  return (
    <main className="flex container mx-auto">
      <div>
        {/* 필터링 섹션 */}
        <div className="bg-gray-100 p-4 mt-24 mb-4 shadow-md mx-auto flex">
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">아이디:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">이름:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">관리자:</label>
            <select
              className="mt-1 block w-full mx-6"
              value={adminType}
              onChange={(e) => setAdminType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="일반">일반</option>
              <option value="관리자">관리자</option>
            </select>
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">상태:</label>
            <select
              className="mt-1 block w-full"
              value={statusType}
              onChange={(e) => setStatusType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
            </select>
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 mx-6 text-sm bg-gray-700 text-white py-2 px-4 rounded-lg block hover:bg-gray-600 border-2 h-11"
          >
            검색
          </button>
        </div>

        {/* 유저 목록 출력 */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아이디
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구매금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                포인트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users &&
              users.map((user: userProps) => (
                <tr key={user.no}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-600 hover:text-blue-900">
                      <Link href={`/user/detail/${user.no}`}>{user.no}</Link>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{user.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.admin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.point}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.state}</td>
                </tr>
              ))}
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
