import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'

class Consultation extends Model {}

Consultation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('regular', 'emergency'),
      allowNull: false,
      defaultValue: 'regular',
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    prosthetic_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    q_doing_okay: { type: DataTypes.TEXT, allowNull: true },
    q_discomfort: { type: DataTypes.TEXT, allowNull: true },
    q_color_fading: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    q_color_fading_details: { type: DataTypes.TEXT, allowNull: true },
    q_deforming: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    q_deforming_details: { type: DataTypes.TEXT, allowNull: true },
    q_daily_issues: { type: DataTypes.TEXT, allowNull: true },
    additional_comments: { type: DataTypes.TEXT, allowNull: true },
    // Visible only to doctor / super_admin (enforced in controllers).
    doctor_notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Consultation',
    tableName: 'consultations',
  }
)

Consultation.belongsTo(User, { as: 'patient', foreignKey: 'patient_id' })
User.hasMany(Consultation, { as: 'consultations', foreignKey: 'patient_id' })

export default Consultation
