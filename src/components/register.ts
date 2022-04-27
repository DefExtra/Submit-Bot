import { ApplicationCommandDataResolvable, Client } from "discord.js";
import types from "../types/file";

export async function regCommands(commands: types.cmd[], client: Client) {
  let commandsData: ApplicationCommandDataResolvable[] = [];
  await commands.forEach((cmd) => {
    commandsData.push({
      name: cmd.name,
      description: cmd.description,
      type: cmd.type,
      options: cmd.options,
    });
  });
  await client.application?.commands.set(commandsData)
}
