import { Box, Heading, Stack } from "@chakra-ui/react";
import TickerBlock from "./TickerBlock";

export default function RecentSearches({
  recentSearchesList,
}: {
  recentSearchesList: string[];
}) {
  return (
    <Stack>
      <Heading size="lg">Recent Searches</Heading>
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gridGap="20px">
        {recentSearchesList.map((item, index) => (
          <TickerBlock key={index} tickerSymbol={item} />
        ))}
      </Box>
    </Stack>
  );
}
