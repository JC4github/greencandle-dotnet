export interface Report {
  id: number;
  email: string;
  mdString: string;
  ticker: string;
}

export interface UserInfo {
  email: string;
  uid: string;
}

export interface SearchReturn {
  status: string;
  companyName: string;
  companyTicker: string;
}

export interface TrendingItem {
  companyTicker: string;
  companyName: string;
  price: number;
  change: number;
}

export interface CapDataItem {
  companyTicker: string;
  companyName: string;
  price: number;
  change: number;
}

export interface ChartInstanceInfo {
  Date: string;
  Price: any;
}
