const bcrypt = require('bcryptjs');

// Plain password
const plainPassword = 'password123';

// Example hash from the database (replace with actual hash)
const hashedPasswordFromDB = '$2a$10$N73eJKKDfnyfiR9xlfVvze6LyCYka9dx7ex.xUulIHYzw6R2Xt1IS';

console.log('Plain Password:', plainPassword);
console.log('Hashed Password from DB:', hashedPasswordFromDB);

// Hash the password
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  console.log('Generated Hash:', hash);

  // Immediately compare the plain password with the generated hash
  bcrypt.compare(plainPassword, hash, (err, isMatch) => {
    if (err) {
      console.error('Error comparing passwords:', err);
    } else {
      console.log('Immediate password verification result:', isMatch);
    }
  });
});

// Compare the plain password with the hash from the database
bcrypt.compare(plainPassword, hashedPasswordFromDB, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password verification result with DB hash:', isMatch);
  }
});
