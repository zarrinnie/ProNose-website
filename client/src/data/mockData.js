// Mock data used across the app until a real backend is attached.

export const mockDoctor = {
  id: 'doc-1',
  name: 'Dr. Lena Hart',
  specialty: 'Maxillofacial Prosthetics',
  avatar: 'https://i.pravatar.cc/150?img=47',
  clinic: 'Northbridge Reconstructive Clinic',
}

export const mockPatient = {
  id: 'pat-1',
  name: 'Amelia Rose',
  email: 'amelia.rose@example.com',
  mobile: '+1 (415) 555-0142',
  dob: '14 / 03 / 1991',
  avatar: 'https://i.pravatar.cc/150?img=32',
  prostheticInstallDate: '02 / 02 / 2026',
  doctor: mockDoctor,
}

export const clinicLogo = 'https://placehold.co/120x120/33E4DB/FFFFFF?text=pN'

// Statuses: 'pending' | 'reviewed'
// Types: 'weekly' | 'emergency'
export const initialConsultations = [
  {
    id: 'c-1004',
    type: 'weekly',
    date: '14 Jun 2026',
    status: 'reviewed',
    photo: 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo',
    doctorNote: 'Looking great — colour is stable. Keep up the daily cleaning routine.',
    answers: {
      doingOkay: 'Feeling good overall, energy is back to normal.',
      discomfort: 'No discomfort this week.',
      colorFading: 'no',
      colorFadingDetails: '',
      deforming: 'no',
      deformingDetails: '',
      dailyIssues: 'None.',
      comments: 'Weekly check-in.',
    },
  },
  {
    id: 'c-1003',
    type: 'emergency',
    date: '09 Jun 2026',
    status: 'reviewed',
    photo: 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo',
    doctorNote: 'The redness is mild irritation. Pause adhesive for 24h and reapply gently.',
    answers: {
      doingOkay: 'A bit worried about redness around the edge.',
      discomfort: 'Slight itching where the prosthetic meets the skin.',
      colorFading: 'no',
      colorFadingDetails: '',
      deforming: 'no',
      deformingDetails: '',
      dailyIssues: 'Adhesive felt less secure today.',
      comments: 'Noticed redness after removing it this morning.',
    },
  },
  {
    id: 'c-1002',
    type: 'weekly',
    date: '07 Jun 2026',
    status: 'reviewed',
    photo: 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo',
    doctorNote: 'All normal. See you next week.',
    answers: {
      doingOkay: 'All good.',
      discomfort: 'None.',
      colorFading: 'no',
      colorFadingDetails: '',
      deforming: 'no',
      deformingDetails: '',
      dailyIssues: 'None.',
      comments: '',
    },
  },
  {
    id: 'c-1001',
    type: 'weekly',
    date: '31 May 2026',
    status: 'pending',
    photo: 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo',
    doctorNote: '',
    answers: {
      doingOkay: 'Doing well, getting used to the routine.',
      discomfort: 'Minor at the end of the day.',
      colorFading: 'yes',
      colorFadingDetails: 'Slightly lighter near the bridge under bright light.',
      deforming: 'no',
      deformingDetails: '',
      dailyIssues: 'Hard to clean the inner edge.',
      comments: 'Would love tips on cleaning.',
    },
  },
]

export const initialMessages = [
  {
    id: 'm-1',
    sender: 'doctor',
    text: 'Hi Amelia! How are you feeling with the new prosthetic this week?',
    time: '09:02',
  },
  {
    id: 'm-2',
    sender: 'patient',
    text: 'Morning Dr. Hart! Feeling good, just a little itching at the edges.',
    time: '09:05',
  },
  {
    id: 'm-3',
    sender: 'doctor',
    text: 'That can be normal as the skin adjusts. Keep the area clean and dry. Let me know if it worsens.',
    time: '09:07',
  },
]

// Canned doctor replies used to make the chat mock feel alive.
export const cannedDoctorReplies = [
  'Thanks for letting me know — I will take a look shortly.',
  'Got it. Could you send a quick photo so I can see clearly?',
  'That sounds normal, but keep an eye on it and update me tomorrow.',
  "Great progress! Keep following the cleaning routine we discussed.",
]
