import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { Database } from "quickmongo";
import { editRespond, respond } from "../../components/functions/respond";
import types from "../../types/file";

const command: types.cmd = {
  name: "set-apply",
  description: "setup the apply configration.",
  type: 1,
  options: [
    {
      name: "log_channel",
      description: "the channel what the bot will the send the submit",
      required: true,
      type: 7,
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
    let channel = i.channel;
    let applyType: any = null;
    let submitType: any = null;
    await respond(i, {
      content: "` - ` please choose the applys type fom types down blow:",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("buttons")
            .setLabel("Buttons.")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("menus")
            .setLabel("Select Menus.")
            .setStyle("PRIMARY")
        ),
      ],
    }).then(async (msg: any) => {
      msg
        .createMessageComponentCollector({
          componentType: "BUTTON",
          max: 1,
          time: 1000 * 60 * 60 * 24,
        })
        .on("collect", async (i2: ButtonInteraction) => {
          await i2.deferUpdate().catch(() => {});
          applyType = i2.customId;
          await editRespond(i, {
            content: "` - ` please choose the submit type fom types down blow:",
            components: [
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("modals")
                  .setLabel("discod modals.")
                  .setStyle("PRIMARY"),
                new MessageButton()
                  .setCustomId("text")
                  .setLabel("normal messages.")
                  .setStyle("PRIMARY")
              ),
            ],
          }).then(async (msg2: any) => {
            msg2
              ?.createMessageComponentCollector({
                filter: (user: ButtonInteraction) => user.user.id == i.user.id,
                componentType: "BUTTON",
                max: 1,
                time: 1000 * 60 * 60 * 24,
              })
              .on("collect", async (i2: ButtonInteraction) => {
                await i2.deferUpdate().catch(() => {});
                submitType = i2.customId;
                await editRespond(i, {
                  components: [],
                  content: `\` - \` apply to staff is active in <#${channel?.id}>, use \`/add-apply-category\` to add a staff category to apply`,
                }).then(async (msg3) => {
                  channel
                    ?.send({
                      embeds: [
                        {
                          color: 0x5865f2,
                          author: { name: "Hi applyer 👋" },
                          image: {
                            url: (await i.guild?.fetch())?.bannerURL() || "",
                          },
                          description: "_ _",
                        },
                      ],
                      components:
                        applyType == "menus"
                          ? [
                              new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                  .setCustomId("menu")
                                  .setMaxValues(1)
                                  .setMinValues(1)
                                  .setPlaceholder(
                                    "choose a staff apply from here."
                                  )
                                  .setOptions([
                                    {
                                      label: "don't press this please",
                                      value: "don't press this please",
                                    },
                                  ])
                              ),
                            ]
                          : [],
                    })
                    .then(async ({ id: messageId }) => {
                      await db.set(
                        `LOGS_${channel?.id}`,
                        i.options.getChannel("log_channel", true)?.id
                      );
                      await db.set(`Data_${channel?.id}`, {
                        msgId: messageId,
                        channelId: channel?.id,
                        submitType: submitType,
                        applyType: applyType,
                        categorys: [],
                      });
                    });
                });
              });
          });
        });
    });
  },
};

export default command;
