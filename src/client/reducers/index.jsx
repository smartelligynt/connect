import {combineReducers} from "redux";
import deviceData from "../components/data/devices";

const devices = (state = [], action) => {
  if (action.type === "GET_DEVICES") {
    console.log("in the reducer.........", action.payload);
    return action.payload;
  }

  return state;
};

const smartSwitch = (state = {}, {type, payload}) => {
  if (type === "smartSwitch:CHART_DATA") {
    const {deviceId, chartData} = payload;
    if (chartData.length > 0) {
      return {...state, [deviceId]: chartData};
    }
  }
  return state;
};

const DoorSensor = (state = {}, {type, payload}) => {
  if (type === "DoorSensor:CHART_DATA") {
    console.log("in oor sensor reducer");
    const {deviceId, chartData} = payload;
    if (chartData && chartData.length > 0) {
      chartData[0].et = new Date();
    }
    return {...state, [deviceId]: chartData};
  }
  return state;
}
const checkBox = (store, action) => {
  if (action.type === "TOGGLE_CHECK") {
    return {
      checked: !store.checked
    };
  }

  return store || {checked: false};
};

const number = (store, action) => {
  if (action.type === "INC_NUMBER") {
    return {
      value: store.value + 1
    };
  } else if (action.type === "DEC_NUMBER") {
    return {
      value: store.value - 1
    };
  }

  return store || {value: 0};
};

export default combineReducers({
  devices,
  smartSwitch,
  DoorSensor,
  checkBox,
  number
});
