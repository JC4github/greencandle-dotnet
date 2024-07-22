import { Button } from "@chakra-ui/react";
import addToRecentSearchesList from "../../static/util/ts";
import { Link } from "react-router-dom";

export default function ResultButton({
  tickerSymbol,
  companyName,
}: {
  tickerSymbol: string;
  companyName: string;
}) {
  return (
      <Link
        to={`StockDetail/${tickerSymbol.toLocaleUpperCase()}`}
        onClick={() => addToRecentSearchesList(tickerSymbol)}
      >
         <Button m={1}>
        [{tickerSymbol.toLocaleUpperCase()}] {companyName}
      </Button>
      </Link>
  );
}