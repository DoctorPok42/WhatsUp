import { Cookie } from "universal-cookie";
import jwt from "jsonwebtoken";

const getToken = (cookies: Cookie) => {
  const token = cookies.get("token");

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      name: string;
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    token: token,
    phone: decodedToken.name,
    userId: decodedToken.id,
  };
};

export default getToken;
