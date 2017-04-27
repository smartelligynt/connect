exports.devices = [
{
  id: "12345",
  name: "TV Switch",
  desc: "Family room TV",
  type: "smartSwitch",
  chart: {
    type: "line",
    resourceUrl: "/devices/12345",
    color: "#ff7f0e",
    x: {
      attr: {
        name: "et",
        type: "time",
        label: "DateTime"
      },
      interval: "dd"
    },
    y: {
      attr: {
        name: "ev",
        type: "number",
        label: "Watt"
      }
    }
  }
},
{
  id: "6789",
  name: "Main Door",
  desc: "Main Door activity",
  type: "DoorSensor",
  chart: {
    type: "state",
    resourceUrl: "/devices/6789",
    color: "#2f4f4f",
    x: {
      attr: {
        name: "timestamp",
        type: "time",
        label: "DateTime"
      },
      interval: "ss"
    },
    y: {
      attr: {
        name: "ev",
        type: "number",
        label: "Status"
      }
    }
  }
},
{
  id: "12346789",
  name: "Back Door",
  desc: "Back Door activity",
  type: "DoorSensor",
  chart: {
    type: "state",
    resourceUrl: "/devices/12346789",
    color: "#ff7f0e",
    x: {
      attr: {
        name: "timestamp",
        type: "time",
        label: "DateTime"
      },
      interval: "ss"
    },
    y: {
      attr: {
        name: "ev",
        type: "number",
        label: "Status"
      }
    }
  }
}];
