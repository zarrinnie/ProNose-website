import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    message_body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    // Chat only needs creation time; no updated_at column.
    updatedAt: false,
  }
)

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' })
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiver_id' })

export default Message
