import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 기존 도메인과 함께, image.oliveyoung.co.kr을 추가합니다.
    domains: ["localhost", "s3.amazonaws.com", "image.oliveyoung.co.kr"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:4000/api/:path*`,
      },
    ];
  },
  trailingSlash: true,

  transpilePackages: ["nativewind", "react-native-css-interop"],
};

export default withGluestackUI(nextConfig);
