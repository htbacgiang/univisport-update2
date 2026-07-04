// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <meta name="google-site-verification" content="kNL7mAgNeJ_YF0n5xp1aWaEILSmJvt4hFsNJPOpMujY" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="p:domain_verify" content="46fb224c998b15a6ef1c551d52257138" />
        {/* Các meta tag toàn cục chung */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
