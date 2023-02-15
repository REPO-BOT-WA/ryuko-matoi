import axios from "axios";
import { Client, Message } from "whatsapp-web.js";
import { bulan, hari, tahun } from "../helpers/formatDate";
import { waitMessage } from "../utils/constants";

export const getJadwalSholat = async (
  text: string,
  message: Message,
  client: Client
): Promise<Message> => {
  const date: string = `${tahun}/${bulan}/${hari}`;
  const target: string = `${text.split(" ").slice(1).join(" ").toLowerCase()}`;
  const indonesianDate = new Date().toLocaleDateString("id-Id", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  client.sendMessage(message.from, waitMessage);

  if (target.length <= 2) {
    if (target.length === 0) {
      return message.reply(
        "Ini adalah perintah untuk mendapatkan jadwal sholat sesuai dengan nama daerah yang dimasukkan. Cukup ketik *!jadwalsholat <your_daerah>*"
      );
    }
    return message.reply(
      "Maaf, panjang karakter daerah yang dimasukkan tidak boleh kurang dari atau sama dengan 2!"
    );
  }

  try {
    const getId = await axios
      .get(`https://api.myquran.com/v1/sholat/kota/cari/${target}`)
      .then((res) => res.data.data[0].id);
    const response = await axios
      .get(`https://api.myquran.com/v1/sholat/jadwal/${getId}/${date}`)
      .then((res) => res.data);

    const { imsak, subuh, terbit, dhuha, dzuhur, ashar, maghrib, isya } = response.data.jadwal;

    return message.reply(`*Jadwal Sholat hari ini, ${indonesianDate} di Kota ${
      target[0].toUpperCase() + target.slice(1).toLowerCase()
    }*

Imsak = ${imsak}  
Subuh = ${subuh}   
Terbit = ${terbit}  
Dhuha = ${dhuha}  
Dzuhur = ${dzuhur}  
Ashar = ${ashar}  
Maghrib = ${maghrib}
Isya = ${isya}`);
  } catch (err) {
    return message.reply(`${err}`);
  }
};
