#!/bin/bash

echo "🌱 JANI Database Seeding Script"
echo "================================"
echo ""

if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the services/auth directory"
  exit 1
fi

echo "🔍 Checking MongoDB connection..."
if ! docker exec jani-mongo mongosh --quiet --eval "db.version()" > /dev/null 2>&1; then
  echo "❌ Error: MongoDB is not accessible. Is the jani-mongo container running?"
  echo "   Try: docker-compose up -d"
  exit 1
fi
echo "✅ MongoDB is accessible"
echo ""

echo "👥 Checking if users are already seeded..."
USER_COUNT=$(docker exec jani-mongo mongosh --quiet jani-ai-auth --eval "db.users.countDocuments()" 2>/dev/null)

if [ "$USER_COUNT" -eq "0" ]; then
  echo "📝 Seeding users..."
  npm run seed 2>/dev/null || node src/scripts/seedUsers.js
  echo "✅ Users seeded"
else
  echo "✅ Users already seeded ($USER_COUNT users found)"
fi
echo ""

echo "🌾 Seeding main application data..."
node seed-all-data.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Error: Failed to seed main application data"
  exit 1
fi
echo ""

echo "📝 Seeding traceability events..."
node seed-traceability-events.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Error: Failed to seed traceability events"
  exit 1
fi
echo ""

echo "📊 Final Database State:"
echo "════════════════════════"
docker exec jani-mongo mongosh --quiet --eval "
['jani-ai-auth', 'jani-traceability'].forEach(function(dbName) {
  db = db.getSiblingDB(dbName);
  print('');
  print('Database: ' + dbName);
  print('─────────────────────────');
  db.getCollectionNames().forEach(function(col) {
    var count = db[col].countDocuments();
    if (count > 0) {
      print('  ' + col + ': ' + count + ' documents');
    }
  });
});
print('');
" 2>/dev/null

echo ""
echo "✨ Database seeding complete!"
echo ""
echo "🎯 Quick Start:"
echo "   • Web Admin: http://localhost:3000/admin"
echo "   • Login as: admin@jani.test / Admin123!"
echo "   • Or: farm-owner@jani.test / Password123!"
echo ""
