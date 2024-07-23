const bcrypt = require('bcryptjs');

// Plain password
const plainPassword = 'password123';

// Example hash from the database (replace with actual hash)
const hashedPasswordFromDB = '$2a$10$N73eJKKDfnyfiR9xlfVvze6LyCYka9dx7ex.xUulIHYzw6R2Xt1IS';

console.log('Plain Password:', plainPassword);
console.log('Hashed Password from DB:', hashedPasswordFromDB);

// Generate a new hash to check immediate verification
bcrypt.hash(plainPassword, 10, (err, generatedHash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }

  console.log('Generated Hash:', generatedHash);

  // Immediately compare the plain password with the generated hash
  bcrypt.compare(plainPassword, generatedHash, (err, immediateIsMatch) => {
    if (err) {
      console.error('Error comparing immediate passwords:', err);
    } else {
      console.log('Immediate password verification result:', immediateIsMatch);
    }
  });

  // Compare the plain password with the hash from the database
  bcrypt.compare(plainPassword, hashedPasswordFromDB, (err, dbIsMatch) => {
    if (err) {
      console.error('Error comparing password with DB hash:', err);
    } else {
      console.log('Password verification result with DB hash:', dbIsMatch);
    }
  });
});
