import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Tr, Td, Stat, StatArrow } from "@chakra-ui/react";
import {
  GetCompleteStockByTicker,
  TryCompanyByTicker,
} from "../../static/util/api";
import addToRecentSearchesList from "../../static/util/ts";

export default function ListTickerBlock({
  index,
  tickerSymbol: initialTickerSymbol,
  companyName: initialCompanyName = "",
  price: initialPrice = 0,
  diff: initalDiff = 0,
  change: initialChange = 0,
  lossGainFilter: initialLossGainFilter = "All",
}: {
  index: number;
  tickerSymbol: string;
  companyName: string;
  price: number;
  diff?: number;
  change: number;
  lossGainFilter?: string;
}) {
  const [tickerSymbol, _setTickerSymbol] = useState(initialTickerSymbol);
  const [companyName, setCompanyName] = useState(initialCompanyName || "N/A");
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(initialChange);
  const [volume, setVolume] = useState(0);
  const [openingPrice, setOpeningPrice] = useState(0);
  const [diff, setDiff] = useState(initalDiff);
  const [closingPrice, setClosingPrice] = useState(0);
  const [lossGainFilter, _setLossGainFilter] = useState(initialLossGainFilter);

  useEffect(() => {
    async function fetchData() {
      if (initialTickerSymbol) {
        try {
          const companyResult = await TryCompanyByTicker(initialTickerSymbol);
          setCompanyName(companyResult ? companyResult.tickerName : "N/A");

          const stockResult = await GetCompleteStockByTicker(initialTickerSymbol);
          if (stockResult) {
            setPrice(stockResult.price || 0);
            setChange(stockResult.change || 0);
            setVolume(stockResult.volume || 0);
            setOpeningPrice(stockResult.openingPrice || 0);
            setClosingPrice(stockResult.closingPrice || 0);
            setDiff(stockResult.diff || 0);
          }
        } catch (error) {
          console.error("Fetching stock data error:", error);
        }
      }
    }

    fetchData();
  }, [initialTickerSymbol]);

  const shouldRender = () => {
    switch (lossGainFilter) {
      case "Loss":
        return change <= 0;
      case "Gain":
        return change >= 0;
      default:
        return true;
    }
  };

  const textColor = change > 0 ? "green.500" : "red.500";
  const navigate = useNavigate();

  const navigateToDetail = () => {
    addToRecentSearchesList(tickerSymbol);
    navigate(`/StockDetail/${tickerSymbol}`);
  };

  const formatNumber = (num: number | null | undefined): string => {
    return num === null || num === undefined || isNaN(num) ? "N/A" : num.toLocaleString();
  };
  
  const formatPrice = (num: number | null | undefined): string => {
    return num === null || num === undefined || isNaN(num) ? "N/A" : `$${num.toFixed(2)}`;
  };
  

  return shouldRender() ? (
    <Tr onClick={navigateToDetail} style={{ cursor: 'pointer' }}>
      <Td>{index}</Td>
      <Td>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img
            style={{ width: "30px", height: "30px" }}
            src={`https://logos.stockanalysis.com/${tickerSymbol.toLowerCase()}.svg`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = `https://img.shields.io/badge/${tickerSymbol}-blue`;
            }}
          />
        </div>
      </Td>
      <Td>{companyName}</Td>
      <Td>{tickerSymbol}</Td>
      <Td>
        <Stat>
          <StatArrow type={change > 0 ? "increase" : "decrease"} />
        </Stat>
      </Td>
      <Td color={textColor}>{formatPrice(price)}</Td>
      <Td color={textColor}>{`${formatPrice(diff)} (${change}%)`}</Td>
      <Td color={textColor}>{formatPrice(openingPrice)}</Td>
      <Td color={textColor}>{formatPrice(closingPrice)}</Td>
      <Td>{formatNumber(volume)}</Td>
    </Tr>
  ) : null;
}
