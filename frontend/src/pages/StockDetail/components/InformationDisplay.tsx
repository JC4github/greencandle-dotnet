import { useEffect, useState } from 'react';
import { VStack, HStack, Image, Text, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { GetCompleteStockByTicker, TryCompanyByTicker } from '../../../static/util/api';


interface Range {
    start: number | string;
    end: number | string;
}

export default function InformationDisplay({
    tickerSymbol: initialTickerSymbol
}: { tickerSymbol: string; }) {
    const [tickerSymbol, setTickerSymbol] = useState(initialTickerSymbol);
    const [companyName, setCompanyName] = useState("N/A");
    const [price, setPrice] = useState<number | string>("N/A");
    const [diff, setDiff] = useState<number | string>("N/A");
    const [change, setChange] = useState<number | string>("N/A");
    const [volume, setVolume] = useState<number | string>("N/A");
    const [openingPrice, setOpeningPrice] = useState<number | string>("N/A");
    const [closingPrice, setClosingPrice] = useState<number | string>("N/A");
    const [daysRange, setDaysRange] = useState<Range>({ start: "N/A", end: "N/A" });
    const [week52Range, setWeek52Range] = useState<Range>({ start: "N/A", end: "N/A" });
    const [market, setMarket] = useState("N/A");
    const [marketStatus, setMarketStatus] = useState("N/A");

    const bg = useColorModeValue("green.50", "green.800");
    const positiveColor = useColorModeValue("green.700", "green.200");
    const negativeColor = "red.500"; // red color for negative changes

    const priceColor = typeof change === 'number' && change < 0 ? negativeColor : positiveColor;

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await TryCompanyByTicker(initialTickerSymbol);
                if (result) {
                    setTickerSymbol(result.tickerSymbol ?? "N/A");
                    setCompanyName(result.tickerName ?? "N/A");
                }
                const stockData = await GetCompleteStockByTicker(initialTickerSymbol);
                if (stockData) {
                    setPrice(stockData.price ?? "N/A");
                    setDiff(stockData.diff ?? "N/A");
                    setChange(stockData.change ?? "N/A");
                    setVolume(stockData.volume ?? "N/A");
                    setOpeningPrice(stockData.openingPrice ?? "N/A");
                    setClosingPrice(stockData.closingPrice ?? "N/A");
                    setDaysRange({
                        start: stockData.daysRangeStart ?? "N/A",
                        end: stockData.daysRangeEnd ?? "N/A"
                    });
                    setWeek52Range({
                        start: stockData.week52RangeStart ?? "N/A",
                        end: stockData.week52RangeEnd ?? "N/A"
                    });
                    setMarket(stockData.market ?? "N/A");
                    setMarketStatus(stockData.marketStatus ?? "N/A");
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [initialTickerSymbol]);

    const showContent = useBreakpointValue({ base: false, md: true });

    return (
        <HStack bg={bg} borderRadius="lg" borderWidth={2} borderColor="green.300" p={4} spacing={6} align="center" justify="space-between">
            {showContent && <Image
                boxSize="120px"
                src={`https://logos.stockanalysis.com/${tickerSymbol.toLowerCase()}.svg`}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = `https://img.shields.io/badge/${tickerSymbol}-blue`;
                  }}
            />}
            <VStack spacing={2} align="start">
                <Text fontSize="3xl" fontWeight="bold" color={positiveColor}>{companyName} ({tickerSymbol})</Text>
                <Text fontSize="md" color={positiveColor}>Market: {market} | Status: {marketStatus}</Text>
            </VStack>
            <VStack spacing={1} align="start">
                <Stat>
                    <StatLabel fontSize="xl" color={priceColor}>Current Price</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={priceColor}>${typeof price === "number" ? price.toFixed(2) : price}</StatNumber>
                    <StatHelpText fontSize="md" color={priceColor}>
                        <StatArrow type={typeof change === 'number' && change >= 0 ? 'increase' : 'decrease'} mr={2} color={priceColor} />
                        {typeof change === "number" ? change.toFixed(2) : change}% ({typeof diff === "number" ? diff.toFixed(2) : diff})
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel fontSize="xl" color={positiveColor}>Volume</StatLabel>
                    <StatNumber fontSize="xl" color={positiveColor}>{typeof volume === "number" ? volume.toLocaleString() : volume}</StatNumber>
                </Stat>
            </VStack>
            {showContent && <VStack spacing={1} align="start">
                <Text fontSize="md" color={positiveColor}>Open: ${typeof openingPrice === "number" ? openingPrice.toFixed(2) : openingPrice}</Text>
                <Text fontSize="md" color={positiveColor}>Close: ${typeof closingPrice === "number" ? closingPrice.toFixed(2) : closingPrice}</Text>
                <Text fontSize="md" color={positiveColor}>Day's Range: ${typeof daysRange.start === "number" ? daysRange.start.toFixed(2) : daysRange.start} - ${typeof daysRange.end === "number" ? daysRange.end.toFixed(2) : daysRange.end}</Text>
                <Text fontSize="md" color={positiveColor}>52-Week Range: ${typeof week52Range.start === "number" ? week52Range.start.toFixed(2) : week52Range.start} - ${typeof week52Range.end === "number" ? week52Range.end.toFixed(2) : week52Range.end}</Text>
            </VStack>}
        </HStack>
    );
}
