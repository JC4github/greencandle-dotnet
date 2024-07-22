import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Select,
  Spacer,
} from "@chakra-ui/react";
import ListTickerBlock from "./ListTickerBlock";
import { GetTrendingList, GetMostCapList } from "../../static/util/api";
import { CapDataItem, TrendingItem } from "../../types/entities";

interface ListTrendingDataProps {
  count?: number;
}

export default function ListTrendingData({
  count: numCount,
}: ListTrendingDataProps) {
  const [count, setCount] = useState<number>(numCount ?? 10);
  const [trendingList, setTrendingList] = useState<TrendingItem[]>([]);
  const [mostCapList, setMostCapList] = useState<CapDataItem[]>([]);
  const [lossGainFilter, setLossGainFilter] = useState<string>("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const trendingData = await GetTrendingList(count);
        setTrendingList(trendingData ?? []);
        const capData = await GetMostCapList(count);
        setMostCapList(capData ?? []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, [count]);


  return (
    <Box p={5} shadow="lg" rounded="lg" bg="white">
      <Tabs variant="unstyled" align="start">
        <TabList
          border="2px solid green.500"
          roundedTop="lg"
          display="flex"
          justifyContent="space-between"
        >
          <Tab
            _selected={{
              bg: "green.50",
              borderColor: "green.500",
              borderWidth: "2px",
              borderTopRightRadius: "lg",
              borderTopLeftRadius: "lg",
              borderBottomColor: "transparent",
              fontWeight: "bold",
              zIndex: 1,
            }}
            _hover={{ bg: "green.100" }}
          >
            Trending Stocks
          </Tab>
          <Tab
            _selected={{
              bg: "green.50",
              borderColor: "green.500",
              borderWidth: "2px",
              borderTopRightRadius: "lg",
              borderTopLeftRadius: "lg",
              borderBottomColor: "transparent",
              fontWeight: "bold",
              zIndex: 1,
            }}
            _hover={{ bg: "green.100" }}
          >
            Most Market Cap Stocks
          </Tab>
          <Spacer />
          <Tab isDisabled _disabled={{ opacity: 1, cursor: "default", color: "black" }}>
            <Select
              w="auto"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </Tab>
          <Tab isDisabled _disabled={{ opacity: 1, cursor: "default", color: "black" }}>
            <Select
              w="auto"
              value={lossGainFilter}
              onChange={(e) => setLossGainFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Loss">Loss</option>
              <option value="Gain">Gain</option>
            </Select>
          </Tab>
        </TabList>

        <TabPanels
          bg="green.50"
          borderColor="green.500"
          borderWidth="2px"
          borderBottomRadius="lg"
        >
          <TabPanel>
            <VStack spacing={4} width="100%">
              <Heading size="lg">Trending Stocks</Heading>
              <Box width="100%" overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Rank</Th>
                      <Th>Logo</Th>
                      <Th>Company Name</Th>
                      <Th>Ticker Symbol</Th>
                      <Th></Th>
                      <Th>Price</Th>
                      <Th>Change</Th>
                      <Th>Opening Price</Th>
                      <Th>Closing Price</Th>
                      <Th>Volume</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {trendingList.map((item, index) => (
                      <ListTickerBlock
                        key={`${index}-${lossGainFilter}`}
                        index={index + 1}
                        tickerSymbol={item.companyTicker}
                        companyName={item.companyName}
                        price={item.price}
                        change={item.change}
                        lossGainFilter= {lossGainFilter}
                      />
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} width="100%">
              <Heading size="lg">Most Market Cap Stocks</Heading>
              <Box width="100%" overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Rank</Th>
                      <Th>Logo</Th>
                      <Th>Company Name</Th>
                      <Th>Ticker Symbol</Th>
                      <Th></Th>
                      <Th>Price</Th>
                      <Th>Change</Th>
                      <Th>Opening Price</Th>
                      <Th>Closing Price</Th>
                      <Th>Volume</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mostCapList.map((item, index) => (
                      <ListTickerBlock
                        key={`${index}-${lossGainFilter}`}
                        index={index + 1}
                        tickerSymbol={item.companyTicker}
                        companyName={item.companyName}
                        price={item.price}
                        change={item.change}
                        lossGainFilter={lossGainFilter}
                      />
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
