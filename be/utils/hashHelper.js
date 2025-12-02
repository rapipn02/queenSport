const bcrypt = require('bcryptjs');

// Hash password dengan bcrypt
const hashPassword = async (password) => {
    const saltRounds = 10; // 2^10 = 1024 iterasi
    return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    verifyPassword
};