import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')

// Remove a locally-stored upload given its served URL (e.g. "/uploads/x.png").
// External URLs (seed placeholders) and missing files are ignored.
export async function deleteUploadIfLocal(url) {
  if (!url || !url.startsWith('/uploads/')) return
  const filename = path.basename(url)
  try {
    await fs.unlink(path.join(UPLOADS_DIR, filename))
  } catch {
    /* already gone — ignore */
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    cb(null, unique)
  },
})

function imageFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    // Surfaced by the error handler as a friendly message.
    const err = new Error('Only image files are allowed.')
    err.status = 400
    cb(err)
  }
}

// Strictly enforce a 10MB maximum file size.
export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})
