/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const{MongoClient}= require ('mongodb'); // need to use this driver, this will get the mongoclient from the mongodb module

const CoinAPI = require('../CoinAPI');

class MongoBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl="mongodb://localhost:37017/maxcoin";// define mongourl, url to the server
    this.client=null; 
    this.collection=null;
  }

  async connect() {
    const mongoClient=new MongoClient(this.mongoUrl,{ // creating new instance of mongoclient and its argument we pass this.mongourl-that's the url to connect to.
      useUnifiedTopology:true, // add config object
      useNewUrlParser:true,
  });
  // connect to the server
  this.client=await mongoClient.connect(); // asynch
  this.collection=this.client.db("maxcoin").collection("values");
  return this.client;
  }

  async disconnect() {
    if(this.client){
      return this.client.close();
    }
    return false;
  }

  async insert() { // inserting data from the data.json to the mongodb
    const data= await this.coinAPI.fetch();
    const documents=[];
    Object.entries(data.bpi).forEach((entry)=>{
      documents.push({
        date: entry[0],
        value:entry[1],
      });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() { // get maximum value 
    // sort in descending order and ten get the max value among the values
    return this.collection.findOne({}, {sort:{value: -1}}); // find one value from the all documents from the sorted descending(-1) values, and call in the max
    // to gte minimum just sort into ascending and change -1 to 1
  }

  async max() { // get max value
    console.info("Connect to MongoDB");
    console.time("mongodb-connect");
    const client=await this.connect();
    if (client.isConnected()){
      console.info("Successfully connected to MongoDB");
    }else{
      throw new Error("Connceting to MongoDB failed");
    }
    console.timeEnd("mongodb-connect");

    console.info("inserting into MongoDB");
    console.time("mongodb-insert");
    const insertResult=await this.insert();
    console.timeEnd("mongodb-insert");
    
    console.info(`Inserted ${insertResult.result.n} documents into MongoDB`);

    console.info("Querying MongoDB"); 
    console.time("mongodb-find"); // time of finding
    const doc= await this.getMax(); // asynch get max
    console.timeEnd("mongodb-find"); // stop time

    console.info("Disconnecting to MongoDB");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");

    return {
      date: doc.date, // return just data and value, not whole object cuz that will return the id too
      value: doc.value,
    };
  }
}

module.exports = MongoBackend;