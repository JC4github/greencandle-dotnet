import { useEffect, useState } from "react";
import { GetTrendingList } from "../../../static/util/api";
import { Box, Heading, Stack } from "@chakra-ui/react";
import TickerBlock from "./TickerBlock";
import { TrendingItem } from "../../../types/entities";

export default function TrendingStocks({ count = 10 }) {
  const [trendingList, setTrendingList] = useState<TrendingItem[]>([]);

  useEffect(() => {
    async function fetchTrendingList() {
      try {
        const trendingList = await GetTrendingList(count);
        setTrendingList(trendingList ?? []);
      } catch (error) {}
    }

    fetchTrendingList();
  }, []);

  return (
    <Stack>
      <Heading size="lg">Trending Stocks</Heading>
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gridGap="20px">
        {trendingList.map((item, index) => (
          <TickerBlock
            key={index}
            tickerSymbol={item.companyTicker}
            companyName={item.companyName}
            price={item.price}
            change={item.change}
          />
        ))}
      </Box>
    </Stack>
  );
}
