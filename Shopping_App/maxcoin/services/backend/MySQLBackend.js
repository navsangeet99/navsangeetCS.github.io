/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql =require ("mysql2/promise");
const CoinAPI = require('../CoinAPI');

class MySQLBackend {

  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection= null;
  }

  async connect() {
    this.connection=await mysql.createConnection({
      host:"localhost",
      port:3406,
      user:"root",
      password:"mypassword",
      database:"maxcoin",
    });
    return this.connection;
  }

  async disconnect() {
    return this.connection.end();
  }

  async insert() {
    const data=await this.coinAPI.fetch();
    const sql="INSERT INTO coinvalues(valuedate, coinvalue) VALUES?";
    const values=[];
    Object.entries(data.bpi).forEach((entry)=>{
      values.push([entry[0],entry[1]]);
    });
    return this.connection.query(sql, [values]);
  }

  async getMax() {
    return this.connection.query("SELECT * FROM coinvalues ORDER by coinvalue DESC LIMIT 0,1"
    );
  }

  async max() {
    console.info("Connect to MySQL");
    console.time("mysql-connect");
    const connection= this.connect();
    if (connection){
      console.info("Successfully connected to MySQL");
    }else{
      throw new Error("Connceting to MySQL failed");
    }
    console.timeEnd("mysql-connect");

    console.info("Inserting into MySQL");
    console.time("mysql-insert");
    const insertResult=await this.insert();
    console.timeEnd("mysql-insert");
    
    console.info(`Inserted ${insertResult[0].affectRows} documents into MySQL`);

    console.info("Querying MySQL"); 
    console.time("mysql-find"); // time of finding
    const result=  await this.getMax(); // asynch get max
    const row=result[0][0];
    console.timeEnd("mysql-find"); // stop time

    console.info("Disconnecting to MySQL");
    console.time("mysql-disconnect");
    this.disconnect();
    console.timeEnd("mysql-disconnect");
    return row;
  }
}

module.exports = MySQLBackend;