import multer from 'multer'

// Central error handler. Translates Multer upload errors into friendly
// messages the React UI can show directly.
export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Image must be 10MB or smaller.' })
    }
    return res.status(400).json({ error: err.message })
  }

  // Sequelize unique/validation errors -> 400 with a readable message.
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'An account with that email already exists.' })
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Validation failed.' })
  }

  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong.' })
}
