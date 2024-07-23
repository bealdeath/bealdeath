const bcrypt = require('bcryptjs');

// Plain password
const plainPassword = 'password123';

// Example hash from the database (replace with actual hash)
const hashedPasswordFromDB = '$2a$10$wY6CLiP9fWW4NWfx.47eFe/JRSnsfadB17Xsv4HFjm4Gpi8T5mKu.';

// Compare the plain password with the hash from the database
bcrypt.compare(plainPassword, hashedPasswordFromDB, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match result:', isMatch);
  }
});
