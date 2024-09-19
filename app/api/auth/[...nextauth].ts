import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      //자체 로그인 로직 구현
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        //외부서버와 통신하여 유저정보와 토큰을 가져오기
        try {
          const response = await axios.post(
            "https://localhost/api/auth/signup",
            { username, password }
          );

          const data = response.data;

          if (data) {
            //유저 정보와 토큰을 NextAuth.js 세션에 저장합니다.
            return {
              name: data.name,
              email: data.email,
              token: data.token,
            };
          } else {
            //로그인 실패 시 null을 반환합니다.
            return null;
          }
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // 로그인 페이지 경로 설정
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
