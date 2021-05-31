const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: {type: DataTypes.STRING,allowNull: false},
        employeeId:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, unique: true },
    }, {timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
             if (user.password) {
              const salt = await bcrypt.genSaltSync(10, 'a');
              user.password = bcrypt.hashSync(user.password, salt);
             }
            },
            beforeUpdate:async (user) => {
             if (user.password) {
              const salt = await bcrypt.genSaltSync(10, 'a');
              user.password = bcrypt.hashSync(user.password, salt);
             }
            }
           }
    });
    User.associate = function (models) {
        User.hasOne(models.Company, { foreignKey: "employeeId" });
      };
    User.validPassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
       }
    return User;
  };