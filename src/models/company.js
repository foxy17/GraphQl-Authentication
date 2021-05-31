module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        company: {type: DataTypes.STRING,allowNull: false},
        employeeId:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, unique: true },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    Company.associate = function (models) {
        Company.belongsTo(models.User, { foreignKey: "employeeId" });
      };
    return Company;
  };