import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db.js'

// A single patient-education topic (prosthesis care, wound care, pain, diet,
// warning signs). Content is authored Markdown so a super_admin can edit it in
// place; patients see it rendered through the app's UI. Topics are fixed and
// seeded — there is no create/delete endpoint, only read and update.
class CareGuide extends Model {}

CareGuide.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Which prosthesis this guide belongs to. Slugs (e.g. 'wound-care') repeat
    // across types, so uniqueness is on the (prosthesis_type, slug) pair below.
    prosthesis_type: {
      type: DataTypes.ENUM('nose', 'microtia', 'ocular', 'digit'),
      allowNull: false,
      defaultValue: 'nose',
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    // lucide-react icon name, e.g. 'SprayCan'.
    icon: { type: DataTypes.STRING, allowNull: true },
    // Pastel accent key used for the hub card chip, e.g. 'lavender'.
    accent: { type: DataTypes.STRING, allowNull: true, defaultValue: 'lavender' },
    summary: { type: DataTypes.STRING(500), allowNull: true },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    // { reviewer, lastReviewed, contact: { clinicName, phone, hours, afterHours } }
    meta: { type: DataTypes.JSON, allowNull: true },
    sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: 'CareGuide',
    tableName: 'care_guides',
    indexes: [{ unique: true, fields: ['prosthesis_type', 'slug'] }],
  }
)

export default CareGuide
