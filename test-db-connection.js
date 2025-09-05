// Test script to verify database connection
// Run this with: node test-db-connection.js

const postgres = require('postgres');

async function testConnection() {
  // Replace with your Railway DATABASE_URL
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@host:port/database';
  
  console.log('Testing database connection...');
  console.log('Database URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Hide password in logs
  
  try {
    const sql = postgres(DATABASE_URL);
    
    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result);
    
    // Test if we can create tables
    await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)`;
    console.log('✅ Table creation successful!');
    
    // Clean up test table
    await sql`DROP TABLE IF EXISTS test_table`;
    console.log('✅ Database is ready for your app!');
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    console.log('\nPlease check:');
    console.log('1. Your DATABASE_URL is correct');
    console.log('2. The database is running in Railway');
    console.log('3. Your internet connection is working');
  }
}

testConnection();
