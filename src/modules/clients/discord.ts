import Discord, { Client, ClientOptions, IntentsString } from "discord.js";
import modals from "discord-modals";

const intents: IntentsString[] = [
  "DIRECT_MESSAGES",
  "DIRECT_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_TYPING",
  "GUILDS",
  "GUILD_BANS",
  "GUILD_EMOJIS_AND_STICKERS",
  "GUILD_INTEGRATIONS",
  "GUILD_INVITES",
  "GUILD_MEMBERS",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
  "GUILD_MESSAGE_TYPING",
  "GUILD_PRESENCES",
  "GUILD_SCHEDULED_EVENTS",
  "GUILD_VOICE_STATES",
  "GUILD_WEBHOOKS",
];

const options: ClientOptions = {
  intents,
  allowedMentions: {
    repliedUser: false,
  },
  presence: {
    activities: [{ name: "Type: /help, made by Def.", type: "COMPETING" }],
  },
};

const client = new Client(options);
modals(client);
export default { options, intents, client };
