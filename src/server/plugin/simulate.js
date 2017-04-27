exports.register = (server, options, next) => {
  server.route({
    method: "POST",
    path: "/devices/{deviceId}/start",
    handler: (request, reply) => {
      const events = '[{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":38,"eu":"watts","en":"TV Switch activity"},{"ev":34,"eu":"watts","en":"TV Switch activity"},{"ev":12,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":30,"eu":"watts","en":"TV Switch activity"},{"ev":32,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":17,"eu":"watts","en":"TV Switch activity"},{"ev":42,"eu":"watts","en":"TV Switch activity"},{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":24,"eu":"watts","en":"TV Switch activity"},{"ev":19,"eu":"watts","en":"TV Switch activity"},{"ev":15,"eu":"watts","en":"TV Switch activity"},{"ev":26,"eu":"watts","en":"TV Switch activity"},{"ev":37,"eu":"watts","en":"TV Switch activity"},{"ev":24,"eu":"watts","en":"TV Switch activity"},{"ev":14,"eu":"watts","en":"TV Switch activity"},{"ev":38,"eu":"watts","en":"TV Switch activity"},{"ev":36,"eu":"watts","en":"TV Switch activity"},{"ev":39,"eu":"watts","en":"TV Switch activity"},{"ev":19,"eu":"watts","en":"TV Switch activity"},{"ev":43,"eu":"watts","en":"TV Switch activity"},{"ev":20,"eu":"watts","en":"TV Switch activity"}]';

      events = JSON.parse(events);

      reply(null, events);
    }
  });
}
