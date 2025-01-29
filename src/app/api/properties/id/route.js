import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';

// Helper function to validate MongoDB ID
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to handle database connection
const withDBConnection = async (handler) => {
  try {
    await connectDB();
    return await handler();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
};

export async function GET(request, { params }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

    const property = await withDBConnection(async () => {
      return await Property.findById(params.id);
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('GET property error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const property = await withDBConnection(async () => {
      return await Property.findByIdAndUpdate(
        params.id,
        { ...body },
        { new: true, runValidators: true }
      );
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('PUT property error:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

    const property = await withDBConnection(async () => {
      return await Property.findByIdAndDelete(params.id);
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('DELETE property error:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
