import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { sequelize, User, Consultation, Message } from './models/index.js'

dotenv.config()

// Demo password for every seeded account.
const DEMO_PASSWORD = 'password123'

async function seed() {
  await sequelize.authenticate()
  // Recreate all tables from scratch so seeding is idempotent.
  await sequelize.sync({ force: true })

  const password_hash = await bcrypt.hash(DEMO_PASSWORD, 10)

  const admin = await User.create({
    role: 'super_admin',
    full_name: 'System Admin',
    email: 'admin@pronose.com',
    mobile_number: '+1 (415) 555-0100',
    password_hash,
  })

  const doctor = await User.create({
    role: 'doctor',
    full_name: 'Dr. Lena Hart',
    email: 'lena.hart@pronose.com',
    mobile_number: '+1 (415) 555-0111',
    password_hash,
  })

  const patient = await User.create({
    role: 'patient',
    full_name: 'Amelia Rose',
    email: 'amelia.rose@example.com',
    mobile_number: '+1 (415) 555-0142',
    date_of_birth: '1991-03-14',
    password_hash,
    assigned_doctor_id: doctor.id,
  })

  const PLACEHOLDER = 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo'

  await Consultation.bulkCreate([
    {
      patient_id: patient.id,
      type: 'regular',
      status: 'reviewed',
      prosthetic_image_url: PLACEHOLDER,
      doctor_notes: 'Looking great — colour is stable. Keep up the daily cleaning routine.',
      q_doing_okay: 'Feeling good overall, energy is back to normal.',
      q_discomfort: 'No discomfort this week.',
      q_color_fading: false,
      q_color_fading_details: '',
      q_deforming: false,
      q_deforming_details: '',
      q_daily_issues: 'None.',
      additional_comments: 'Weekly check-in.',
      created_at: new Date('2026-06-14T09:00:00'),
    },
    {
      patient_id: patient.id,
      type: 'emergency',
      status: 'reviewed',
      prosthetic_image_url: PLACEHOLDER,
      doctor_notes: 'The redness is mild irritation. Pause adhesive for 24h and reapply gently.',
      q_doing_okay: 'A bit worried about redness around the edge.',
      q_discomfort: 'Slight itching where the prosthetic meets the skin.',
      q_color_fading: false,
      q_color_fading_details: '',
      q_deforming: false,
      q_deforming_details: '',
      q_daily_issues: 'Adhesive felt less secure today.',
      additional_comments: 'Noticed redness after removing it this morning.',
      created_at: new Date('2026-06-09T14:30:00'),
    },
    {
      patient_id: patient.id,
      type: 'regular',
      status: 'reviewed',
      prosthetic_image_url: PLACEHOLDER,
      doctor_notes: 'All normal. See you next week.',
      q_doing_okay: 'All good.',
      q_discomfort: 'None.',
      q_color_fading: false,
      q_color_fading_details: '',
      q_deforming: false,
      q_deforming_details: '',
      q_daily_issues: 'None.',
      additional_comments: '',
      created_at: new Date('2026-06-07T10:15:00'),
    },
    {
      patient_id: patient.id,
      type: 'regular',
      status: 'pending',
      prosthetic_image_url: PLACEHOLDER,
      doctor_notes: '',
      q_doing_okay: 'Doing well, getting used to the routine.',
      q_discomfort: 'Minor at the end of the day.',
      q_color_fading: true,
      q_color_fading_details: 'Slightly lighter near the bridge under bright light.',
      q_deforming: false,
      q_deforming_details: '',
      q_daily_issues: 'Hard to clean the inner edge.',
      additional_comments: 'Would love tips on cleaning.',
      created_at: new Date('2026-05-31T08:45:00'),
    },
  ])

  await Message.bulkCreate([
    {
      sender_id: doctor.id,
      receiver_id: patient.id,
      message_body: 'Hi Amelia! How are you feeling with the new prosthetic this week?',
      created_at: new Date('2026-06-20T09:02:00'),
    },
    {
      sender_id: patient.id,
      receiver_id: doctor.id,
      message_body: 'Morning Dr. Hart! Feeling good, just a little itching at the edges.',
      created_at: new Date('2026-06-20T09:05:00'),
    },
    {
      sender_id: doctor.id,
      receiver_id: patient.id,
      message_body:
        'That can be normal as the skin adjusts. Keep the area clean and dry. Let me know if it worsens.',
      created_at: new Date('2026-06-20T09:07:00'),
    },
  ])

  console.log('Seed complete. Demo accounts (password: password123):')
  console.log('  super_admin  admin@pronose.com')
  console.log('  doctor       lena.hart@pronose.com')
  console.log('  patient      amelia.rose@example.com')

  await sequelize.close()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
