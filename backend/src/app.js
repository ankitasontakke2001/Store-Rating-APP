const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, User } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));
app.use('/api', require('./routes/ratingRoutes')); // GET /stores, POST /stores/:id/rate

// quick health
app.get('/', (req, res) => res.json({ ok: true }));

// start after sync
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    // create tables (sync)
    await sequelize.sync({ alter: true });
    // create a default admin if none exists
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ where: { email: adminEmail }});
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash('Admin@1234', 10);
      await User.create({ name: 'System Administrator AdminUserTestLong', email: adminEmail, address: 'Head Office', password: hashed, role: 'admin' });
      console.log('Default admin created: admin@example.com with password Admin@1234');
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('DB connection error', err);
  }
})();


