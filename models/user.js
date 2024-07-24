const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, 10);
    }

    async comparePassword(plainPassword) {
      return bcrypt.compare(plainPassword, this.password);
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'viewer'),
      defaultValue: 'viewer'
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (!user.changed('password')) return;
        console.log(`Hashing password for ${user.email}`);
        user.password = await User.hashPassword(user.password);
        console.log(`Hashed password: ${user.password}`);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          console.log(`Updating password for ${user.email}`);
          user.password = await User.hashPassword(user.password);
          console.log(`Updated hashed password: ${user.password}`);
        }
      }
    },
    timestamps: true, // Enable timestamps
  });

  return User;
};
