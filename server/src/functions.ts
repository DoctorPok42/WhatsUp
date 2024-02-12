import chalk from "chalk"
import jwt from 'jsonwebtoken'
import UserModel from "./schemas/users"
import ConversationsModel from "./schemas/conversations"

const themeColors = {
  text: "#2B2",
  variable: "#42f5e0",
  error: "#f5426c"
} as any

export const getThemeColor = (color: any) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: any, message: any) => {
  return chalk.hex(themeColors[color])(message)
}

export const createAuthToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.TOKEN_EXPIRATION
  });
}

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}

export const checkCollections = () => {
  UserModel.find({}, (err: any, res: any) => {
    if (err) console.error(err)
    if (res) console.log(color('text', `📦 ${res.length} users found.`))
  })

  ConversationsModel.find({}, (err: any, res: any) => {
    if (err) console.error(err)
    if (res) console.log(color('text', `📦 ${res.length} conversations found.`))
  })
}
