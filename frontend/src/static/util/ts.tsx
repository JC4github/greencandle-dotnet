export default function addToRecentSearchesList(tickerSymbol: string) {
    let recentSearchesList: string[] = JSON.parse(localStorage.getItem("recentSearchesList") ?? "[]");
    let indexOf = recentSearchesList.indexOf(tickerSymbol);
    indexOf != -1 ? recentSearchesList.splice(indexOf, 1) : recentSearchesList.length >= 10 ? recentSearchesList.pop() : null;
    recentSearchesList.unshift(tickerSymbol);
    localStorage.setItem('recentSearchesList', JSON.stringify(recentSearchesList));
}

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

export function transformData(originalList: any[], period: string) {
    let format = '';
    switch (period) {
        case "1D":
            format = `LT`
            break;
        case "5D":
        case "1M":
        case "YTD":
        case "1Y":
        default:
            format = `MMM D, h:mm A`
            break;
    }

    const transformedList = originalList.map(item => ({
        Date: dayjs(item.t * 1000).utc().format(format),
        Price: item.c
    }))
    return transformedList;
}