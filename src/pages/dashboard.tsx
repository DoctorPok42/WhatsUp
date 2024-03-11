import React, { useEffect } from "react";
import Head from "next/head";
import Cookies from "universal-cookie";
import { SideBar } from "../../components";
import router from "next/router";

export default function Dashboard() {
  const cookies = new Cookies();
  const phone = cookies.get("phone");
  const token = cookies.get("token");

  useEffect(() => {
    if (!token || !phone) {
      router.push("/login");
    }
  }, [token, phone]);
  return (
    <>
      <Head>
        <title>WhatsUp - Dashboard</title>
        <meta name="description" content="WhatsUp - Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <SideBar path="/dashboard" phone={phone} />

        <div className="containerDash">
          <div className="contentDash">
            <div className="header">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
