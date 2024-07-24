import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { TryCompanyListByTicker } from "../../static/util/api";
import ResultButton from "../submodules/ResultButton";
import IndexTrendingStocks from "./IndexTrendingStocks";
import { SearchReturn } from "../../types/entities";

export default function FullScreenSearchBar({
  recentSearchesList,
}: {
  recentSearchesList: string[];
}) {
  const [inputValue, setInputValue] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resultList, setResultList] = useState<SearchReturn[]>([]);
  const [lastSearch, setLastSearch] = useState<string>("");

  return (
    <Stack spacing={10} width="100%">
      {" "}
      // Ensure the Stack takes full width
      <InputGroup size="lg" width={{ base: "100%", md: "60%"}}>
        {" "}
        // Ensure InputGroup takes full width
        <InputRightElement
          pointerEvents="none"
          style={{ marginTop: "20px", marginRight: "10px" }}
        >
          <Search2Icon color="black" boxSize="2.5rem" />
        </InputRightElement>
        <Input
          width="100%"
          color="white"
          bg="gray.100"
          fontWeight="bold"
          placeholder="Search a Ticker (e.g., AAPL)"
          textColor="black"
          onFocus={onOpen}
          onBlur={() => setTimeout(onClose, 300)}
          value={inputValue}
          onChange={async (event) => {
            setInputValue(event.target.value);
            if (
              event.target.value.length >= 1 &&
              event.target.value !== lastSearch
            ) {
              setLastSearch(event.target.value);
              const result = await TryCompanyListByTicker(event.target.value);
              if (result !== false) {
                setResultList(result);
              }
            }
          }}
          borderRadius="full"
          height="80px"
          fontSize="1.25rem"
        />
      </InputGroup>
      <Box height={0} zIndex="9999">
        <Collapse in={isOpen} animateOpacity>
          <Box
            p="10px"
            bg="white"
            rounded="md"
            shadow="md"
            borderWidth={2}
            maxHeight={200}
            overflowY="auto"
          >
            {resultList.map((each, index) => (
              <ResultButton
                key={index}
                tickerSymbol={each.companyTicker}
                companyName={each.companyName}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
      <IndexTrendingStocks count={10} recentSearchesList={recentSearchesList} />
    </Stack>
  );
}
