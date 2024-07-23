const bcrypt = require('bcryptjs');

const plainPassword = 'password123';
const hashedPassword = '$2a$10$3sG1i4Jpl9vD2dMr4Yu7nOkqvBq49P6UGhjFAIQHVto0seRUtRs7y'; // Use the hash generated in Step 1

console.log('Plain Password:', plainPassword);
console.log('Hashed Password from DB:', hashedPassword);

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match result:', isMatch);
  }
});
