const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const Tour = require('../models/tourModel.js');

let mongod;

module.exports.imporDefaultData = async () => {
  const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-test-data.json`, 'utf-8') 
  );
  try {
    await Tour.create(tours);
  } catch (err) {
    console.log(err);
  }
};

module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    dbName: 'testDB',
  });

//   await this.imporDefaultData();
};

module.exports.closeDatabase = async () => {
    await mongoose.disconnect();
    await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach(async (key) => {
    const collection = collections[key];
    await collection.deleteMany();
  });
};
