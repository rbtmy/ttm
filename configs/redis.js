import Redis from 'ioredis'

import {redisPort} from './db';
import {redisHost} from './db';

/**
 * @return Redis
 */
function redisInstance() {
    let conn = new Redis(redisPort, redisHost);
    // conn.connect().catch(e => {
    //     console.log('Redis is not configured ' + e);
    //     process.exit();
    // });
    return conn;
}

const redis = redisInstance();

export {redisInstance}
export {redisPort};
export {redisHost};

export default redis;