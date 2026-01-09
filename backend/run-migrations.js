const { exec } = require('child_process');
const path = require('path');

console.log('🔄 Running database migrations...');

const sequelizePath = path.join(__dirname, 'node_modules', '.bin', 'sequelize');
const command = `"${sequelizePath}" db:migrate`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Migration error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(stdout);
  console.log('✅ Migrations completed successfully!');
});
