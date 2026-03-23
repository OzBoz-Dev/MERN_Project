const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/author_id', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'comments.author_id works',
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

router.get('/body', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'comments.body works',
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

router.get('/likes', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'comments.likes works',
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

router.get('/post_id_belong', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json(
          { 
            message: 'comments.post_id_belong works',
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
            message: 'comments._id works',
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
