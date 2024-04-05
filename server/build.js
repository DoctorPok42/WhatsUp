const { exec } = require("child_process");
const chalk = require("chalk");

const themeColors = {
  text: "#2B2",
  variable: "#42f5e0",
  error: "#f5426c"
}


const main = () => {
  console.log(chalk.hex(themeColors.text)("Starting build..."));
  exec("tsc", (err, stdout, stderr) => {
    if (err) {
      console.log(chalk.hex(themeColors.error)("Build failed with the following error: "));
      console.log(chalk.hex(themeColors.error)(stdout));
      return;
    }
    console.log(chalk.hex(themeColors.text)(`Build successful! You can start the server by running ${chalk.hex(themeColors.variable)("npm start")}\n`));
  })
}

try {
  main()
} catch (e) {
  console.log(chalk.hex(themeColors.error)("Error: Something went wrong while trying to start the build process.", e))
}
