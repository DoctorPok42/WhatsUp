import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verifyAuthToken = (token: string) => {
  if (!token) {
    return null
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }

  if (!decodedToken) {
    return null
  } else {
    return decodedToken.id
  }
}

export default verifyAuthToken
