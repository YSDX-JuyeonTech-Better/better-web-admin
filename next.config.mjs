import { withGluestackUI } from "@gluestack/ui-next-adapter";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "s3.amazonaws.com", "*"],
    //domains: ["localhost", "s3.amazonaws.com"],
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
