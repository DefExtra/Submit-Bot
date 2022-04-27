import fs from "fs";
import types from "../types/file";

const commands: Map<string, types.cmd> = new Map();

fs.readdirSync(process.cwd() + "/src/commands/").map((category) =>
  fs
    .readdirSync(process.cwd() + "/src/commands/" + category + "/")
    .filter((file) => file.endsWith(".ts"))
    .map(async (commandName) => {
      let command: {default: types.cmd} = await import(
        process.cwd() + "/src/commands/" + category + "/" + commandName
      );
      commands.set(command?.default.name, command.default);
    })
);

export default commands;