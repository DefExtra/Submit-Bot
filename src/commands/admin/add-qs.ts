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
  name: "add_qs",
  description: "add an q for a apply category.",
  type: 1,
  options: [
    {
      name: "role_id",
      description: "the role id for the category.",
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
    let roleId = i.options.getString("role_id", true);
    let data = await db.get(`Q_${roleId}`);
    if (data == null) await db.set(`Q_${roleId}`, { qs: [] });
    await respond(i, { content: "` - ` please type you q:" });
    await i.channel
      ?.createMessageCollector({
        filter: ({ author }) => author.id == i.user.id,
        max: 1,
        time: 1000 * 60 * 60 * 24,
      })
      .on("collect", async (i2) => {
        let q = i2.content;
        if (i2.deletable) i2.delete();
        await db.push(`Q_${roleId}.qs`, q);
        await editRespond(i, { content: "` - ` done added a q as `" + q + "`" });
      });
  },
};

export default command;
