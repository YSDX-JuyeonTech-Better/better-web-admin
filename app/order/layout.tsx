"use client";
import "../globals.css";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex container">
      <div className="fixed top-0 z-50 flex flex-col w-full bg-gray-200 border-b border-gray-700 lg:h-14 lg:border-b-2 lg:z-auto">
        <span className="pt-3 text-2xl font-semibold px-7">주문관리</span>
      </div>
      <div className="pt-14 w-full">
        <div className="fixed top-16 z-10 flex flex-col w-full bg-gray-100 border-b border-gray-500 h-full lg:z-auto ">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
