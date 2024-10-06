import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], // adjust to your Kafka broker
});

const consumer = kafka.consumer({ groupId: 'test-group' });

export const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`Consumed message: ${message.value.toString()}`);
    },
  });
};
