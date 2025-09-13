const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');

const Rating = sequelize.define('Rating', {
  score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
}, {
  timestamps: true
});

User.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(User);

Store.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(Store);

module.exports = Rating;
