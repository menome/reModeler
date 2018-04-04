/** 
 * Copyright (C) 2017 Menome Technologies Inc.  
 * 
 * A small service that is built to sync the contents of an S3/Minio bucket with a structure of nodes in Neo4j.
 * For use with theLink.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config.js');
var harvester = require('./harvester.js');
// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "File Sync Service",
  desc: "Updates the graph based on events from Minio",
  logging: config.get('logging'),
  port: config.get('port'),
  rabbit: config.get('rabbit'),
  neo4j: config.get('neo4j')
});

// Register our sync endpoint.
bot.registerEndpoint({
  "name": "Full Sync",
  "path": "/fullsync",
  "method": "POST",
  "desc": "runs a full model of the graph to the topic modeler."
}, function(req,res) {
  harvester.fullSync();
  return res.send(
    bot.responseWrapper({
        status: "success",
        message: "Modeling Documents"
      })
  )
});

// Start the bot.
bot.start();
bot.changeState({state: "idle"})