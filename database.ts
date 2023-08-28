import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

interface Transaction {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
  createdAt: string;
  id: number;
}

class DatabaseManager {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async insertTransaction(transaction: Transaction) {
    await this.db.run(
      'INSERT INTO transactions (description, price, category, type, createdAt, id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        transaction.description,
        transaction.price,
        transaction.category,
        transaction.type,
        transaction.createdAt,
        transaction.id,
      ]
    );
  }

  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.db.all('SELECT * FROM transactions');
    return transactions;
  }
}

export async function createDatabaseManager(): Promise<DatabaseManager> {
  const db = await open({
    filename: 'database.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY,
      description TEXT,
      price REAL,
      category TEXT,
      type TEXT,
      createdAt TEXT
    )
  `);

  return new DatabaseManager(db);
}
