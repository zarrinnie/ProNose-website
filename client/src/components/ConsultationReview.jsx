import { useState } from 'react'
import { ChevronLeft, Trash2 } from 'lucide-react'
import TopBar from './TopBar'
import PillButton from './PillButton'
import { reviewConsultation, deleteConsultation } from '../api/consultations'

// Shared consultation detail + review panel. Used by the doctor dashboard
// (no delete) and the admin Consultations tab (with delete, via onDeleted).
export default function ConsultationReview({
  consultation,
  personName,
  personAvatar,
  onBack,
  onSaved,
  onDeleted,
}) {
  const a = consultation.answers
  const [notes, setNotes] = useState(consultation.doctorNote || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  const rows = [
    ['Doing okay?', a.doingOkay],
    ['Discomfort?', a.discomfort],
    ['Colour fading?', a.colorFading === 'yes' ? `Yes — ${a.colorFadingDetails}` : 'No'],
    ['Deforming?', a.deforming === 'yes' ? `Yes — ${a.deformingDetails}` : 'No'],
    ['Daily-use issues?', a.dailyIssues],
    ['Comments', a.comments || '—'],
  ]

  const save = async (markReviewed) => {
    setError('')
    setSaving(true)
    try {
      const updated = await reviewConsultation(consultation.id, {
        doctor_notes: notes,
        status: markReviewed ? 'reviewed' : consultation.status,
      })
      onSaved(updated)
    } catch (err) {
      setError(err.message || 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setError('')
    setDeleting(true)
    try {
      await deleteConsultation(consultation.id)
      onDeleted(consultation.id)
    } catch (err) {
      setError(err.message || 'Could not delete.')
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Review Consultation" showBack onBack={onBack} />
      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
        <div className="flex items-center gap-3">
          {personAvatar && (
            <img
              src={personAvatar}
              alt={personName}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
            />
          )}
          <div>
            <p className="font-bold text-ink">{personName}</p>
            <p className="text-sm text-muted">{consultation.date}</p>
          </div>
        </div>

        <img
          src={consultation.photo}
          alt="Submitted prosthetic"
          className="mt-4 h-48 w-full rounded-2xl object-cover"
        />

        <div className="mt-5 space-y-3">
          {rows.map(([q, ans]) => (
            <div key={q} className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 backdrop-blur">
              <p className="stat-label">{q}</p>
              <p className="mt-0.5 text-sm text-ink">{ans || '—'}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-base font-bold text-ink">Doctor&apos;s note</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add guidance for your patient..."
            className="w-full rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-4 flex gap-3">
          <PillButton variant="outline" onClick={() => save(false)} disabled={saving} className="flex-1">
            <ChevronLeft size={16} /> Save Note
          </PillButton>
          <PillButton onClick={() => save(true)} disabled={saving} className="flex-1">
            {saving ? 'Saving…' : 'Save & Mark Reviewed'}
          </PillButton>
        </div>

        {onDeleted &&
          (confirming ? (
            <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50/80 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-red-600">Delete this consultation permanently?</p>
              <div className="mt-3 flex gap-3">
                <PillButton variant="outline" onClick={() => setConfirming(false)} className="flex-1">
                  Cancel
                </PillButton>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-200 px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={16} /> Delete Consultation
            </button>
          ))}
      </div>
    </div>
  )
}
