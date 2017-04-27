import React, {PropTypes} from "react";
import {getDomainsAndTicks} from "../utils/chart-utils";
import {timer} from "d3-timer";
import {interpolate} from "d3-interpolate";
import {interpolateDate} from "d3-interpolate";

const __getTickForDomain = (ticks, domain, startIdx = 0) => {
  for (var i = startIdx; i < ticks.length; i++) {
    if (+ticks[i] >= domain[0]) {
      return ticks[i-1] || ticks[i];
    }
  }
};

class SmgntChartTransition extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {chartData: []};
    this._deltaChartData = [];
    this._updateChart = this._updateChart.bind(this);
    this._xAccessor = (d) => d.et;
    this._yAccessor = (d) => d;
    const {device: {chart = {x: {}, y: {}}} = {}} = this.props;
    const {color} = chart;
    const {y: {attr: {name: yName, type: yType, label: yLabel} = {}} = {}} = chart;
    const {x: {interval, attr: {name: xName, type: xType, label: xLabel} = {}} = {}} = chart;
    this._xInterval = interval;
    this._chartSeries = [{field: yName || "ev", name: yLabel, color}];

  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state === nextState);
  }
  componentWillReceiveProps(nextProps) {
    const {chartData: newChartData} = nextProps;
    const {device: {chart: {type = "line"}}} = this.props;
    if (newChartData && newChartData.length > 0) {
      this._deltaChartData = this._deltaChartData.concat(newChartData);
    } else {
      if (type === "state") {
        const {chartData} = this.state;
        const currData = chartData && chartData[chartData.length - 1];
        if (currData) {
          this._deltaChartData = this._deltaChartData.concat([{et: new Date(), ev: currData.ev}]);
        }
      }
    }
    if (!this._updateInterval && this._deltaChartData.length > 0) {
      this._updateChart();
    }
  }
  _updateChart() {
    console.log("in _updateChart.........");
    const {chartData} = this.state;
    const {device: {chart: {type = "line"}}} = this.props;
    const newPoint = this._deltaChartData.shift();
    chartData.push(newPoint);
    this.setState({chartData});
    if (this._deltaChartData && this._deltaChartData.length > 0) {
      console.log("setting update interval");
      this._updateInterval = setTimeout(this._updateChart, 550);
    } else {
      this._updateInterval = null;
    }
    // if (this._deltaChartData && this._deltaChartData.length > 0) {
    //   const currentState = chartData[chartData.length - 1] || {};
    //   const newPoint = this._deltaChartData.shift();
    //   if (type === "state") {
    //     if (currentState.ev !== undefined && currentState.ev !== newPoint.ev) {
    //       chartData.push({et: newPoint.et, ev: currentState.ev});
    //     }
    //   }
      // if (chartData.length > 0)
      // {
      //   console.log("evs....", currentState.ev, newPoint.ev);
      //   console.log("ets....", currentState.et, newPoint.et);
      //   const transitionX = interpolateDate(currentState.et, newPoint.et);
      //   const transitionY = interpolate(currentState.ev, newPoint.ev);
      //   const t = timer((elapsed) => {
      //     console.log("elapsed percentage........", elapsed/500);
      //     const progress = Math.min(1, elapsed/500);
      //     const evProgress = transitionY(progress);
      //     const etProgress = transitionX(progress);
      //     console.log("{ev: evProgress, et: etProgess}", {ev: evProgress, et: etProgress});
      //     console.log("newPoint.......", newPoint.ev, newPoint.et);
      //     chartData.push({ev: evProgress, et: etProgress});
      //     if (progress >= 1) {
      //       t.stop();
      //       if (this._deltaChartData.length > 0) {
      //         this._updateInterval = setTimeout(this._updateChart, 550);
      //       } else {
      //         this._updateInterval = null;
      //       }
      //     }
      //     this.setState({chartData});
      //   });
      // } else {
      //   chartData.push(newPoint);
      //   this.setState({chartData});
      // }
    // }
  }
  _getTickForDomain(ticks, domain, startIdx = 0) {
    for (var i = startIdx; i < ticks.length; i++) {
      if (+ticks[i] >= domain[0]) {
        this._ticksIdx = Math.max(0, i-1);
        return ticks.slice(this._ticksIdx);
      }
    }
  }
  render() {
    //allow 10 points at the most at anytime
    const {children, ...rest} = this.props;
    const {chartData} = this.state;
    const {device: {chart: {type = "line"}}} = this.props;
    const from = Math.max(0, chartData.length - 45);
    const data = chartData.slice(from);
    const options = {
      data,
      xInterval: this._xInterval,
      xAccessor: this._xAccessor,
      xTickStart: this._xTickStart
    };
    const domainsAndTicks = getDomainsAndTicks(options);
    const {xDomain, yTicksValues} = domainsAndTicks;
    let {xTickValues, yDomain} = domainsAndTicks;
    this._xTickStart = this._xTickStart || (chartData.length > 0 && xTickValues[0]) || undefined;
    if (this._xTickStart) {
      xTickValues = this._getTickForDomain(xTickValues, xDomain, this._ticksIdx);
    }
    //get index of first value from tickStart that is greater than domain[0]
    //get a slice from tickstart starting from index - 1
    if (!yDomain) {
      yDomain = type === "state" ? [0, 1] : [0, 50];
    }
    const childProps = {
      chartData: data, xDomain, xTickValues, xType: "time", xAccessor: this._xAccessor,
      yDomain, yTicksValues, yAccessor: this._yAccessor, chartSeries: this._chartSeries
    };
    console.log("childProps...........", childProps);
    const childrenWithProps = React.Children.map(children,
     (child) => React.cloneElement(child,
       Object.assign({}, rest, childProps))
    );
    return <div>{childrenWithProps}</div>;
  }
}

export default SmgntChartTransition;
