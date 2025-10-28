const mongoose = require('mongoose');

// Minimal user schema to satisfy traceability references. The broader user service
// owns the full schema; we only need enough structure for population in this service.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true,
    default: 'active'
  }
}, {
  timestamps: true,
  strict: false
});

module.exports = mongoose.model('User', userSchema);
