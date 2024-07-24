import { CapDataItem, SearchReturn, TrendingItem } from "../../types/entities";
import { transformData } from "./ts";

const server = [
  "https://greencandleapi.azurewebsites.net/api",
  "http://localhost:3000",
];

/**
 * To Get Relative Company Result and Stock Result By Ticker Symbol
 * @param ticker Ticker Symbol
 * @returns
 */
export const TryCompanyListByTicker = async (ticker: string) => {
  ticker = ticker.toLocaleUpperCase();
  let url = `https://stockanalysis.com/api/search?q=${ticker}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    const typedResponseData: SearchReturn[] = response.data.map(
      (entry: { s: string; t: string; n: string }) => {
        return {
          status: entry.t,
          companyTicker: entry.s,
          companyName: entry.n,
        };
      }
    );
    const stockList = typedResponseData.filter((entry: SearchReturn) => {
      return entry.status == "s";
    });
    return stockList;
  } catch (e) {
    console.error(`TryCompanyByTicker() ${e}`);
    return false;
  }
};

/**
 * Find a most relative stock By Ticker Symbol
 * @param ticker Ticker Symbol
 * @returns
 */
export const TryCompanyByTicker = async (ticker: string) => {
  ticker = ticker.toLocaleUpperCase();
  let url = `https://stockanalysis.com/api/search?q=${ticker}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    const stockList = response.data.filter(
      (entry: { t: string; n: string; s: string }) => {
        return entry.t == "s" && entry.s === ticker;
      }
    );
    return stockList
      ? {
          tickerSymbol: stockList[0].s as string,
          tickerName: stockList[0].n as string,
        }
      : false;
  } catch (e) {
    console.error(`TryCompanyByTicker() ${e}`);
    return false;
  }
};

/**
 * Get Stock's Price, Change and ChangePercentage By Ticker Symbol
 * @param ticker Ticker Symbol
 * @returns
 */
export const GetStockByTicker = async (ticker: string) => {
  ticker = ticker.toLocaleLowerCase();
  let url = `https://stockanalysis.com/api/quotes/s/${ticker}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    return {
      price: response.data.p as number,
      diff: response.data.c as number,
      change: response.data.cp as number,
    };
  } catch (e) {
    console.error(`GetStockByTicker() ${e}`);
  }
};
/**
 * Get complete information about a stock by its ticker
 * @param ticker Ticker Symbol
 * @returns
 */
export const GetCompleteStockByTicker = async (ticker: string) => {
  ticker = ticker.toLocaleLowerCase();
  let url = `https://stockanalysis.com/api/quotes/s/${ticker}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    return {
      price: response.data.p,
      diff: response.data.c,
      change: response.data.cp,
      volume: response.data.v,
      openingPrice: response.data.o,
      closingPrice: response.data.cl,
      daysRangeEnd: response.data.h,
      daysRangeStart: response.data.l,
      marketOpen:response.data.u,
      week52RangeEnd: response.data.h52,
      week52RangeStart: response.data.l52,
      market: response.data.ex,
      marketStatus: response.data.ms
    };
  } catch (e) {
    console.error(`GetStockByTicker() ${e}`);
  }
};

/**
 * Fetch Most views Stocks List that contains ticker symbol, company name, price, changePercent.
 * @param count default 50, Top 50
 * @returns
 */
export const GetTrendingList = async (count: number = 50) => {
  let url = `https://stockanalysis.com/api/screener/s/f?m=views&s=desc&c=no,s,n,price,change&cn=${count}&f=marketCap-notzero&i=stocks`;
  // let url = `https://stockanalysis.com/api/index/trending`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    const trendingList: TrendingItem[] = response.data.data.map(
      (entry: {
        no: number;
        s: string;
        n: string;
        price: number;
        change: number;
      }) => {
        return {
          number: entry.no,
          companyTicker: entry.s,
          companyName: entry.n,
          price: entry.price,
          change: entry.change,
        };
      }
    );
    return trendingList;
  } catch (e) {
    console.error(`GetTrendingList() ${e}`);
  }
};

/**
 * Fetch Most Market Cap Stocks List that contains ticker symbol, company name, price, changePercent.
 * @param count default 50, Top 50
 * @returns
 */
export const GetMostCapList = async (count: number = 50) => {
  let url = `https://stockanalysis.com/api/screener/s/f?m=marketCap&s=desc&c=no,s,n,price,change&cn=${count}&i=stocks`;
  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    const capDataList: CapDataItem[] = response.data.data.map(
      (entry: {
        no: number;
        s: string;
        n: string;
        price: number;
        change: number;
      }) => {
        return {
          number: entry.no,
          companyTicker: entry.s,
          companyName: entry.n,
          price: entry.price,
          change: entry.change,
        };
      }
    );
    return capDataList;
  } catch (e) {
    console.error(`GetMostCapList() ${e}`);
  }
};

export const GetChartData = async (tickerSymbol: string, period: string) => {
  let url = `https://stockanalysis.com/api/charts/s/${tickerSymbol.toLocaleLowerCase()}`;
  switch (period) {
    case "1D":
      url = `${url}/1D/l`;
      break;
    case "5D":
      url = `${url}/5D/l`;
      break;
    case "1M":
      url = `${url}/1M/l`;
      break;
    case "YTD":
      url = `${url}/YTD/l`;
      break;
    case "1Y":
      url = `${url}/1Y/l`;
      break;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
    }).then((res) => {
      return res.json();
    });
    return transformData(response.data, period);
  } catch (e) {
    console.error(`Get1DayChart() ${e}`);
  }
};

export const GetReport = async (tickerSymbol: string) => {
  const url = `${server[0]}/ai/${tickerSymbol}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      return res.json();
    });
    console.log(response.content);
    return response.content;
  } catch (e) {
    console.error(`GetReport() ${e}`);
  }
};
