import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {Chart} from "react-d3-core";
import {LineChart} from "react-d3-basic";
import {LineTooltip} from "react-d3-tooltip";
import {SimpleTooltip} from "react-d3-tooltip";
import d3 from "d3";
import {timeDay} from "d3-time";
import {gridLines, legend, xAxis, lineClass} from "../styles/chart.css"
import {getChartData} from "../actions";

class SmgntLineChart extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    console.log("calling render.....", this.props);
    const {chartData = []} = this.props;
    const {xType, xDomain, xTickValues, xAccessor} = this.props;
    const {yDomain, yAccessor, chartSeries} = this.props;
    const {dimensions: {height, width, margins}} = this.props;
    return (
      <LineTooltip
        height={height}
        width={width}
        margins={margins}
        data={chartData}
        chartSeries={chartSeries}
        x={xAccessor}
        xDomain={xDomain}
        xScale={xType}
        xTickValues={xTickValues}
        xAxisClassName={xAxis}
        xGridStyleClassName={gridLines}
        y={yAccessor}
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
