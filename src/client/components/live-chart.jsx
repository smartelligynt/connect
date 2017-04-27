import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {getChartData} from "../actions";
import SmgntChartTransition from "./transition-chart";

class SmgntLiVeChart extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this._fetchRealTimeData();
    this._fetchInterval = setInterval(() => this._fetchRealTimeData(), 2000);
  }
  componentWillUnmount() {
    clearInterval(this._fetchInterval);
  }
  _fetchRealTimeData() {
    console.log("calling _fetchRealTimeData....");
    const {fetchChartData} = this.props;
    const {device: {id:deviceId, type:deviceType, chart: {resourceUrl, etype}}} = this.props;
    this.lastAccess = this.lastAccess || (Date.now() - 60000);
    const from = +this.lastAccess;
    fetchChartData({resourceUrl, deviceId, deviceType, etype, from});
  }
  render() {
    const {chartData = []} = this.props;
    const point = chartData[chartData.length - 1];
    if (point) {
      this.lastAccess = point.et;
      console.log("this.lastAccess......", this.lastAccess);
    }
    const {children, ...rest} = this.props;
    const childrenWithProps = React.Children.map(children,
     (child) => React.cloneElement(child,
       Object.assign({}, rest))
    );
    return <div>{childrenWithProps}</div>;
  }
}

const mapStateToProps = (state, props) => {
  console.log("in mapStateToProps....", state);
  const {device: {id, type}} = props;
  return {
    chartData: (state[type] && state[type][id]) || []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChartData: (payload) => dispatch(getChartData(payload)),
  };
};

const ConnectedSmgntLiVeChart = connect(mapStateToProps, mapDispatchToProps)(SmgntLiVeChart);

export default (Chart) => (props) => {
  return (
    <ConnectedSmgntLiVeChart {...props}>
      <SmgntChartTransition>
        <Chart/>
      </SmgntChartTransition>
    </ConnectedSmgntLiVeChart>
  )
};
