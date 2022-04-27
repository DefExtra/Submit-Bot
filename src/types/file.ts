import { Client, CommandInteraction } from "discord.js";
import { Database } from "quickmongo";

declare namespace tpes {
  type option = {
    name: string;
    description: string;
    type: number;
    required: boolean;
  };

  type cmd = {
    name: string;
    description: string;
    type: number;
    category?: string;
    options?: option[];
    run: (
      client: Client,
      Interaction: CommandInteraction,
      options: option[],
      isGuiled: boolean,
      db: Database
    ) => void;
  };
}

export default tpes;
