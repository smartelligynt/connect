"use strict";
const devices = require("../services/mock-data/devices").devices;
const chartData = require("../services/mock-data/chart-data").data;
require('es6-promise').polyfill();
const fetch = require("isomorphic-fetch");
const esUrl = "https://search-smartelligyntes-zfnjlomb5dgk7gwbziwkvtkglq.us-west-2.es.amazonaws.com";
const _ = require("lodash");

console.log("chartData....", chartData);
const deviceIntervals = {};
const events = JSON.parse('[{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":38,"eu":"watts","en":"TV Switch activity"},{"ev":34,"eu":"watts","en":"TV Switch activity"},{"ev":12,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":30,"eu":"watts","en":"TV Switch activity"},{"ev":32,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":17,"eu":"watts","en":"TV Switch activity"},{"ev":42,"eu":"watts","en":"TV Switch activity"},{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":24,"eu":"watts","en":"TV Switch activity"},{"ev":19,"eu":"watts","en":"TV Switch activity"},{"ev":15,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":37,"eu":"watts","en":"TV Switch activity"},{"ev":24,"eu":"watts","en":"TV Switch activity"},{"ev":14,"eu":"watts","en":"TV Switch activity"},{"ev":38,"eu":"watts","en":"TV Switch activity"},{"ev":36,"eu":"watts","en":"TV Switch activity"},{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":19,"eu":"watts","en":"TV Switch activity"},{"ev":43,"eu":"watts","en":"TV Switch activity"},{"ev":20,"eu":"watts","en":"TV Switch activity"}]');
let start = events.length;

exports.register = (server, options, next) => {
  server.route({
    method: "GET",
    path: "/devices",
    handler: (request, reply) => reply(null, devices)
  });
  server.route({
    method: "GET",
    path: "/devices/{deviceId}",
    handler: (request, reply) => reply(null, chartData[request.params.deviceId])
  });
  server.route({
    method: "GET",
    path: "/charts/{userId}",
    handler: (request, reply) => {
      fetch(`${esUrl}/charts/_search?type=${request.params.userId}`)
        .then((response) => response.json())
        .then((body) => {
          console.log("body.........", body);
          const devicesObj = {};
          const charts = body.hits.hits.map((chart) => {
            const device = {chart: chart._source};
            const deviceCharts = devicesObj[device.chart.resourceUrl] = devicesObj[device.chart.resourceUrl] || [];
            deviceCharts.push(device);
            return device;
          });
          console.log("charts..........", charts, devicesObj);
          Promise.all(Object.keys(devicesObj).map((deviceId) => fetch(`${esUrl}/devices/${request.params.userId}/${deviceId}`)))
            .then((deviceResponses) => {
              console.log("deviceResponses...........", deviceResponses);
              return Promise.all(deviceResponses.map((deviceResp) => deviceResp.json()))
            })
            .then((devices) => {
              console.log("devices.............", devices);
              devices.forEach((device) => {
                console.log("in devices forEach.............");
                devicesObj[device._id].forEach((chart) => {
                  chart.id = device._id;
                  chart.name = device._source.name;
                  chart.desc = device._source.desc;
                  chart.type = device._source.type;
                  console.log("chart...........", chart);
                })
              })
            })
            .then(() => reply(null, charts));
        });
    }
  });
  server.route({
    method: "GET",
    path: "/events/{deviceId}",
    handler: (request, reply) => {
      const generateQuery = (options) => {
        const query = {query: {constant_score: {filter: {bool: {must: []}}}}};
        query.sort = [{et: {order: "asc"}}];
        const must = _.get(query, "query.constant_score.filter.bool.must");
        must.push({match: {_type: options.deviceId}});
        must.push({match: {eu: options.eType}});
        must.push({range: {et: {gt: options.from}}});
        return query;
      };
      console.log("request.query.....", request.query);
      const deviceId = request.params.deviceId;
      const from = request.query.from;
      const eType = request.query.eType;
      const deviceType = request.query.dType;
      const query = generateQuery({deviceId, deviceType, from, eType});
      console.log("query........", JSON.stringify(query));
      fetch(`${esUrl}/events/_search`, {
        method: "POST",
        body: JSON.stringify(query)
      })
      .then((response) => response.json())
      .then((response) => console.log("response..........", response) || reply(null, response.hits.hits.map((event) => event._source)))
    }
  });
  server.route({
    method: "GET",
    path: "/devices/{deviceId}/start",
    handler: (request, reply) => {
      if (deviceIntervals[request.params.deviceId]) {
        return reply(null, {status: "Already running"});
      }
      deviceIntervals[request.params.deviceId] = setInterval(() => {
        const event = events[start++ % events.length];
        console.log("event......", event);
        fetch(`${esUrl}/events/${request.params.deviceId}`, {
          method: "POST",
          body: JSON.stringify(_.extend({}, event, {et: Date.now()}))
        });
      }, 200);
      reply(null, {status: "Started"});
    }
  });
  server.route({
    method: "GET",
    path: "/devices/{deviceId}/stop",
    handler: (request, reply) => {
      const interval = deviceIntervals[request.params.deviceId];
      if (interval) {
        console.log("interval.....", interval);
        clearInterval(interval);
        delete deviceIntervals[request.params.deviceId];
      }
      reply(null, {status: "Stopped"});
    }
  });
  next();
}

exports.register.attributes = {
  name: "getDevices",
  version: "1.0.0"
};
