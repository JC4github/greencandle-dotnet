import { useState } from "react";
import { Stack, Button } from "@chakra-ui/react";
import TrendingStocks from "./components/TrendingStocks";
import MostMarketCapStocks from "./components/MostMarketCapStocks";
import RecentSearches from "./components/RecentSearches";
import { useLoaderData } from "react-router-dom";
import FullScreenSearch from "../../components/index/FullScreenSearch";
import ListTrendingData from "../../components/index/ListTrendingData";

interface StoredData {
  stored: string[];
}

export async function loader() {
  let stored: string | null = localStorage.getItem("recentSearchesList");
  stored = !stored ? [] : JSON.parse(stored);
  return { stored };
}

export default function Index() {
  const { stored } = useLoaderData() as StoredData;
  const [showLegacyData, setShowLegacyData] = useState(false);

  const toggleView = () => {
    setShowLegacyData(!showLegacyData);
  };

  return (
    <Stack spacing={10} mb="20">
      <FullScreenSearch recentSearchesList={stored}/>
      {showLegacyData ? (
        <>
          <RecentSearches recentSearchesList={stored} />
          <TrendingStocks count={20} />
          <MostMarketCapStocks count={20} />
        </>
      ) : (
        
        <>
          <ListTrendingData count={20} />
        </>
      )}
      <Button onClick={toggleView}>
        {showLegacyData ? "Show Standard Display" : "Show Legacy Dsiplay"}
      </Button>
    </Stack>
  );
}
