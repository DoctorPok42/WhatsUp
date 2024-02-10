import chalk from "chalk"
import mongoose from "mongoose";

const themeColors = {
    text: "#2B2",
    variable: "#42f5e0",
    error: "#f5426c"
} as any

export const getThemeColor = (color: any) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: any, message: any) => {
    return chalk.hex(themeColors[color])(message)
}