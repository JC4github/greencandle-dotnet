import {
  Box,
  Divider,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GetStockByTicker, TryCompanyByTicker } from "../../../static/util/api";
import { Link } from "react-router-dom";
import addToRecentSearchesList from "../../../static/util/ts";

export default function TickerBlock({
  tickerSymbol: inititalTickerSymbol,
  companyName: initialCompanyName = "",
  price: initialPrice = 0,
  change: initialChange = 0,
  diff: initialDiff = 0,
}: {
  tickerSymbol: string;
  companyName?: string;
  price?: number;
  change?: number;
  diff?: number;
}) {
  const [tickerSymbol, setTickerSymbol] =
    useState<string>(inititalTickerSymbol);
  const [companyName, setCompanyName] = useState<string>(initialCompanyName);
  const [price, setPrice] = useState<number>(initialPrice);
  const [diff, setDiff] = useState<number>(initialDiff);
  const [change, setChange] = useState<number>(initialChange);

  // if ticker symbol only, fetch the data automatically.
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await TryCompanyByTicker(inititalTickerSymbol);
        if (result !== false) {
          const { tickerSymbol, tickerName } = result;
          setTickerSymbol(tickerSymbol);
          setCompanyName(tickerName);
        }

        const stockData = await GetStockByTicker(inititalTickerSymbol);
        if (stockData !== undefined) {
          setPrice(stockData.price);
          setDiff(stockData.diff);
          setChange(stockData.change);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (!companyName || !price || !change) {
      fetchData();
    }
  }, []);

  return (
    <Link
      to={`StockDetail/${tickerSymbol}`}
      onClick={() => addToRecentSearchesList(tickerSymbol)}
    >
      <HStack
        borderRadius={10}
        borderWidth={2}
        px={2}
        display={"grid"}
        gridTemplateColumns={"50px auto auto 1fr"}
      >
        <img
          style={{ justifySelf: "center" }}
          src={`https://logos.stockanalysis.com/${tickerSymbol.toLowerCase()}.svg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = `https://img.shields.io/badge/${tickerSymbol}-blue`;
          }}
        />

        <Divider orientation="vertical" />
        <Box >{companyName}</Box>
        <Stat marginLeft={"auto"}>
          <StatNumber>{price}</StatNumber>
          <StatHelpText
            whiteSpace={"nowrap"}
            color={change > 0 ? "#15803d" : "#dc2626"}
            fontWeight={"bold"}
          >
            <StatArrow type={change > 0 ? "increase" : "decrease"} />
            {diff ? `${diff} (${change}%)` : `${change}%`}
          </StatHelpText>
        </Stat>
      </HStack>
    </Link>
  );
}
