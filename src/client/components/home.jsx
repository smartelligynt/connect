import React, {PropTypes} from "react";
import {connect} from "react-redux";
/**/
import {toggleCheck, incNumber, decNumber} from "../actions";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import liveChart from "./live-chart";
import LineChart from "./line-chart";
import StateChart from "./state-chart";
import {canUseDOM} from "exenv";
import {AboveTheFoldOnlyServerRender} from "above-the-fold-only-server-render";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const Chart = liveChart(LineChart);

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: "800px",
    overflowY: 'auto',
    margin: 'auto'
  },
};

const tilesData = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Breakfast',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Tasty burger',
    author: 'pashminu',
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Camera',
    author: 'Danson67',
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Morning',
    author: 'fancycrave1',
  },
  {
    img: 'images/grid-list/hats-829509_640.jpg',
    title: 'Hats',
    author: 'Hans',
  },
  {
    img: 'images/grid-list/honey-823614_640.jpg',
    title: 'Honey',
    author: 'fancycravel',
  },
  {
    img: 'images/grid-list/vegetables-790022_640.jpg',
    title: 'Vegetables',
    author: 'jill111',
  },
  {
    img: 'images/grid-list/water-plant-821293_640.jpg',
    title: 'Water plant',
    author: 'BkrmadtyaKarki',
  },
];
/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const AppBarExampleIcon = () => (
  <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
);

class Home extends React.Component {
  _getChartType(device) {
    return device.chart.type === "line" || device.chart.type === "state"
      ? LineChart
      : StateChart;
  }
  render() {
    const props = this.props;
    const {devices = []} = props;
    console.log("devices...........", devices)
    return (
      <AboveTheFoldOnlyServerRender skip={true}>
        <div>
          <MuiThemeProvider>
            <div>
              <AppBarExampleIcon/>
              <GridList
                cellHeight="auto"
                style={styles.gridList}
              >
                {devices.map((device) => {
                  const Chart = liveChart(this._getChartType(device));
                  return (
                    <Card style={{height: "229px"}}>
                      <CardHeader
                        title={device.name}
                        subtitle={device.desc}
                      />
                      <Chart device={device}/>
                    </Card>
                  );
                  }
                )}
              </GridList>
            </div>
          </MuiThemeProvider>
        </div>
      </AboveTheFoldOnlyServerRender>
    );
  }
}

Home.propTypes = {
  devices: PropTypes.array
};

const mapStateToProps = ({devices = []}) => {
  return {
    devices
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeCheck: () => {
      dispatch(toggleCheck());
    },
    onIncrease: () => {
      dispatch(incNumber());
    },
    onDecrease: () => {
      dispatch(decNumber());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
