const bcrypt = require('bcryptjs');

// Define test password
const testPassword = 'password123';

// Hash the password
bcrypt.hash(testPassword, 10, (err, hashedPassword) => {
  if (err) {
    return console.error('Error hashing password:', err);
  }
  
  console.log('Hashed password:', hashedPassword);

  // Compare the password with the hashed password
  bcrypt.compare(testPassword, hashedPassword, (err, isMatch) => {
    if (err) {
      return console.error('Error comparing password:', err);
    }

    console.log(`Password comparison result: ${isMatch}`);
  });
});
