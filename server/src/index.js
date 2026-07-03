import dotenv from 'dotenv'
import app from './app.js'
import { sequelize } from './models/index.js'

dotenv.config()

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await sequelize.authenticate()
    // Create/update tables to match the models.
    await sequelize.sync()
    console.log('Database connected and synced.')

    app.listen(PORT, () => {
      console.log(`proNose API listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
