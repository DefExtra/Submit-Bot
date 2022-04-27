import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { Database } from "quickmongo";
import { editRespond, respond } from "../../components/functions/respond";
import types from "../../types/file";

const command: types.cmd = {
  name: "remove_qs",
  description: "remove an q form a apply category.",
  type: 1,
  options: [
    {
      name: "role_id",
      description: "the role id for the category.",
      type: 3,
      required: true,
    },
    {
      name: "q_content",
      description: "the content of the q you wont to remove.",
      type: 3,
      required: true,
    },
  ],
  run: async (
    client: Client,
    i: CommandInteraction,
    options: types.option[],
    isGuiled: boolean,
    db: Database
  ) => {
    if (isGuiled == false) return;
    let okay = false;
    let roleId = i.options.getString("role_id", true);
    let data: any = await db.get(`Q_${roleId}`);
    if (data == null)
      return await respond(i, {
        content: "` - ` you have no qs for this category",
      });
    let new_qs: any[] = [];
    await data?.qs.forEach((q: any) => {
      if (q == i.options.getString("q_content", true)) {
        okay = true;
        return;
      } else new_qs.push(q);
    });
    await db.set(`Q_${roleId}`, { qs: new_qs });
    setTimeout(() => {
      setTimeout(async () => {
        okay == true
          ? respond(i, { content: "` - ` done removing the item." })
          : respond(i, { content: "` - ` this item is not exiest." });
      }, 381);
    }, 1250);
  },
};

export default command;
