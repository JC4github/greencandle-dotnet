import { useEffect, useState } from "react";
import { GetTrendingList } from "../../static/util/api";
import { Box, Heading, Flex, Stack } from "@chakra-ui/react";
import IndexTickerBlock from "./IndexTickerBlock";
import { TrendingItem } from "../../types/entities";

export default function TrendingStocks({
  recentSearchesList,
  count,
}: {
  recentSearchesList: string[];
  count:number;
}) {
  const [trendingList, setTrendingList] = useState<TrendingItem[]>([]);

  useEffect(() => {
    async function fetchTrendingList() {
      if (recentSearchesList.length === 0) {
        try {
          const trendingList = await GetTrendingList(count);
          setTrendingList(trendingList ?? []);
        } catch (error) {
          console.log("Error fetching trending list in index full screen");
        }
      }
    }

    fetchTrendingList();
  }, [recentSearchesList.length]);

  return (
    <Stack spacing={4}>
      <Heading size="lg">{recentSearchesList.length > 0 ? "Recent Searches" : "Trending Stocks"}</Heading>
      <Box
       overflowX="auto" 
        paddingX="4" 
        minHeight="100px">
      <Flex>
          {recentSearchesList.length > 0 && recentSearchesList.map((item, index) => (
            <Box key={index} minWidth="320px" marginRight="2">
              <IndexTickerBlock key={index} tickerSymbol={item} />
            </Box>
          ))}
          {recentSearchesList.length === 0 && trendingList.map((item, index) => (
            <Box key={index} minWidth="320px" marginRight="2">
              <IndexTickerBlock
                tickerSymbol={item.companyTicker}
                companyName={item.companyName}
                price={item.price}
                change={item.change}
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </Stack>
  );
}
