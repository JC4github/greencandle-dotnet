import { useEffect, useState } from "react";
import { GetMostCapList } from "../../../static/util/api";
import TickerBlock from "./TickerBlock";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { CapDataItem } from "../../../types/entities";

interface MostMarketCapStocksProrps {
  count?: number;
}

export default function MostMarketCapStocks({
  count: numCount,
}: MostMarketCapStocksProrps) {
  const [count, _setCount] = useState<number>(numCount ?? 10);
  const [mostCapList, setMostCapList] = useState<CapDataItem[]>([]);

  useEffect(() => {
    async function fetchMostCapList() {
      try {
        const capData = await GetMostCapList(count);
        setMostCapList(capData ?? []);
      } catch (error) {}
    }

    fetchMostCapList();
  }, []);

  return (
    <Stack>
      <Heading size="lg">Most Market Capacity Stocks</Heading>
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gridGap="20px">
        {mostCapList.map((item, index) => (
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
