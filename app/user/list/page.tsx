"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE: number = 5; // 페이지당 출력할 항목 수
const PAGES_PER_GROUP: number = 5; // 그룹당 페이지 수

interface userProps {
  idx: number;
  name: string;
  id: string;
  gender: string;
  is_admin: string;
  is_active: string;
  regist_date: string;
}

const Home = () => {
  const [start_date, setStart_Date] = useState("");
  const [end_date, setEnd_Date] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [is_admin, setIs_Admin] = useState("");
  const [is_active, setIs_Active] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<userProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page_no: number) => {
    try {
      const params: any = {
        page: page_no,
        pageSize: ITEMS_PER_PAGE,
      };

      // 필터링 조건을 URL 파라미터에 추가
      if (id) params.id = id;
      if (name) params.name = name;
      if (gender) params.gender = gender;
      if (is_admin) params.is_admin = is_admin;
      if (is_active) params.is_active = is_active;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;

      const response = await axios.get("/api/users", { params });
      const user = response.data;

      setUsers(user.data); // 유저 목록을 상태로 설정
      const totalPage = Math.ceil(user.total / ITEMS_PER_PAGE);
      setTotalPages(totalPage); // 전체 페이지 수 계산
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(1); // 처음 페이지 로드 시 첫 번째 페이지의 데이터를 가져옴
  }, []);

  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const handlePageClick = (pageNo: number) => {
    setCurrentPage(pageNo);
    fetchUsers(pageNo); // 페이지 변경 시 데이터 다시 로드
  };

  const handleGroupNavigation = (direction: "prev" | "next") => {
    let newGroupStartPage =
      direction === "prev"
        ? startPage - PAGES_PER_GROUP
        : startPage + PAGES_PER_GROUP;
    newGroupStartPage = Math.max(newGroupStartPage, 1);
    const newPage = newGroupStartPage;

    setCurrentPage(newPage);
    fetchUsers(newPage); // 페이지 그룹 변경 시 데이터 로드
  };

  const handleFilter = () => {
    setCurrentPage(1); // 필터링 후 첫 번째 페이지로 이동
    fetchUsers(1); // 필터링된 데이터를 1페이지부터 다시 가져옴
  };

  return (
    <main className="flex container mx-auto">
      <div>
        {/* 이름 등 상세검색 */}
        <div className="bg-gray-100 p-4 mt-24 mb-4 shadow-md mx-auto flex">
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">아이디:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">이름:</label>
            <input
              type="text"
              className="mt-1 block w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">성별:</label>
            <select
              className="mt-1 block w-full mx-6"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">전체</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">가입일:</label>
            <input
              type="date"
              className="mt-1 block w-full"
              value={start_date}
              onChange={(e) => setStart_Date(e.target.value)}
            />
            ~
            <input
              type="date"
              className="mt-1 block w-full"
              value={end_date}
              onChange={(e) => setEnd_Date(e.target.value)}
            />
          </div>

          <div className="mb-4 mx-6">
            <label className="block text-gray-700">관리자:</label>
            <select
              className="mt-1 block w-full mx-6"
              value={is_admin}
              onChange={(e) => setIs_Admin(e.target.value)}
            >
              <option value="">전체</option>
              <option value="true">관리자</option>
              <option value="false">일반</option>
            </select>
          </div>
          <div className="mb-4 mx-6">
            <label className="block text-gray-700">상태:</label>
            <select
              className="mt-1 block w-full"
              value={is_active}
              onChange={(e) => setIs_Active(e.target.value)}
            >
              <option value="">전체</option>
              <option value="true">활성</option>
              <option value="false">비활성</option>
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
                성별
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user: userProps) => {
                // 1. regist_date를 Date 객체로 변환
                const registDate = new Date(user.regist_date);

                // 2. 9시간을 추가 (KST를 고려한 시간)
                registDate.setHours(registDate.getHours() + 9);

                // 3. 년-월-일 형식으로 변환
                const year = registDate.getFullYear();
                const month = String(registDate.getMonth() + 1).padStart(
                  2,
                  "0"
                ); // 월은 0부터 시작하므로 1을 더함
                const day = String(registDate.getDate()).padStart(2, "0");

                // 4. YYYY-MM-DD 포맷으로 변환
                const formattedDate = `${year}-${month}-${day}`;

                return (
                  <tr key={user.idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 hover:text-blue-900">
                        <Link href={`/user/detail/${user.idx}`}>
                          {user.idx}
                        </Link>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_admin === "true" ? "관리자" : "일반"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.gender}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active === "true" ? "활성" : "비활성"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  검색된 유저가 없습니다.
                </td>
              </tr>
            )}
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
