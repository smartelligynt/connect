import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {Chart} from "react-d3-core";
import {LineChart} from "react-d3-basic";
import {LineTooltip} from "react-d3-tooltip";
import {SimpleTooltip} from "react-d3-tooltip";
import d3 from "d3";
import {timeSecond} from "d3-time";
import {gridLines, legend, xAxis, lineClass} from "../styles/chart.css"
import {getChartData} from "../actions";

class SmgntLineChart extends React.Component {
  constructor(props, context) {
    super(props, context)
    const {device: {chart = {x: {}, y: {}}} = {}} = this.props;
    const {color} = chart;
    const {y: {attr: {name: yName, type: yType, label: yLabel} = {}} = {}} = chart;
    const {x: {attr: {name: xName, type: xType, label: xLabel} = {}} = {}} = chart;

    this._chartSeries = [{field: "state", name: "Status", color}];
    this._xAccessor = (d) => d.timestamp;
    this._xType = xType;
    this._yAccessor = (d) => d;

    this.state = {chartData: [{state: 0, timestamp: (Date.now() - 8000)}, {state: 0, timestamp: new Date()}]};
  }
  componentWillReceiveProps(nextProps) {
    console.log("state chart componentWillReceiveProps..........");
    const {chartData = []} = nextProps;
    const {chartData: currentStateData = []} = this.state;
    const currState = currentStateData[currentStateData.length - 1] || {ev: 0};
    const newState = chartData[chartData.length - 1] || {};
    const data = this.state.chartData;
    if (newState.ev !== undefined && newState.ev !== currState.ev) {
      const now = new Date();
      data.push({ev: currState.ev, timestamp: now});
      data.push({ev: newState.ev, timestamp: now});
    } else {
      data.push({ev: currState.ev, timestamp: new Date()});
    }
    this.setState({chartData: data});
  }
  _getXDomain(chartData) {
    if (chartData && chartData.length > 0) {
      const domain = d3.extent(chartData, this._xAccessor);
      if (timeSecond.count(...domain) < 10) {
        return [domain[0], timeSecond.offset(domain[0], 10)];
      } else {
        return domain;
      }
    } else {
      return [timeSecond.offset(new Date(), -10), timeSecond(new Date())];
    }
  }
  _getYDomain(chartData) {
    return [0, 1];
  }
  _getDomainAndTicks(type) {
    const {chartData} = this.state;
    if (type === "x") {
      const xDomain = this._getXDomain(chartData);
      this._tickStart = chartData.length > 0 && (this._tickStart || xDomain[0]);
      const xTickValues = timeSecond.range.apply(null, [this._tickStart || xDomain[0], xDomain[1], 3]);
      return {xDomain, xTickValues};
    } else {
      return {yDomain: this._getYDomain(chartData)};
    }
  }
  render() {
    console.log("calling state chart render.....", this.props.device);
    const {chartData = []} = this.state;
    const {xDomain, xTickValues} = this._getDomainAndTicks("x");
    const {yDomain} = this._getDomainAndTicks("y");
    const {dimensions: {height, width, margins}} = this.props;
    return (
      <LineTooltip
        height={height}
        width={width}
        margins={margins}
        data={chartData}
        chartSeries={this._chartSeries}
        x={this._xAccessor}
        xDomain={xDomain}
        xScale={this._xType}
        xTickValues={xTickValues}
        xAxisClassName={xAxis}
        xGridStyleClassName={gridLines}
        y={this._yAccessor}
        yDomain={yDomain}
        yTicks={[0]}
        showYGrid={false}
        legendClassName={legend}
        lineClassName={lineClass}
      >
        <SimpleTooltip/>
      </LineTooltip>
    )
  }
}

const axisShape = PropTypes.shape({
  attr: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string
  }).isRequired
}).isRequired;

SmgntLineChart.propTypes = {
  device: PropTypes.shape({
    chart: PropTypes.shape({
      color: PropTypes.string,
      type: PropTypes.string.isRequired,
      x: axisShape,
      y: axisShape
    }).isRequired,
  }).isRequired,
  chartData: PropTypes.array,
  dimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    margins: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }).isRequired
  })
};

SmgntLineChart.defaultProps = {
  dimensions: {
    height: 160,
    width: 400,
    margins: {left: 20, right: 10, top: 10, bottom: 20}
  }
}

export default SmgntLineChart;
// export default SmgntLineChart;
