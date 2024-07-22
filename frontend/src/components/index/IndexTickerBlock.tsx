import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Stat,
  StatLabel,
  StatArrow,
  LinkBox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { GetStockByTicker, TryCompanyByTicker } from "../../static/util/api";
import addToRecentSearchesList from "../../static/util/ts";

export default function IndexTickerBlock({
  tickerSymbol: initialTickerSymbol,
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
  const [tickerSymbol, setTickerSymbol] = useState<string>(initialTickerSymbol);
  const [companyName, setCompanyName] = useState<string>(initialCompanyName);
  const [price, setPrice] = useState<number>(initialPrice);
  const [diff, setDiff] = useState<number>(initialDiff);
  const [change, setChange] = useState<number>(initialChange);
  const [displayPrice, setDisplayPrice] = useState<boolean>(true);
  const [animation, setAnimation] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await TryCompanyByTicker(initialTickerSymbol);
        if (result) {
          setTickerSymbol(result.tickerSymbol);
          setCompanyName(result.tickerName);
        }
        const stockData = await GetStockByTicker(initialTickerSymbol);
        if (stockData) {
          setPrice(stockData.price);
          setDiff(stockData.diff);
          setChange(stockData.change);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [initialTickerSymbol]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        setDisplayPrice(!displayPrice);
        setAnimation(false);
      }, 300);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [displayPrice]);

  return (
    <LinkBox
      as={RouterLink}
      to={`StockDetail/${tickerSymbol}`}
      onClick={() => addToRecentSearchesList(tickerSymbol)}
    >
      <HStack
        bg="white"
        borderRadius="full"
        borderWidth={2}
        p={2}
        align="center"
        spacing={4}
      >
        <Image
          boxSize="50px"
          src={`https://logos.stockanalysis.com/${tickerSymbol.toLowerCase()}.svg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = `https://img.shields.io/badge/${tickerSymbol}-blue`;
          }}
        />
        <VStack spacing={2} align="stretch">
          <Box color="black" fontSize="lg" fontWeight="bold">
            {companyName}
          </Box>
          <Stat>
            <StatLabel>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={change > 0 ? "green.500" : "red.500"}
                position="relative"
                transition="transform 0.3s, opacity 0.3s"
                transform={animation ? "translateY(100%)" : "translateY(0)"}
                opacity={animation ? 0 : 1}
              >
                {displayPrice ? (
                  `${price} USD`
                ) : (
                  <>
                    {change > 0 ? (
                      <StatArrow type="increase" color="green.500" />
                    ) : (
                      <StatArrow type="decrease" color="red.500" />
                    )}
                    {`${diff} (${change}%)`}
                  </>
                )}
              </Text>
            </StatLabel>
          </Stat>
        </VStack>
      </HStack>
    </LinkBox>
  );
}
