/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "silent-weasel-664.convex.cloud",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
