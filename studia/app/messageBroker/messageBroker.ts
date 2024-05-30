import { connect } from 'amqplib/callback_api';

export function sendLoggedInMessage(username: string | null | undefined) {
  console.log('sending logged in message');

  connect('amqp://localhost', function (error0: any, connection: any) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1: any, channel: any) {
      if (error1) {
        throw error1;
      }

      var queue = 'hello';
      var msg = username + ' is logged in';

      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(msg));

      console.log(' [x] Sent %s', msg);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}
