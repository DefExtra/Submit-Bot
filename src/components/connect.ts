import { Client } from "discord.js";
import { Database } from "quickmongo";

export async function connectToDiscord(token: string, client: Client) {
  return new Promise(
    (resolve: (value: { token: string; client: Client }) => any, reject) => {
      client
        .login(token)
        .then(() => resolve({ token, client: client }))
        .catch((err) => reject(err));
    }
  );
}

export async function connectToMongo(mongoDBurl: string) {
  return new Promise(
    (resolve: (value: Database) => any, reject: (value: string) => any) => {
      const db = new Database(mongoDBurl);
      db.connect()
        .then(() => resolve(db))
        .catch(() => reject("mongoose connect is lost"));
    }
  );
}
