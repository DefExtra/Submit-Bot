import { connectToDiscord, connectToMongo } from "./src/components/connect";
import { regCommands } from "./src/components/register";
import commandDetected from "./src/components/functions/commandDetected";
import buttonDetected from "./src/components/functions/buttonDetected";
import commands from "./src/components/loader";
import discord from "./src/modules/clients/discord";
import fs from "fs";
import { ModalSubmitInteraction } from "discord-modals";
import respondForModals from "./src/components/functions/respondForModals";
import buttonDetectedForModsTS from "./src/components/functions/buttonDetectedForMods";
import menuDetected from "./src/components/functions/menuDetected";

const config = JSON.parse(
  fs.readFileSync(__dirname + "/config.def", { encoding: "utf-8" })
);

(async () => {
  discord.client.on("ready", async () => {
    console.log("Bot has connected.");
    let commandsForLoad: any[] = [];
    await commands.forEach((cmd) => commandsForLoad.push(cmd));
    await regCommands(commandsForLoad, discord.client);
  });
  await connectToDiscord(config?.token, discord.client).catch(console.log);
  await connectToMongo(config?.mongoDBurl).then((db) => {
    db.connect();
    db.on("ready", () => console.log("Database has connected."));
    discord.client.on("interactionCreate", async (i) => {
      if (i.isSelectMenu()) await menuDetected(discord.client, i, db);
      if (i.isCommand()) await commandDetected(discord.client, i, db);
      if (i.isButton()) await buttonDetected(discord.client, i, db);
      if (i.isButton()) await buttonDetectedForModsTS(discord.client, i, db);
    });
    discord.client
      .on("error", (err) => console.error(`[ERROR] - ${err}`))
      .on("warn", (warn) => console.warn(`[WARN] - ${warn}`))
      .on("log", () => {})
      .on("debug", () => {});
    process.on("unhandledRejection", (reason: any, promise) => {
      console.log("Unhandled Rejection at:", reason.stack || reason);
    });
    discord.client.on("modalSubmit", async (modal: ModalSubmitInteraction) => {
      await respondForModals(discord.client, modal, db);
    });
  });
})();
