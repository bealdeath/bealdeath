const bcrypt = require('bcryptjs');

// Plain password
const plainPassword = 'password123';

// Example hash from the database (replace with actual hash)
const hashedPasswordFromDB = '$2a$10$YWqPNe.mQYGCIlye14f8HO6tBZXXuS7hgrpDDJ.9Gl0WWm0oRXRAW';

console.log('Plain Password:', plainPassword);
console.log('Hashed Password from DB:', hashedPasswordFromDB);

// Compare the plain password with the hash from the database
bcrypt.compare(plainPassword, hashedPasswordFromDB, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password verification result with DB hash:', isMatch);
  }
});

// Generate a new hash for the plain password (for testing purposes)
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
