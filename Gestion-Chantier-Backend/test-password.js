const bcrypt = require('bcryptjs');

const password = 'password123';
const storedHash = '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe';

console.log('Testing password:', password);
console.log('Stored hash:', storedHash);

bcrypt.compare(password, storedHash, (err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Match result:', result);
    }
    
    // Also test creating a new hash
    bcrypt.hash(password, 10, (err, newHash) => {
        if (err) {
            console.error('Error creating hash:', err);
        } else {
            console.log('\nNew hash for same password:', newHash);
            bcrypt.compare(password, newHash, (err, result2) => {
                console.log('New hash match:', result2);
            });
        }
    });
});
