import sequelize from '../config/db.js'
import User from './User.js'
import Consultation from './Consultation.js'
import Message from './Message.js'
import CareGuide from './CareGuide.js'

// Associations are declared in each model file; importing them here ensures
// they are all registered before sequelize.sync() runs.
export { sequelize, User, Consultation, Message, CareGuide }
