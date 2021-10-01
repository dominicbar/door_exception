module.exports.addUserData = async (reqBody, models) => {
  var msg = reqBody;
  console.log(reqBody);
  const res = await models.door_events.create({
    orgId: msg.data[0].orgId,
    accessPointId: msg.data[0].accessPoint.id,
    doorEventCreatedAt: msg.data[0].createdAt,
    eventType: msg.data[0].eventInfo.eventType,
    eventTime: msg.data[0].eventInfo.eventTime,
    acessPointName: msg.data[0].accessPoint.name,
    accessPointDirection: msg.data[0].accessPoint.name,
    siteId: msg.data[0].accessPoint.siteId,
    siteName: msg.data[0].accessPoint.siteName,
    siteLocation: msg.data[0].accessPoint.siteLocation,
  });
  const history = await models.door_events_history.create({
    orgId: msg.data[0].orgId,
    accessPointId: msg.data[0].accessPoint.id,
    doorEventCreatedAt: msg.data[0].createdAt,
    eventType: msg.data[0].eventInfo.eventType,
    eventTime: msg.data[0].eventInfo.eventTime,
    acessPointName: msg.data[0].accessPoint.name,
    accessPointDirection: msg.data[0].accessPoint.name,
    siteId: msg.data[0].accessPoint.siteId,
    siteName: msg.data[0].accessPoint.siteName,
    siteLocation: msg.data[0].accessPoint.siteLocation,
  });

  return Promise.resolve("success");
};
