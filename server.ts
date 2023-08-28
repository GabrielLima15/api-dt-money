import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3333;

app.use(cors());
app.use(bodyParser.json());

const databasePath = path.join(__dirname, 'database.db');

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API dt-money' });
});

app.get('/transactions', async (req, res) => {
  try {
    const db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    const transactions = await db.all('SELECT * FROM transactions');
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const newTransaction = req.body;

    const db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      'INSERT INTO transactions (description, price, category, type, createdAt, id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        newTransaction.description,
        newTransaction.price,
        newTransaction.category,
        newTransaction.type,
        newTransaction.createdAt,
        newTransaction.id,
      ]
    );

    if (result.changes !== undefined && result.changes > 0) {
      res.status(201).json(newTransaction);
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/transactions/:id', async (req, res) => {
  try {
    const transactionId = req.params.id;

    const db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    const result = await db.run(
      'DELETE FROM transactions WHERE id = ?',
      transactionId
    );

    if (result.changes !== undefined && result.changes > 0) {
      res.json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port:${port}`);
});
