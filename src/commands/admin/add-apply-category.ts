import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { Database } from "quickmongo";
import { editRespond, respond } from "../../components/functions/respond";
import types from "../../types/file";

const command: types.cmd = {
  name: "add-apply-category",
  description: "add an apply category for apply message,",
  type: 1,
  run: async (
    client: Client,
    i: CommandInteraction,
    options: types.option[],
    isGuiled: boolean,
    db: Database
  ) => {
    if (isGuiled == false) return;

    let label: any = null;
    let roleId: any = null;
    let style: any = null;

    let channel = i.channel;
    let data: any = await db.get(`Data_${channel?.id}`);
    if (data == null)
      return respond(i, {
        content:
          "` - ` please use `/set-apply` command first, to setup the apply message.",
      });
    let message = await i.channel?.messages.fetch(data.msgId);
    if (data.applyType == "buttons") {
      await respond(i, { content: "` - ` please type the button label" }).then(
        () => {
          channel
            ?.createMessageCollector({
              filter: ({ author }) => author.id == i.user.id,
              max: 1,
              time: 1000 * 60 * 60 * 24,
            })
            .on("collect", async (m) => {
              if (m.deletable) m.delete();
              label = m.content;
              await editRespond(i, {
                content: "` - ` please type the staff role id for this apply",
              }).then(() => {
                channel
                  ?.createMessageCollector({
                    filter: ({ author }) => author.id == i.user.id,
                    max: 1,
                    time: 1000 * 60 * 60 * 24,
                  })
                  .on("collect", async (m2) => {
                    if (m2.deletable) m2.delete();
                    let cacheroleId = m2.content;
                    let role = await i.guild?.roles.cache.get(cacheroleId);
                    if (!role) {
                      await editRespond(i, {
                        content:
                          "` - ` i can't find this role in the server, i have resived: " +
                          cacheroleId,
                      });
                    } else {
                      roleId = cacheroleId;
                      let raw = new MessageActionRow().addComponents(
                        new MessageButton()
                          .setCustomId("DANGER")
                          .setLabel("DANGER")
                          .setStyle("DANGER"),
                        new MessageButton()
                          .setCustomId("PRIMARY")
                          .setLabel("PRIMARY")
                          .setStyle("PRIMARY"),
                        new MessageButton()
                          .setCustomId("SECONDARY")
                          .setLabel("SECONDARY")
                          .setStyle("SECONDARY"),
                        new MessageButton()
                          .setCustomId("SUCCESS")
                          .setLabel("SUCCESS")
                          .setStyle("SUCCESS")
                      );
                      await editRespond(i, {
                        content: "` - ` choose the button style:",
                        components: [raw],
                      }).then(async (m: any) => {
                        m.createMessageComponentCollector({
                          time: 1000 * 60 * 60 * 24,
                          max: 1,
                        }).on("collect", async (i22: ButtonInteraction) => {
                          await i22.deferUpdate().catch(() => {});
                          style = i22.customId;
                          await editRespond(i, {
                            content:
                              "` - ` done added the staff category, your button will look like this:",
                            components: [
                              new MessageActionRow().addComponents(
                                new MessageButton()
                                  .setCustomId(roleId)
                                  .setLabel(label)
                                  .setStyle(style)
                                  .setDisabled(true)
                              ),
                            ],
                          });
                          let embed: any = message?.embeds[0];
                          let okay = 0;
                          let pol = await data?.categorys
                            .map(
                              (cate: any) =>
                                `Press "${cate.label}" to get <@&${cate.roleId}>`
                            )
                            .join("\n");
                          embed.description = pol;
                          let componentNEW: any = new MessageActionRow();
                          let componentOLD = message?.components[0];
                          await componentOLD?.components.map(async (c) => {
                            if (c.customId == roleId) {
                              okay = 1;
                              return;
                            }
                            await componentNEW.addComponents(c);
                          });
                          await componentNEW.addComponents(
                            new MessageButton()
                              .setCustomId(roleId)
                              .setLabel(label)
                              .setStyle(style)
                          );
                          await message?.edit({
                            embeds: [embed],
                            components: [componentNEW],
                          });
                          if (okay == 0)
                            await db.push(`Data_${channel?.id}.categorys`, {
                              roleId,
                              label,
                              style,
                            });
                        });
                      });
                    }
                  });
              });
            });
        }
      );
    } else if (data.applyType == "menus") {
      let name: any = null;
      let value: any = null;
      await respond(i, {
        content: "` - ` please type the select menu category name",
      }).then(() => {
        channel
          ?.createMessageCollector({
            filter: ({ author }) => author.id == i.user.id,
            max: 1,
            time: 1000 * 60 * 60 * 24,
          })
          .on("collect", async (m) => {
            if (m.deletable) m.delete();
            name = m.content;
            await editRespond(i, {
              content: "` - ` please type the staff role id for this apply",
            }).then(() => {
              channel
                ?.createMessageCollector({
                  filter: ({ author }) => author.id == i.user.id,
                  max: 1,
                  time: 1000 * 60 * 60 * 24,
                })
                .on("collect", async (m2) => {
                  if (m2.deletable) m2.delete();
                  let cacheroleId = m2.content;
                  let role = await i.guild?.roles.cache.get(cacheroleId);
                  if (!role) {
                    await editRespond(i, {
                      content:
                        "` - ` i can't find this role in the server, i have resived: " +
                        cacheroleId,
                    });
                  } else {
                    value = cacheroleId;
                    await editRespond(i, {
                      content: "` - ` done added the staff category(option)",
                    });
                    let embed: any = message?.embeds[0];
                    let okay = 0;
                    let pol = await data?.categorys
                      .map(
                        (cate: any) =>
                          `Press "${cate.name}" to get <@&${cate.value}>`
                      )
                      .join("\n");
                    embed.description = pol;
                    let comp = new MessageActionRow();
                    let menu = new MessageSelectMenu()
                      .setCustomId("menu")
                      .setMaxValues(1)
                      .setMinValues(1)
                      .setPlaceholder("choose a staff apply from here.");
                    let componentOLD = message?.components[0];
                    let onC = await componentOLD?.components[0];
                    if (onC?.type == "SELECT_MENU") {
                      onC?.options?.map(async (c:any) => {
                        if (c.label == "don't press this please") return;
                        if (c.value == value) {
                          okay = 1;
                          return;
                        }
                        await menu.addOptions([
                          { label: c.label, value: c.value },
                        ]);
                      });
                      await menu.addOptions([{ label: name, value: value }]);
                      await comp.setComponents(menu);
                      await message?.edit({
                        embeds: [embed],
                        components: [comp],
                      });
                      if (okay == 0)
                        await db.push(`Data_${channel?.id}.categorys`, {
                          name,
                          value,
                        });
                    }
                  }
                });
            });
          });
      });
    }
  },
};

export default command;
