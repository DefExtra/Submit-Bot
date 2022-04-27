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
  name: "remove-apply-category",
  description: "remove an apply category form apply message,",
  type: 1,
  options: [
    {
      name: "category_role_id",
      type: 3,
      description: "the catgegory role id",
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

    let roleId = i.options.getString("category_role_id", true);
    let okay = false;
    let channel = i.channel;
    let data: any = await db.get(`Data_${channel?.id}`);
    if (data == null)
      return respond(i, {
        content:
          "` - ` please use `/set-apply` command first, to setup the apply message.",
      });
    let newCates: any[] = [];
    data?.categorys.forEach((cate: any) => {
      if (cate?.roleId == roleId) {
        okay = true;
        return;
      } else newCates.push(cate);
    });
    setTimeout(() => {
      data.categorys = newCates;
      setTimeout(async () => {
        await db.set(`Data_${channel?.id}`, data);
        okay == true
          ? respond(i, { content: "` - ` done removing the item." })
          : respond(i, { content: "` - ` this item is not exiest." });
      }, 381);
    }, 1250);
  },
};

export default command;
