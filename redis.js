let redisClient
module.exports = {
    init: function(redis) {
        // start socket.io server and cache io value
        redisClient = redis.createClient({
            host: process.env.REDIS_HOST || 'queueing-redis'
        })

        redisClient.on("error", function(error) {
            console.error(error);
        })

        return redisClient
    },
    getRedisClient: function() {
        // return previously cached value
        if (!redisClient) {
            throw new Error("must call .init(server) before you can call .getRedisClient()");
        }
        return redisClient
    }
}