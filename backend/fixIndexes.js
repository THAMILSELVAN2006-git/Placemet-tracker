require('dotenv').config();
const mongoose = require('mongoose');

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_tracker');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('progresses');

    // Delete all progress records with null student field
    console.log('Deleting corrupted progress records...');
    const deleteResult = await collection.deleteMany({ student: null });
    console.log(`Deleted ${deleteResult.deletedCount} corrupted records`);

    // Drop all indexes except _id
    console.log('Dropping old indexes...');
    try {
      await collection.dropIndexes();
      console.log('Old indexes dropped');
    } catch (err) {
      console.log('No indexes to drop or error:', err.message);
    }

    // Create new index on student field
    console.log('Creating new index on student field...');
    await collection.createIndex({ student: 1 }, { unique: true });
    console.log('New index created successfully');

    console.log('✅ Database fix completed!');
    console.log('You can now restart your backend server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
};

fixIndexes();
