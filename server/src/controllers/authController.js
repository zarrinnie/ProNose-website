import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { signToken } from '../middleware/auth.js'

// Loads a user with their assigned doctor, returned in a client-friendly shape.
async function userWithDoctor(id) {
  const user = await User.findByPk(id, {
    include: [{ model: User, as: 'assignedDoctor' }],
  })
  if (!user) return null
  const safe = user.toSafeJSON()
  if (safe.assignedDoctor) delete safe.assignedDoctor.password_hash
  return safe
}

export async function register(req, res, next) {
  try {
    const {
      full_name,
      email,
      mobile_number,
      password,
      date_of_birth,
      role,
      assigned_doctor_id,
      prosthesis_type,
    } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' })
    }

    // Only prosthesis types that are actually live may be self-registered.
    const LIVE_PROSTHESES = ['nose', 'microtia']
    const prosthesisType = LIVE_PROSTHESES.includes(prosthesis_type) ? prosthesis_type : 'nose'

    const password_hash = await bcrypt.hash(password, 10)
    const created = await User.create({
      full_name,
      email,
      mobile_number,
      password_hash,
      date_of_birth: date_of_birth || null,
      // Only allow self-registration as a patient; elevated roles are seeded
      // or assigned by an admin.
      role: role === 'doctor' || role === 'super_admin' ? 'patient' : role || 'patient',
      assigned_doctor_id: assigned_doctor_id || null,
      prosthesis_type: prosthesisType,
    })

    const token = signToken(created)
    const user = await userWithDoctor(created.id)
    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const found = await User.findOne({ where: { email } })
    if (!found || !(await found.verifyPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = signToken(found)
    const user = await userWithDoctor(found.id)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await userWithDoctor(req.user.id)
    res.json({ user })
  } catch (err) {
    next(err)
  }
}
