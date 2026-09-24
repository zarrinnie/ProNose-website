import { DataTypes, Model } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/db.js'

class User extends Model {
  async verifyPassword(plain) {
    return bcrypt.compare(plain, this.password_hash)
  }

  // Strips the password hash so a user is safe to send to the client.
  toSafeJSON() {
    const { password_hash, ...rest } = this.toJSON()
    return rest
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('patient', 'doctor', 'super_admin'),
      allowNull: false,
      defaultValue: 'patient',
    },
    // Which prosthesis this patient is cared for. Chosen at registration;
    // drives the app theme and scopes their care guides. Null for staff.
    prosthesis_type: {
      type: DataTypes.ENUM('nose', 'microtia', 'ocular', 'digit'),
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assigned_doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
)

// Self-referential association: a patient is assigned to a doctor.
User.belongsTo(User, { as: 'assignedDoctor', foreignKey: 'assigned_doctor_id' })
User.hasMany(User, { as: 'patients', foreignKey: 'assigned_doctor_id' })

export default User
