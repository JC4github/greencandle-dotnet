import "../../../static/css/AnimatedBanner.css";
import { useEffect, useState } from "react";
import { GetTrendingList } from "../../../static/util/api";
import Marquee from "react-fast-marquee";
import { TrendingItem } from "../../../types/entities";

export default function AnimatedBanner() {
  const [trendingList, setTrendingList] = useState<TrendingItem[]>([]);

  useEffect(() => {
    async function fetchTrendingList() {
      try {
        const trendingList = await GetTrendingList(10);
        setTrendingList(trendingList ?? []);
      } catch (error) {}
    }

    fetchTrendingList();
  }, []);

  return (
    <div className="banner-container">
      <Marquee>
        {trendingList.map((item) => (
          <div className="ticker" key={item.companyName}>
            <span className="ticker-name">{item.companyName}</span>
            <span
              className={
                item.change > 0
                  ? "ticker-change-positive"
                  : "ticker-change-negative"
              }
            >
              {item.change}%
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
