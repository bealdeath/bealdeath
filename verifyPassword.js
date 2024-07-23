const bcrypt = require('bcryptjs');

// Plain password and hash from your database
const plainPassword = 'password123';
const hashedPasswordFromDB = '$2a$10$N73eJKKDfnyfiR9xlfVvze6LyCYka9dx7ex.xUulIHYzw6R2Xt1IS';

// Step 1: Hash the plain password and immediately compare it
bcrypt.hash(plainPassword, 10, (err, generatedHash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  console.log('Generated Hash:', generatedHash);

  // Compare the plain password with the generated hash
  bcrypt.compare(plainPassword, generatedHash, (err, isMatch) => {
    if (err) {
      console.error('Error comparing passwords with generated hash:', err);
    } else {
      console.log('Immediate password verification result:', isMatch);
    }
  });
});

// Step 2: Compare the plain password with the hash from your database
bcrypt.compare(plainPassword, hashedPasswordFromDB, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords with DB hash:', err);
  } else {
    console.log('Password verification result with DB hash:', isMatch);
  }
});
