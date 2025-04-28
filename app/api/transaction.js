import { connectToDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// POST /api/transaction - Add a new transaction
export async function POST(req) {
  const db = await connectToDB();

  try {
    const { amount, description, date } = await req.json();

    // Validate input
    if (!amount || !description || !date) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Insert transaction into the database
    const result = await db.collection('transactions').insertOne({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
    });

    return NextResponse.json({
      message: 'Transaction added successfully',
      transaction: {
        _id: result.insertedId,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
      },
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json(
      { error: 'Failed to add transaction', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/transaction - Get all transactions
export async function GET(req) {
  const db = await connectToDB();

  try {
    // Fetch all transactions from the database
    const transactions = await db.collection('transactions').find({}).toArray();

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error.message },
      { status: 500 }
    );
  }
}
