import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import emitEvent from "../tools/webSocketHandler";
import Cookies from "universal-cookie";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [isValide, setIsValide] = useState(false);
  const [loginType, setLoginType] = useState<"signin" | "signup">("signin");

  useEffect(() => {
      const phoneRegex = new RegExp(/^(\d{2}\s){4}\d{2}$/);

      const phoneValue = document.querySelector("input[name=phone]") as HTMLInputElement;
      phoneValue.value = phoneValue.value.replace(/[^0-9]/g, "").replace(/(\d{2})(?=\d)/g, "$1 ");

      if (phoneRegex.test(phoneValue.value || phone)) {
        setIsValide(true);
      } else {
        setIsValide(false);
      }
  }, [phone]);

  const handleSubmit = async () => {
    const userPhone = phone.replace(/\s/g, "");

    emitEvent(loginType === "signin" ? "userlogin" : "userCreate", { phone: userPhone, username }, (data: any) => {
      if (data.status === "success") {
        const cookies = new Cookies();
        cookies.set("token", data.token, { path: "/", maxAge: 60 * 60 * 24 });
        cookies.set("phone", userPhone, { path: "/", maxAge: 60 * 60 * 24 });
        cookies.set("userId", data.userId, { path: "/", maxAge: 60 * 60 * 24 });
        router.push("/chats");
      } else {
        alert(data.message);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Login ~ WhatsUp</title>
        <meta name="description" content="WhatsUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5ad27d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div className="contentLogin">
          <div className="header">
            <div className="logo">
              <Image src="/favicon.ico" alt="WhatsUp" width={160} height={160} />
            </div>
            <h1>WhatsUp</h1>

            <div className="subtitle">
              <h3>{loginType === "signin" ? "Sign in" : "Sign up"}</h3>
              <p>Your phone number is your WhatsUp ID</p>
            </div>
          </div>

          <div className="loginBox">
            <form>
              <div className="inputBox">
                <label>Phone number <span>*</span></label>
                <input type="text" name="phone" required onChange={(e) => setPhone(e.target.value)} />
              </div>
              {loginType === "signup" && <div className="inputBox">
                <label>Username <p>(we strongly recommend to fill this field)</p></label>
                <input type="text" name="phone" required onChange={(e) => setUsername(e.target.value)} />
              </div>}
              <div className="inputBox">
                <input type="button" value="Get my code" style={{
                  backgroundColor: isValide ? "var(--green)" : "var(--white-dark)",
                  cursor: isValide ? "pointer" : "not-allowed"
                }} disabled={!isValide} onClick={handleSubmit} />
              </div>
            </form>
            <div className="register">
              <p>
                {loginType === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setLoginType(loginType === "signin" ? "signup" : "signin")}>{loginType === "signin" ? "Sign up" : "Sign in"}</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
