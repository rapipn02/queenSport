const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { verifyPassword } = require('../utils/hashHelper');

//untuk login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'username dan password harus diisi'
            });
        } 
        
        //fungsi mencari user di database
        const [users] = await db.query('SELECT * FROM user WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'username salah'
            });
        }

        const user = users[0];

        //verifikasi passwordnya menggunakan helper function
        const isMatch = await verifyPassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'password salah'
            });
        }

        //generate jwt token
        const token = jwt.sign(
            {
                id_user: user.id_user,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'login berhasil',
            data: {
                token,
                user: {
                    id_user: user.id_user,
                    username: user.username
                }
            }
        });

    } catch (error) {
        console.error('login error:', error); // ✅ DIPERBAIKI: error (bukan erorr)
        res.status(500).json({
            success: false,
            message: 'terjadi kesalahan pada server'
        });
    }
};