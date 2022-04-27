import { Client, CommandInteraction } from "discord.js";
import { Database } from "quickmongo";
import commands from "../loader";

export default (client: Client, i: CommandInteraction, db: Database) => {
  let options: any = i.options.data;
  commands
    .get(i.commandName)
    ?.run(client, i, options, i.guild?.id ? true : false, db);
};
