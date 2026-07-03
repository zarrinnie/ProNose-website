import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

// Verifies the Bearer token and loads the user onto req.user.
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      return res.status(401).json({ error: 'Authentication required.' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(payload.id)
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

// Guards a route to one or more roles. Use after authenticate.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have access to this resource.' })
    }
    next()
  }
}

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
