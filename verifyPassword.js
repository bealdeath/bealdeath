const bcrypt = require('bcryptjs');

const plainPassword = 'password123';
const hashedPassword = '$2a$10$xxfk6J2fO3ATGT0NCrvqaur0E/EG70l47TT.JfDneP5UPwdwkVvW6'; // Replace with actual hashed password from the database

console.log('Plain Password:', plainPassword);
console.log('Hashed Password from DB:', hashedPassword);

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match result:', isMatch);
  }
});
