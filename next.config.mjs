/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "uploadthing.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/midtrans/:path*",
        destination:
          "https://app.sandbox.midtrans.com/snap/v1/transactions/:path*",
      },
    ];
  },
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
