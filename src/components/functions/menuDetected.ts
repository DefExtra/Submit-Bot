import { Modal, showModal, TextInputComponent } from "discord-modals";
import { Client, EmbedField, Guild, MessageActionRow, MessageButton, Role, SelectMenuInteraction, TextChannel, User } from "discord.js";
import { Database } from "quickmongo";
import commands from "../loader";

const as: any[] = [];

export default async (
  client: Client,
  i: SelectMenuInteraction,
  db: Database
) => {
  let data: any = await db.get(`Data_${i.channel?.id}`);
  let role = i.guild?.roles.cache.find((r) => r.id == i.values[0]);
  if (data == null) return;
  if (data.applyType !== "menus") return;
  if (data.submitType == "modals") {
    if (!role) return;
    let check = await db.get(`${i.user.id}_${i.channel?.id}`);
    if (check == true)
    return i.reply({
        ephemeral: true,
        content: "you already has applyed to this submit",
      });
    const modal = new Modal()
      .setCustomId(role.id.toString())
      .setTitle(`Apply for: ${role.name}`);
    let qsd: any = await db.get(`Q_${role.id}`);
    if (qsd == null) return;
    await qsd.qs.forEach((q: any) => {
      modal.addComponents(
        new TextInputComponent()
          .setCustomId(q)
          .setLabel(q)
          .setStyle("LONG")
          .setMinLength(5)
          .setPlaceholder("Type your anwser")
          .setRequired(true)
      );
    });
    await showModal(modal, {
      client: client,
      interaction: i,
    });
  } else {
    if (!role) return;
    let check = await db.get(`${i.user.id}_${i.channel?.id}`);
    if (check == true)
      return i.reply({
        ephemeral: true,
        content: "you already has applyed to this submit",
      });
    let qsd: any = await db.get(`Q_${role.id}`);
    if (qsd == null) return;
    textChooseF(
      qsd.qs,
      {
        channel: i.channel?.type == "GUILD_TEXT" ? i.channel : null,
        user: i.user,
        guild: i.guild,
      },
      db,
      0,
      role,
      i
    );
  }
};

async function textChooseF(
    qs: string[],
    op: { user: User; channel: TextChannel | null; guild: Guild | null },
    db: Database,
    num: number,
    role: Role,
    i: SelectMenuInteraction
  ) {
    let length = qs.length - 1;
    let newNum = num + 1;
    let { channel, user, guild } = op;
    channel?.send({ content: qs[num] }).then((mm) => {
      channel
        ?.createMessageCollector({
          filter: ({ author }) => author.id == user.id,
          max: 1,
          time: 1000 * 60 * 60 * 24,
        })
        .on("collect", async (m) => {
          if (m.deletable) m.delete();
          as.push({ q: qs[num], a: m.content });
          if (num !== length) {
            textChooseF(qs, op, db, newNum, role, i);
            if (mm.deletable) mm.delete();
          } else {
            mm.edit(
              "Your Apply has been sent to mods, please for the response"
            ).then((deik) =>
              setTimeout(() => {
                deik.delete();
              }, 3400)
            );
            let channel = guild?.channels.cache.get(
              await db.get(`LOGS_${i.channel?.id}`)
            );
            await db.set(`${user.id}_${i.channel?.id}`, true);
            await db.set(`AS_${role?.id}_${user.id}`, {
              as: as,
              date: new Date().getTime(),
              userId: user.id,
              roleId: role?.id,
            });
            let fields: EmbedField[] = [];
            await as.forEach((a) => {
              fields.push({
                name: a.q,
                value: "```\n" + a.a + "```",
                inline: true,
              });
            });
            if (channel?.type == "GUILD_TEXT")
              channel.send({
                content: `New submit from: <@!${user.id}>(${user.id})`,
                embeds: [
                  {
                    color: 0x5865f2,
                    author: {
                      name: user.username,
                      iconURL: user.avatarURL({ dynamic: true }) || "",
                      url: "https://discord.com/users/" + user.id,
                    },
                    fields: fields,
                    timestamp: new Date(),
                  },
                ],
                components: [
                  new MessageActionRow().addComponents(
                    new MessageButton()
                      .setCustomId(`AS_${role?.id}_${user.id}`)
                      .setLabel("Accept")
                      .setStyle("SUCCESS"),
                    new MessageButton()
                      .setCustomId(`null`)
                      .setLabel("Deny")
                      .setStyle("DANGER")
                  ),
                ],
              });
          }
        });
    });
  }
  