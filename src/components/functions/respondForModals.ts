import {
  Modal,
  ModalSubmitInteraction,
  showModal,
  TextInputComponent,
} from "discord-modals";
import {
  Client,
  EmbedField,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Database } from "quickmongo";
import commands from "../loader";

export default async (
  client: Client,
  i: ModalSubmitInteraction,
  db: Database
) => {
  let data: any = await db.get(`Data_${i.channel?.id}`);
  let role = await i.guild?.roles.cache.find((r) => r.id == i.customId);
  if (!role) return;
  if (!data) return;
  let as: any[] = [];
  let qsd: any = await db.get(`Q_${role.id}`);
  if (qsd == null) return;
  await qsd.qs.forEach(async (q: any) => {
    let res = await i.getTextInputValue(q);
    await as.push({ q: q, a: res });
  });
  await i.deferReply({ ephemeral: true });
  await i
    .followUp({
      content: `Your Apply has been sent to mods, please for the response`,
      ephemeral: true,
    })
    .then(async (d) => {
      let channel = i.guild?.channels.cache.get(
        await db.get(`LOGS_${i.channel?.id}`)
      );
      await db.set(`${i.user.id}_${i.channel?.id}`, true);
      await db.set(`AS_${role?.id}_${i.user.id}`, {
        as: as,
        date: new Date().getTime(),
        userId: i.user.id,
        roleId: role?.id
      });
      let fields: EmbedField[] = [];
      await as.forEach((a) => {
        fields.push({ name: a.q, value: "```\n" + a.a + "```", inline: true });
      });
      if (channel?.type == "GUILD_TEXT")
        channel.send({
          content: `New submit from: <@!${i.user.id}>(${i.user.id})`,
          embeds: [
            {
              color: 0x5865f2,
              author: {
                name: i.user.username,
                iconURL: i.user.avatarURL({ dynamic: true }) || "",
                url: "https://discord.com/users/" + i.user.id,
              },
              fields: fields,
              timestamp: new Date(),
            },
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId(`AS_${role?.id}_${i.user.id}`)
                .setLabel("Accept")
                .setStyle("SUCCESS"),
              new MessageButton()
                .setCustomId(`null`)
                .setLabel("Deny")
                .setStyle("DANGER")
            ),
          ],
        });
    });
};
