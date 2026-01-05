/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Transpile Firebase packages for older Android device compatibility
  transpilePackages: [
    "firebase",
    "@firebase/app",
    "@firebase/firestore",
    "@firebase/storage",
    "@firebase/analytics",
  ],
  // Ensure consistent behavior across devices
  reactStrictMode: true,
  // Compiler options for better compatibility
  compiler: {
    // Remove console.log in production for cleaner output
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
