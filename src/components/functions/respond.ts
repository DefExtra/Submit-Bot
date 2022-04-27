import { CommandInteraction, InteractionReplyOptions } from "discord.js";

export async function respond(
  i: CommandInteraction,
  replyContent: InteractionReplyOptions
) {
  await i.deferReply({ ephemeral: true }).catch(() => {});
  return i.followUp(replyContent);
}

export async function editRespond(
    i: CommandInteraction,
    replyContent: InteractionReplyOptions
  ) {
    return i.editReply(replyContent);
  }