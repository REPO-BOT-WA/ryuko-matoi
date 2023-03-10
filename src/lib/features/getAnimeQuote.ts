import axios from "axios";
import { Client, Message } from "whatsapp-web.js";
import { waitMessage } from "../utils/constants";

type QuoteByAnimeProps = {
  id: number;
  english: string;
  indo: string;
  character: string;
  anime: string;
};

export const getAnimeQuote = async (
  text: string,
  message: Message,
  client: Client
): Promise<Message> => {
  const anime: string = text.split(" ").slice(1).join(" ").toLowerCase();

  client.sendMessage(message.from, waitMessage);

  try {
    /**
     * - Jika user mengetikkan nama animenya,
     *   maka eksekusi kode di dalam if agar mendapatkan result sesuai nama anime
     */
    if (anime.length) {
      const response = await axios
        .get(`https://katanime.vercel.app/api/getbyanime?anime=${anime}&page=1`)
        .then((res) => res.data.result);

      return message.reply(
        response.map((value: QuoteByAnimeProps) => `- ${value.indo}`).join("\n\n")
      );
    }

    /**
     * - Jika user tidak memberikan nama animenya,
     *   maka get resultnya secara random(dari anime manapun)
     */
    const response = await axios
      .get(`https://katanime.vercel.app/api/getrandom`)
      .then((res) => res.data.result);

    return message.reply(
      response.map((value: QuoteByAnimeProps) => `*${value.anime}*\n- ${value.indo}`).join("\n\n")
    );
  } catch (err) {
    return message.reply(`${err}`);
  }
};
