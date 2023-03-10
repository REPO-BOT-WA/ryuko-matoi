import { Client, Message } from "whatsapp-web.js";
import { waitMessage, wrongFormat } from "../utils/constants";
import axios from "axios";

type DoaProps = {
  id: string;
  doa: string;
  ayat: string;
  latin: string;
  artinya: string;
};

export const getDoa = async (text: string, message: Message, client: Client): Promise<Message> => {
  const command: string = `${text.split(" ").slice(1).join(" ").toLowerCase()}`;
  client.sendMessage(message.from, waitMessage);

  if (command === "info") {
    return message.reply(
      "Ini adalah perintah untuk mendapatkan Do'a secara spesifik, maupun secara random. Ketik *!doa* untuk mendapatkan hasil random, dan *!doa semua* untuk mendapatkan semua"
    );
  }

  try {
    const randomDoa = await axios
      .get("https://doa-doa-api-ahmadramadhan.fly.dev/api/doa/v1/random")
      .then((res) => res.data);

    // bila command yang diberikan kosong
    if (command === "") {
      return message.reply(
        randomDoa.map((value: DoaProps) =>  
`*${value.doa}*:
      
${value.ayat}
Artinya: ${value.artinya}`).join("\n"));
    }

    const semuaDoa = await axios
      .get("https://doa-doa-api-ahmadramadhan.fly.dev/api")
      .then((res) => res.data);

    // bila command = semua
    if (command === "semua") {
      return message.reply(
        semuaDoa
          .map(
            (value: DoaProps) =>
`*${value.doa}*:    

${value.ayat}
Artinya: ${value.artinya}`).join("\n"));
    }

    // buat nyari doa sesuai keinginan user. Hasilnya langsung berupa object bukan array of object lagi
    const targetDoa:DoaProps = await axios
      .get(`https://doa-doa-api-ahmadramadhan.fly.dev/api/doa/${command}`)
      .then((res) => res.data);
    return message.reply(
`*${targetDoa.doa}*:    

${targetDoa.ayat}
Artinya: ${targetDoa.artinya}`
        )
  } catch (err) {
    return message.reply(`${err}`);
  }
};
