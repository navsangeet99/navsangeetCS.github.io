/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const Redis=require("ioredis");


const CoinAPI = require('../CoinAPI');

class RedisBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.client=null;
  }

  async connect() {
    this.client=new Redis(7379);
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    const data=await this.coinAPI.fetch();
    const values=[];
    Object.entries(data.bpi).forEach((entries)=>{
      values.push(entries[1]);
      values.push(entries[0]);
    });
    return this.client.zadd('maxcoin:values', values);
  }

  async getMax() {
  return this.client.zrange('maxcoin:values', -1, -1, 'WITHSCORES');
  }

  async max() {// get max value
    console.info("Connect to Redis");
    console.time("redis-connect");
    const client= this.connect();
    if (client){
      console.info("Successfully connected to Redis");
    }else{
      throw new Error("Connceting to Redis failed");
    }
    console.timeEnd("redis-connect");

    console.info("inserting into Redis");
    console.time("redis-insert");
    const insertResult=this.insert();
    console.timeEnd("redis-insert");
    
    console.info(`Inserted ${insertResult} documents into Redis`);

    console.info("Querying Redis"); 
    console.time("redis-find"); // time of finding
    const result= this.getMax(); // asynch get max
    console.timeEnd("redis-find"); // stop time

    console.info("Disconnecting to Redis");
    console.time("redis-disconnect");
    this.disconnect();
    console.timeEnd("redis-disconnect");
    return result;
  }
}

module.exports = RedisBackend;