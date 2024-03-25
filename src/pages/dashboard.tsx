import React, { useEffect, useState } from "react";
import Head from "next/head";
import Cookies from "universal-cookie";
import { SideBar } from "../../components";
import router from "next/router";
import DashBox from "../../components/DashBox";
import emitEvent from "@/tools/webSocketHandler";

export default function Dashboard() {
  const cookies = new Cookies();
  const phone = cookies.get("phone");
  const token = cookies.get("token");
  const [dashboard, setDashboard] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token || !phone) {
      router.push("/login");
    }
  }, [token, phone]);

  const getDashboard = async () => {
    emitEvent("getDashboard", { token }, (data: any) => {
      setDashboard(data.data);
    });
  }

  const createDashboard = async () => {
    emitEvent("createUserDashboard", { token }, (data: any) => {
      setDashboard(data.data);
    });
  }

  useEffect(() => {
    getDashboard();
    setLoading(false);
  }, []);

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

            {dashboard && !loading ?
              <div className="dashBoxs">
                <DashBox
                  subtitle="This month messages"
                  text={dashboard?.messagesSendMonth}
                  style={{
                    width: "15em",
                    background: "linear-gradient(90deg, #a15bf1 0%, #8b34f1 100%)",
                    border: "none"
                  }}
                />

                <DashBox
                  subtitle="Total contacts"
                  text={dashboard?.contactsNumber}
                  style={{
                    width: "15em",
                    background: "linear-gradient(90deg, #f1a15b 0%, #f18b34 100%)",
                    border: "none"
                  }}
                />

                <DashBox
                  subtitle="Total conversations"
                  text={dashboard?.conversationNumber}
                  style={{
                    width: "15em",
                    background: "linear-gradient(90deg, #f15b5b 0%, #f34f34 100%)",
                    border: "none"
                  }}
                />
              </div>
            :
              <div className="noDash">
                <DashBox
                  title="No dashboard found!"
                  titleEmoji="1f625"
                  style={{
                    width: "100%",
                    backgroundColor: "#2e333d",
                    border: "none"
                  }}
                >
                  <span>It seems that you don&#39;t have any dashboard yet.</span>
                  <p>Warning: When you create a dashboard, more data about you will be stored, you can delete it at any time.</p>

                  <button
                    className="button"
                    onClick={createDashboard}
                  >
                    Create dashboard
                  </button>
                </DashBox>
              </div>
            }
          </div>
        </div>
      </main>
    </>
  );
}
