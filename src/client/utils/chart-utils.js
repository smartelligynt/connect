import {timeDay, timeHour, timeMinute, timeSecond} from "d3-time";

const timeIntervals = {
  dd: timeDay,
  hh: timeHour,
  mm: timeMinute,
  ss: timeSecond
};

const _getTimeInterval = (interval) => {
  return timeIntervals[interval];
}
const _getXDomain = (chartData, accessor, interval) => {
  if (chartData && chartData.length > 0) {
    const domain = d3.extent(chartData, accessor);
    //Create chart with 10 intervals, even if there is not enough data to cover 10 intervals
    if (interval.count(...domain) < 10) {
      return [domain[0], interval.offset(domain[0], 10)];
    } else {
      return domain;
    }
  } else {
    //If no data to show, create empty chart for atleast 10 intervals
    return [interval(new Date()), interval.offset(new Date(), 10)];
  }
}
const _getYDomain = (chartData) => {
  return undefined;
}
const _getDomainAndTicks = (options, type) => {
  const {data, interval, accessor, tickStart} = options;
  const timeInterval = _getTimeInterval(interval);
  let domain;
  let ticks;
  if (type === "x") {
    domain = _getXDomain(data, accessor, timeInterval);
  } else {
    domain = _getYDomain(data, accessor, timeInterval);
  }
  //For now support ticks only if a time interval has been provided
  //3 is the gap between 2 ticks
  if (timeInterval) {
    ticks = timeInterval.range.apply(null, [tickStart || domain[0], domain[1], 3]);
  }
  return {domain, ticks};
}

export const getDomainsAndTicks = (options) => {
  console.log("in the utils.....");
  const {data, xInterval, xAccessor, yInterval, yAccessor, xTickStart, yTickStart} = options;
  const {domain: xDomain, ticks: xTickValues} = _getDomainAndTicks(
    {data, accessor: xAccessor, interval: xInterval, tickStart: xTickStart}, "x"
  );
  const {domain: yDomain, ticks: yTicksValues} = _getDomainAndTicks(
    {data, accessor: yAccessor, interval: yInterval, tickStart: yTickStart}, "y"
  );
  return {xDomain, xTickValues, yDomain, yTicksValues};
}
