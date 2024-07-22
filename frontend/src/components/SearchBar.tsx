import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { TryCompanyListByTicker } from "../static/util/api";
import ResultButton from "./submodules/ResultButton";
import { SearchReturn } from "../types/entities";

export default function SearchBar() {
  // Search Bar Input Value
  const [inputValue, setInputValue] = useState<string>("");
  // Contorl Autofill Status
  const { isOpen, onOpen, onClose } = useDisclosure();
  // List for render search results
  const [resultList, setResultList] = useState<SearchReturn[]>([]);
  // Avoid Search Same Thing Twice
  const [lastSearch, setLastSearch] = useState<string>("");

  return (
    <Stack spacing={0}>
      {/* search input bar */}
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="black" />
        </InputLeftElement>
        <Input
          color="white"
          bg="gray.100"
          fontWeight="bold"
          placeholder="Search (e.g., AAPL)"
          textColor="black"
          onFocus={() => onOpen()}
          onBlur={() =>
            setTimeout(() => {
              onClose();
            }, 300)
          }
          value={inputValue}
          onChange={async (event) => {
            // Change search bar input value
            setInputValue(event.target.value);

            // If value input length <= 1 or value is same as last search value, do nothing. Avoid fetch massive data. Fetch massiv data will make browser lag.
            if (
              event.target.value.length >= 1 &&
              event.target.value != lastSearch
            ) {
              setLastSearch(event.target.value);

              // Fetch relative result
              const result = await TryCompanyListByTicker(event.target.value);
              if (result !== false) {
                setResultList(result);
              }
            }
          }}
        />
      </InputGroup>
      {/* autofill bar */}
      <Box height={0} zIndex="9999">
        <Collapse in={isOpen} animateOpacity>
          <Box
            p="10px"
            bg="white"
            rounded="md"
            shadow="md"
            borderWidth={2}
            maxHeight={200}
            overflowY={"auto"}
          >
            {resultList.map((result, index) => (
              <ResultButton
                key={index}
                tickerSymbol={result.companyTicker}
                companyName={result.companyName}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
    </Stack>
  );
}
