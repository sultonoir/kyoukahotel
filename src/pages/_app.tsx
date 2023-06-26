import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modal/LoginModal";
import RegisterModal from "@/components/modal/RegisterModal";
import SearchModal from "@/components/modal/SearchModal";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Kyouka Hotel</title>
        <meta
          name="description"
          content="KyOuka adalah platform daring yang memungkinkan orang untuk menyewakan properti atau kamar tidur mereka kepada wisatawan atau tamu yang mencari tempat menginap sementara. Dengan menggunakan KyOuka, pemilik properti dapat mempromosikan ruang mereka, menetapkan harga, dan menyediakan informasi tentang fasilitas yang tersedia. Di sisi lain, para pengguna KyOuka dapat mencari dan memesan akomodasi sesuai dengan preferensi mereka, baik untuk liburan, perjalanan bisnis, atau tujuan lainnya."
        />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </Head>
      <Toaster />
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
