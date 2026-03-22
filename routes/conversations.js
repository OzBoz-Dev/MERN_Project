const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.get('/member_users', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'conversations.member_users works',
            database_status: 'Connected!',
            db_name: db.databaseName,
            active_collections: collections.map(col => col.name)
          }
        );
      }
      catch (err) {
        res.status(500).json({error: err.message});
      }
    });

router.get('/messages', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'conversations.messages works',
            database_status: 'Connected!',
            db_name: db.databaseName,
            active_collections: collections.map(col => col.name)
          }
        );
      }
      catch (err) {
        res.status(500).json({error: err.message});
      }
    });

router.get('/:_id', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'conversations._id works',
            database_status: 'Connected!',
            db_name: db.databaseName,
            active_collections: collections.map(col => col.name)
          }
        );
      }
      catch (err) {
        res.status(500).json({error: err.message});
      }
    });

module.exports = router;
