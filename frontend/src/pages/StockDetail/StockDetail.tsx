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
    <VStack spacing={4} align="stretch" style={{ flex: 1, padding: 10 }}>
      <Box border="1px solid" borderColor="green" boxShadow="lg" p="0" borderRadius="15px">
        <Tabs variant="soft-rounded" colorScheme="green" isFitted>
          <Box display={{ base: "block", md: "flex" }} flexDirection={{ base: "column", md: "row" }} mb="1em" pl={8} pt={8} pr={8}>
            <Text fontSize="2xl" fontWeight="bold" mb={{ base: 2, md: 0 }} mr="10px" mt="5px">
              {tickerSymbol}
            </Text>
            <TabList
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              mt={{ base: 2, md: 0 }}
              width={{ base: "100%", md: "auto" }}
            >
              <HStack spacing={4} width="full">
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
            </TabList>
          </Box>
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
          width={{ base: "80%", sm: "70%", md: "60%" }} // Responsive width
          name="generate-report-button"
          padding="24px"
          fontSize={{ base: "md", sm: "lg", md: "2xl" }} 
          height="auto"
        >
          Generate Due Diligence Report
        </Button>
      </Box>
      <ConfirmationDialog isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}
