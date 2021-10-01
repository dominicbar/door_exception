const { unix } = require("moment");
var moment = require("moment");
const models = require("./models");
const axios = require("axios");

exports.handler = function (event, context) {
  console.log("hello world");

  testin(context);
};

// select "orgId", "accessPointId", json_agg(json_build_object('direction',"accessPointDirection", "eventTime" ,"eventTime", 'accessPointId' ,"accessPointId", 'orgId', "orgId" ) order by de."eventTime" ) from door_events de
// group by "orgId", "accessPointId"

async function sendAlarm(doorObj, context) {
  var msgFormat = {
    msgType: "door_exception",
    msgVersion: 1,
    data: [
      {
        id: doorObj.id,
        orgId: doorObj.orgId,
        createdAt: doorObj.doorEventCreatedAt,
        eventInfo: {
          eventType: "door_ajar",
          eventTime: doorObj.eventTime,
        },
        accessPoint: {
          id: doorObj.accessPointId,
          name: doorObj.accessPointName,
          accessPointDirection: doorObj.direction,
          siteId: doorObj.siteId,
          siteName: doorObj.siteName,
          siteLocation: doorObj.siteLocation,
        },
      },
    ],
  };

  console.log(msgFormat);
  let res = await sendToService(
    msgFormat,
    process.env.INTEGRATION_PATH,
    "/dev/integrationService/events",
    { "x-api-key": process.env.X_API_KEY },
    "POST"
  );

  await models.door_exception_report.create({
    orgId: doorObj.orgId,
    accessPointId: doorObj.accessPointId,
    eventTime: doorObj.eventTime,
    accessName: doorObj.accessPointName,
    accessPointDirection: doorObj.direction,
    siteId: doorObj.siteId,
    siteName: doorObj.siteName,
    siteLocation: doorObj.siteLocation,
  });

  context.succeed("success");
}

async function deleteEntries(deleteArray) {
  var [door_events, e] = await models.sequelize.query(
    `DELETE from door_events where id IN (${deleteArray.join()})`
  );
}

async function sendToService(postData, webhook, path, headers, method) {
  console.log("reaching here");
  if (method && method.toUpperCase() == "PATCH") {
    return new Promise((resolve, reject) => {
      let response = axios
        .patch(`${webhook}`, postData, { headers: headers })
        .then(function (res) {
          // return res.data.access_token;
          resolve(res);
        })
        .catch(function (error) {
          // console.log(error.response.data);
          reject(error);
        });

      return response;
    });
  } else if (method && method.toUpperCase() == "PUT") {
    return new Promise((resolve, reject) => {
      let response = axios
        .put(`${webhook}`, postData, { headers: headers })
        .then(function (res) {
          // return res.data.access_token;
          resolve(res);
        })
        .catch(function (error) {
          // console.log(error.response.data);
          reject(error);
        });

      return response;
    });
  } else {
    return new Promise((resolve, reject) => {
      let response = axios
        .post(`${webhook}`, postData, { headers: headers })
        .then(function (res) {
          // return res.data.access_token;
          console.log(res);
          resolve(res);
        })
        .catch(function (error) {
          // console.log(error.response.data);
          console.log(error);
          reject(error);
        });

      console.log("response");
      console.log(response);
      return response;
    });
  }
}

async function testin(context) {
  // await models.lambda_executed.create();
  var [door_events, e] = await models.sequelize.query(
    `select "orgId", "accessPointId", 
    json_agg(json_build_object('id',id,'doorEventCreatedAt',"doorEventCreatedAt",'direction',"accessPointDirection", 'eventType' ,"eventType",'eventTime' ,"eventTime", 'accessPointId' ,"accessPointId", 'accessPointName', "acessPointName" ,'orgId', "orgId", 'siteId', "siteId", 'siteName', "siteName", 'siteLocation' ,"siteLocation") order by de."eventTime" ) as "doorObj" from door_events de 
    group by "orgId", "accessPointId" 
    `
  );

  console.log(door_events.length);
  console.log(door_events);

  if (door_events.length <= 0) {
    context.succeed("success");
  }

  var deleteArray = [];
  for (var i = 0; i < door_events.length; i++) {
    var previousStep = null;
    var entryTime = null,
      exitTime = null;
    var entryid, exitId, onlineId, offlineId;
    var onlineTime = null,
      offlineTime = null;
    console.log(door_events[i].doorObj);
    for (var j = 0; j < door_events[i].doorObj.length; j++) {
      console.log("INSIDE LOOP");
      var a = door_events[i].doorObj[j];
      var p, q;
      switch (a.eventType) {
        case "door_open":
          console.log("CASE DOOR OPEN");
          if (previousStep == null) {
            console.log("previous_step: null");
            entryTime = a.eventTime;
            entryid = a.id;
          } else if (previousStep == "door_open") {
            console.log("previous_step: door_open");
            deleteArray.push(entryid);
            entryTime = a.eventTime;
            entryid = a.id;
          } else if (previousStep == "door_close") {
            console.log("previous_step: door_close");
            deleteArray.push(exitId);
            entryTime = a.eventTime;
            entryid = a.id;
          } else if (previousStep == "online") {
            console.log("previous_step: online");
            entryTime = a.eventTime;
            entryid = a.id;
            deleteArray.push(onlineId);
          } else if (previousStep == "offline") {
            console.log("previous_step: offline");
            entryTime = a.eventTime;
            entryid = a.id;
            deleteArray.push(offlineId);
            deleteArray.push(a.id);
          }
          previousStep = "door_open";
          break;
        case "door_close":
          console.log("CASE DOOR CLOSE");
          if (previousStep == null) {
            console.log("previous_step: null");
            deleteArray.push(a.id);
            previousStep = null;
          } else if (previousStep == "door_open") {
            console.log("previous_step: door_open");
            exitTime = a.eventTime;
            exitId = a.id;
            var entryunix = moment.unix(entryTime);
            var exitunitx = moment.unix(exitTime);
            console.log("orgid");
            console.log(door_events[i].orgId);
            console.log("accessPointId");
            console.log(door_events[i].accessPointId);
            console.log("time");
            console.log(exitunitx.diff(entryunix, "minutes"));
            if (exitunitx.diff(entryunix, "minutes") >= 2) {
              sendAlarm(a, context);
            }
            deleteArray.push(entryid);
            deleteArray.push(exitId);
            previousStep = null;
          } else if (previousStep == "door_close") {
            console.log("previous_step: door_close");
            deleteArray.push(a.id);
            previousStep = null;
          } else if (previousStep == "online") {
            console.log("previous_step: online");
            deleteArray.push(onlineId);
            deleteArray.push(a.id);
            previousStep = null;
          } else if (previousStep == "offline") {
            console.log("previous_step: offline");
            deleteArray.push(offlineId);
            deleteArray.push(a.id);
            previousStep = null;
          }
          break;
        case "online":
          console.log("CASE DOOR ONLINE");
          if (previousStep == null) {
            console.log("previous_step: null");
            onlineTime = a.eventTime;
            onlineId = a.id;
          } else if (previousStep == "door_open") {
            console.log("previous_step: door_open");
            deleteArray.push(entryid);
            onlineTime = a.eventTime;
            onlineId = a.id;
          } else if (previousStep == "door_close") {
            console.log("previous_step: door_close");
            deleteArray.push(exitId);
            entryTime = a.eventTime;
            entryid = a.id;
          } else if (previousStep == "online") {
            console.log("previous_step: online");
            deleteArray.push(onlineId);
            onlineTime = a.eventTime;
            onlineId = a.id;
            previousStep = "online";
          } else if (previousStep == "offline") {
            console.log("previous_step: offline");
            deleteArray.push(offlineId);
            onlineTime = a.eventTime;
            onlineId = a.id;
            previousStep = "online";
          }
          previousStep = "online";
          break;
        case "offline":
          console.log("CASE DOOR OFFLINE");
          if (previousStep == null) {
            console.log("previous_step: null");
            offlineTime = a.eventTime;
            offlineId = a.id;
          } else if (previousStep == "door_open") {
            console.log("previous_step: door_open");
            deleteArray.push(entryid);
            offlineTime = a.eventTime;
            offlineId = a.id;
          } else if (previousStep == "online") {
            console.log("previous_step: online");
            deleteArray.push(onlineId);
            offlineTime = a.eventTime;
            offlineId = a.id;
            previousStep = "offline";
          } else if (previousStep == "offline") {
            console.log("previous_step: offline");
            deleteArray.push(offlineId);
            offlineTime = a.eventTime;
            offlineId = a.id;
            previousStep = "online";
          }
          previousStep = "offline";
          break;
        default:
        // code block
      }
    }

    if (previousStep == "door_open") {
      console.log("----ONLY DOOR OPEN----");
      var entryTimeUnix = moment.unix(entryTime);
      var currentTimeUnix = moment.unix(moment().unix());

      if (currentTimeUnix.diff(entryTimeUnix, "minutes") >= 2) {
        sendAlarm(a, context);
        deleteArray.push(entryid);
      }
    }

    console.log(deleteArray);
    deleteEntries(deleteArray);
    deleteArray = [];
  }
}
