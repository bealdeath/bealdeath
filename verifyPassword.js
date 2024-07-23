const bcrypt = require('bcryptjs');

// Test password
const testPassword = 'password123';

// Hash the password
bcrypt.hash(testPassword, 10, (err, hash) => {
  if (err) {
    return console.error('Error hashing password:', err);
  }
  
  console.log('Hashed password:', hash);

  // Compare the password with the hashed password
  bcrypt.compare(testPassword, hash, (err, isMatch) => {
    if (err) {
      return console.error('Error comparing password:', err);
    }

    console.log(`Password comparison result: ${isMatch}`);
  });
});
