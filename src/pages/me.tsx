import React, { useEffect, useState } from "react";
import Head from "next/head";
import { SideBar } from "../../components";
import Cookies from "universal-cookie";
import getToken from "@/tools/getToken";
import emitEvent from "@/tools/webSocketHandler";
import Image from "next/image";
import formatDate from "@/tools/formatDate";

const Me = ({ token, phone, userId }: any) => {
  const [user, setUser] = useState<{
    _id: string;
    phone: string;
    username?: string;
    options: any;
    joinedAt: Date;
  } | null>(null)

  const [username, setUsername] = useState<string>("")

  const cookies = new Cookies();

  const handleGetUser = async () => {
    emitEvent("usersGet", { token, userId }, (data: any) => {
      setUser(data.data)
      setUsername(data.data.username)
    })
  }

  useEffect(() => {
    setTimeout(() => {
      handleGetUser()
    }, 100)
  }, [])

  const isChange = username !== user?.username && username.length > 0

  const handleSubmit = async () => {
    if (!isChange) return
    emitEvent("userUpdate", { token, username }, (data: any) => {
      cookies.set("token", data.token, { path: "/", maxAge: 60 * 60 * 24 })
      handleGetUser()
    })
  }

  return (
    <>
      <Head>
        <title>WhatsUp - Me</title>
        <meta name="description" content="WhatsUp - Me" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <SideBar path="/me" phone={phone} />

        <div className="me">
          <div className="contentBorder">
            <div className="content">
              {user?._id && <><div className="inputContent">
                <div className="inputBox">
                  <label>
                    Phone number
                    <input type="text" name="phone" required value={user?.phone} disabled />
                  </label>
                </div>

                <div className="inputBox">
                  <label>
                    Member since
                    <input type="text" name="joinedAt" required value={
                      formatDate(new Date(user?.joinedAt as Date))
                    } disabled />
                  </label>
                </div>

                <div className="inputBox">
                  <label>
                    Username
                    <input type="text" name="username" required placeholder={user?.username} onChange={(e) => setUsername(e.target.value)} />
                  </label>
                </div>

                <div className="inputBox">
                    <input type="button" value="Save changes" style={{
                      backgroundColor: isChange ? "var(--green)" : "var(--white-dark)",
                      cursor: isChange ? "pointer" : "not-allowed"
                    }} disabled={!isChange} onClick={handleSubmit} />
                  </div>
              </div>
              <div className="imgContent">
                <div>
                  {user?.username && <Image src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${username}&radius=10&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&randomizeIds=true`} alt="favicon" width={220} height={220} />}
                </div>
              </div></>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Me;

export async function getServerSideProps(context: any) {
  const cookies = new Cookies(context.req.headers.cookie);
  const { token, phone, userId } = getToken(cookies)

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
      phone,
      userId,
    }
  };
}
