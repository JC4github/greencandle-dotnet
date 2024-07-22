import {
  Button,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Chart from "./components/Chart";
import { useEffect, useState } from "react";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { RepeatIcon } from "@chakra-ui/icons";
import InformationDisplay from "./components/InformationDisplay";

interface stockDetailData {
  tickerSymbol: string;
}

export async function loader({ params }: any) {
  const tickerSymbol = params.tickerSymbol as string;
  return { tickerSymbol };
}

export default function StockDetail() {
  const navigate = useNavigate();
  const { tickerSymbol } = useLoaderData() as stockDetailData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userEmail, setUserEmail] = useState<string>();
  useEffect(() => {
    const email = localStorage.getItem("UserEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  function clickHandle() {
    if (userEmail) {
      navigate(`/StockDetail/${tickerSymbol}/report`);
    } else {
      onOpen();
    }
  }

  return (
    <VStack spacing={4} align="stretch" style={{ flex: 1 }}>
      <Box border="1px solid" borderColor="green" boxShadow="lg" p="2" borderRadius="15px">
      <Tabs align="end" variant="soft-rounded" colorScheme="green" isFitted>
        <TabList mb="1em">
          <HStack justifyContent="space-between" width="full">
            <Text fontSize="2xl" fontWeight="bold">
              {tickerSymbol}
            </Text>
            <HStack spacing={4}>
              <Tab 
                _selected={{ color: "white", bg: "green.400", borderColor: "green.400" }}
                border="1px solid" borderColor="gray.300"
              >1D</Tab>
              <Tab 
                _selected={{ color: "white", bg: "green.400", borderColor: "green.400" }}
                border="1px solid" borderColor="gray.300"
              >5D</Tab>
              <Tab 
                _selected={{ color: "white", bg: "green.400", borderColor: "green.400" }}
                border="1px solid" borderColor="gray.300"
              >1M</Tab>
              <Tab 
                _selected={{ color: "white", bg: "green.400", borderColor: "green.400" }}
                border="1px solid" borderColor="gray.300"
              >YTD</Tab>
              <Tab 
                _selected={{ color: "white", bg: "green.400", borderColor: "green.400" }}
                border="1px solid" borderColor="gray.300"
              >1Y</Tab>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Chart tickerSymbol={tickerSymbol} period="1D" />
          </TabPanel>
          <TabPanel>
            <Chart tickerSymbol={tickerSymbol} period="5D" />
          </TabPanel>
          <TabPanel>
            <Chart tickerSymbol={tickerSymbol} period="1M" />
          </TabPanel>
          <TabPanel>
            <Chart tickerSymbol={tickerSymbol} period="YTD" />
          </TabPanel>
          <TabPanel>
            <Chart tickerSymbol={tickerSymbol} period="1Y" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
      <Box mt={8}> 
        <InformationDisplay tickerSymbol={tickerSymbol} />
      </Box>
      <Box mt={2} mb={6} style={{ textAlign: "center" }}>
      <Button
        color="white"
        backgroundColor="green"
        _hover={{ backgroundColor: 'rgba(116, 170, 156, 0.8)' }}
        leftIcon={<RepeatIcon />}
        rightIcon={<sup>by GPT</sup>}
        onClick={clickHandle}
        size="lg" // Larger size preset
        padding="24px" // Custom padding
        fontSize="24px" // Larger font size
        height="auto" // Adjust height as needed based on content
      >
          Generate Due Diligence Report
        </Button>
      </Box>
      <ConfirmationDialog isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}
