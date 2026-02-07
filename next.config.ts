import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // swcMinify: true, <--- REMOVA ESTA LINHA (Causa do erro)
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se você quiser forçar o swcMinify, é aqui que ele ficaria, 
  // mas o Next.js já ativa por padrão, então pode deixar sem.
};

export default withPWA(nextConfig);