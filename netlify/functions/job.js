import Telegram from "../services/telegram.js";
import AlphaVantage from "../services/alpha-vantage.js";

const punters = [
  { name: "Barbara", asset: "BRSR3", entryPrice: 11.95 },
  { name: "Leandro", asset: "VIIA3", entryPrice: 4.45 },
  { name: "Yuri", asset: "BBAS3", entryPrice: 31.72 },
];

const handler = async () => {
  const quotes = await Promise.all(
    punters.map(({ asset }) => AlphaVantage.getQuote(asset))
  );
  const rankedPunters = punters
    .map((punter, i) => {
      const price = Number(quotes[i].data["Global Quote"]["05. price"]);

      return {
        ...punter,
        price,
        variation: (price / punter.entryPrice - 1) * 100,
      };
    })
    .sort((a, b) => b.variation - a.variation);

  const brlFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const message = rankedPunters
    .map(({ name, asset, variation, entryPrice, price }, i) => {
      const getRank = () => {
        if (i === 0) {
          return "🥇";
        } else if (i === 1) {
          return "🥈";
        } else if (i === 2) {
          return "🥉";
        } else {
          return `${i + 1}.`;
        }
      };

      return `${getRank()} <b>${name}</b> (${asset} ${variation.toFixed(
        2
      )}%)\n\n Entrada: ${brlFormatter.format(
        entryPrice
      )}\n Atual: ${brlFormatter.format(price)}\n`;
    })
    .join("\n");

  Telegram.sendMessage(message);
};

export { handler };
