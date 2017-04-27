import switchData from "../components/data/switch";
import sensorData from "../components/data/stateSensor";
import fetch from "isomorphic-fetch";
import _ from "lodash";

export const toggleCheck = () => {
  return {
    type: "TOGGLE_CHECK"
  };
};

export const incNumber = () => {
  return {
    type: "INC_NUMBER"
  };
};

export const decNumber = () => {
  return {
    type: "DEC_NUMBER"
  };
};

export const getDevices = (host = "", userId) => {
  console.log(`${host}/devices .......`);
  return (dispatch) => fetch(`${host}/charts/${userId}`)
    .then((response) => {
      return response.json();
    })
    .then((devices = []) => {
      console.log("devices .......", devices);
      dispatch({type: "GET_DEVICES", payload: devices});
    });
}

export const getChartData = ({resourceUrl, deviceId, deviceType, etype, from}) => {
  return (dispatch) => fetch(`/events/${resourceUrl}?dType=${deviceType}&eType=${etype}&from=${from}`)
    .then((response) => response.json())
    .then((chartData = []) => {
      console.log("chartData.........", chartData)
      chartData = _.map(chartData, (point) => {point.et = new Date(point.et); return point})
      dispatch({type: `${deviceType}:CHART_DATA`, payload: {deviceId, chartData}});
    });
}
