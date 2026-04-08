const { createClient }= require('redis');

const client = createClient({
    username: 'default',
    password: 'BZOHJlLA2pZmqxTWtJ3MO0TmanByvZBr',
    socket: {
        host: 'redis-14601.c14.us-east-1-2.ec2.cloud.redislabs.com',
        port: 14601
    }
});

client.on('error', err => console.log('Redis Client Error', err));


async function name(params) {
    await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar
}


name();


