import { Modal, showModal, TextInputComponent } from "discord-modals";
import { ButtonInteraction, Client } from "discord.js";
import { Database } from "quickmongo";
import commands from "../loader";

export default async (client: Client, i: ButtonInteraction, db: Database) => {
  if (i.customId.startsWith("AS_")) {
    let data: any = await db.get(i.customId);
    let role = await i.guild?.roles.cache.get(data?.roleId);
    (await i.channel?.messages.fetch(i.message.id))?.edit({
      embeds: [],
      components: [],
      content: `<@!${data.userId}>(${data.userId}) - <t:${data.date}> "Has Accepted"`,
    });
    let user = await i.guild?.members.cache.get(data.userId);
    await user?.roles.add(role || "").catch((err) => console.log(err));
    await user?.send({
      content: 'You Have Accepted To Get "' + role?.name + '"',
    });
    await deleteD(i, db);
  } else if (i.customId == `null`) {
    let data: any = await db.get(i.customId);
    let role = await i.guild?.roles.cache.get(data?.roleId);
    (await i.channel?.messages.fetch(i.message.id))?.edit({
      embeds: [],
      components: [],
      content: `<@!${data.userId}>(${data.userId}) - <t:${data.date}> "Has not Accepted"`,
    });
    let user = await i.guild?.members.cache.get(data.userId);
    await user?.send({
      content: 'You Have not Accepted To Get "' + role?.name + '"',
    });
    await deleteD(i, db);
  }
};

async function deleteD(i: any, db: any) {
  await db.delete(i.customId);
}
