"use client";
import Link from "next/link";
import "../app/globals.css";
import Image from "next/image";
import { useState } from "react";
import { Item, menus } from "@/constants/menu";
import clsx from "clsx";
import { CloseIcon, Icon, MenuIcon } from "./ui/icon";

const GlobalNavItem = ({
  item,
  close,
}: {
  item: Item;
  close: () => false | void;
}) => {
  return (
    <Link
      href={`/${item.slug}`}
      onClick={close}
      className="block px-6 text-sm font-medium py-2 text-gray-100 rounded hover:text-gray-800 hover:bg-gray-700"
    >
      {item.name}
    </Link>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed top-0 z-50 flex flex-col w-full bg-gray-800 border-b border-gray-500 lg:bottom-0 lg:w-64 lg:border-r lg:border-b-0 lg:z-auto">
      {/* 타이틀로고 */}
      <div className=" block p-3 h-55 bg-black">
        <Link
          className="gap-x-2.5 grid place-items-center"
          href="/"
          onClick={close}
        >
          <Image src="/logo_lg.png" alt="logo" width={160} height={75} />
        </Link>

        <div className="items-end ">
          <span className=" lg:grid place-items-center text-sm font-semibold px-3 mt-2.5 text-gray-300 tracking-wider">
            관리자▼
          </span>
          <span className=" lg:grid place-items-center text-sm font-semibold px-3 mt-2.5 text-gray-300 tracking-wider">
            로그아웃 | 비밀번호변경
          </span>
        </div>
      </div>
      {/* 메뉴 닫기/열기 버튼 */}
      <button
        className="absolute top-0 right-0 flex items-center px-4 h-14 gap-x-2 lg:hidden"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="font-bold text-sm text-gray-300 hover:text-gray-600">
            <Icon as={CloseIcon} size="lg" />
          </span>
        ) : (
          <span className="font-bold text-sm text-gray-300 hover:text-gray-600">
            <Icon as={MenuIcon} size="lg" />
          </span>
        )}
      </button>
      {/* 메뉴표시 */}
      <div
        className={clsx("overflow-y-auto lg:block lg:static", {
          "fixed inset-x-0 bottom-0 top-20 bg-gray-800": isOpen,
          hidden: !isOpen,
        })}
      >
        <nav>
          {menus.map((section) => {
            return (
              <div key={section.name}>
                <div className="text-lg font-semibold py-3 px-3  text-gray-300 tracking-wider">
                  <div>{section.name}</div>
                </div>
                <div className="">
                  {section.items.map((item) => (
                    <GlobalNavItem item={item} close={close} key={item.slug} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
export default Header;
