import kafka from './client';

const producer = kafka.producer();

export const produceMessage = async (topic: string, message: any) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};
