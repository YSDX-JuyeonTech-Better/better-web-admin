// ClientWrapper.tsx - 클라이언트 컴포넌트

"use client"; // 클라이언트 컴포넌트 선언

import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div>
        <Header />
        <div className="lg:pl-64">{children}</div>
      </div>
    </SessionProvider>
  );
}
