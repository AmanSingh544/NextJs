/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js to ignore this package during server-side compilation
  serverExternalPackages: ["@huggingface/transformers"], 
  
  webpack: (config) => {
    // Prevents Node.js server binaries from breaking your browser build
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    };
    return config;
  },
  turbopack: {}
};

export default nextConfig;
