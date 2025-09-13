const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const NAME_MIN = 20, NAME_MAX = 60;
const ADDR_MAX = 400;
const PASS_MIN = 8, PASS_MAX = 16;
const PASS_REGEX = /(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/;

function validatePassword(p) {
  return p.length >= PASS_MIN && p.length <= PASS_MAX && PASS_REGEX.test(p);
}

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    if (!name || name.length < NAME_MIN || name.length > NAME_MAX) return res.status(400).json({ message: `Name must be ${NAME_MIN}-${NAME_MAX} chars.` });
    if (!address || address.length > ADDR_MAX) return res.status(400).json({ message: `Address max ${ADDR_MAX} chars.` });
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and special char' });

    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role: 'user' });
    return res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
