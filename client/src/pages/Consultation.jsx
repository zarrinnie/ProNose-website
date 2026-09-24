import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  ImageIcon,
  CheckCircle2,
  Clock,
  Siren,
  AlertTriangle,
} from 'lucide-react'
import TopBar from '../components/TopBar'
import PillButton from '../components/PillButton'
import { useAuth } from '../context/AuthContext'
import { createConsultation } from '../api/consultations'
import { prosthesisConfig } from '../lib/prostheses'

const STEPS = ['Photo', 'Questions', 'Submit']

const emptyAnswers = {
  doingOkay: '',
  discomfort: '',
  colorFading: 'no',
  colorFadingDetails: '',
  deforming: 'no',
  deformingDetails: '',
  dailyIssues: '',
  comments: '',
}

export default function Consultation() {
  const location = useLocation()
  const { consultations } = useAuth()
  const viewId = location.state?.viewId
  const viewing = useMemo(
    () => (viewId ? consultations.find((c) => c.id === viewId) : null),
    [viewId, consultations],
  )

  if (viewing) return <ConsultationDetail consultation={viewing} />
  return <NewConsultation />
}

/* ---------------- New submission flow ---------------- */

function NewConsultation() {
  const navigate = useNavigate()
  const { addConsultation, currentUser } = useAuth()
  const fileRef = useRef(null)
  // Question / photo copy adapts to the patient's prosthesis type.
  const copy = prosthesisConfig(currentUser?.prosthesisType).questions

  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState(null)
  const [answers, setAnswers] = useState(emptyAnswers)
  const [urgent, setUrgent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const setAns = (key, val) => setAnswers((a) => ({ ...a, [key]: val }))

  const handleFile = (file) => {
    if (file) setPhoto({ url: URL.createObjectURL(file), name: file.name, file })
  }

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const created = await createConsultation({ answers, urgent, photoFile: photo?.file })
      addConsultation(created)
      navigate('/dashboard', { state: { submitted: true, urgent } })
    } catch (err) {
      // e.g. "Image must be 10MB or smaller." from the backend.
      setError(err.message || 'Could not submit consultation.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="New Consultation" showBack onBack={() => navigate('/dashboard')} />

      <Stepper step={step} />

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 pb-4 no-scrollbar">
        {step === 0 && <PhotoStep photo={photo} fileRef={fileRef} onFile={handleFile} copy={copy} />}
        {step === 1 && <QuestionStep answers={answers} setAns={setAns} copy={copy} />}
        {step === 2 && (
          <SubmitStep
            comments={answers.comments}
            setComments={(v) => setAns('comments', v)}
            urgent={urgent}
            setUrgent={setUrgent}
          />
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl px-6">
        {error && (
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-red-500">
            <AlertTriangle size={16} /> {error}
          </p>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-2xl gap-3 border-t border-white/50 px-6 py-4">
        {step > 0 && (
          <PillButton variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
            Back
          </PillButton>
        )}
        {step < STEPS.length - 1 ? (
          <PillButton
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !photo}
            className="flex-1"
          >
            Next
          </PillButton>
        ) : (
          <PillButton onClick={handleSubmit} disabled={submitting} className="flex-1">
            {submitting ? 'Submitting…' : 'Submit Consultation'}
          </PillButton>
        )}
      </div>
    </div>
  )
}

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                i <= step
                  ? 'bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft'
                  : 'bg-white/60 text-brand-dark'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-[11px] ${i === step ? 'font-semibold text-brand-dark' : 'text-muted'}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span className={`mb-4 h-0.5 w-8 rounded ${i < step ? 'bg-brand-dark' : 'bg-white/70'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PhotoStep({ photo, fileRef, onFile, copy }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{copy.photoTitle}</h3>
      <p className="mt-1 text-sm text-muted">{copy.photoHelp}</p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      <button
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFile(e.dataTransfer.files?.[0])
        }}
        className="mt-5 flex w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-brand/40 bg-white/50 px-6 py-12 text-center backdrop-blur transition hover:bg-white/70"
      >
        {photo ? (
          <>
            <img src={photo.url} alt="Prosthetic preview" className="h-40 w-full rounded-2xl object-cover" />
            <span className="flex items-center gap-2 text-sm font-medium text-brand-dark">
              <ImageIcon size={16} /> {photo.name} — tap to change
            </span>
          </>
        ) : (
          <>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
              <UploadCloud size={32} />
            </span>
            <span className="font-semibold text-ink">Tap to upload or drop a photo</span>
            <span className="text-xs text-muted">PNG or JPG, taken in good lighting</span>
          </>
        )}
      </button>
    </div>
  )
}

function QuestionStep({ answers, setAns, copy }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-ink">Medical questionnaire</h3>

      <ShortText
        label={copy.doingOkay}
        value={answers.doingOkay}
        onChange={(v) => setAns('doingOkay', v)}
        placeholder="Describe how you're feeling overall"
      />
      <ShortText
        label={copy.discomfort}
        value={answers.discomfort}
        onChange={(v) => setAns('discomfort', v)}
        placeholder={copy.discomfortPlaceholder}
      />

      <YesNo
        label={copy.colorFading}
        value={answers.colorFading}
        onChange={(v) => setAns('colorFading', v)}
        details={answers.colorFadingDetails}
        onDetails={(v) => setAns('colorFadingDetails', v)}
        detailPlaceholder="Describe the colour change"
      />
      <YesNo
        label={copy.deforming}
        value={answers.deforming}
        onChange={(v) => setAns('deforming', v)}
        details={answers.deformingDetails}
        onDetails={(v) => setAns('deformingDetails', v)}
        detailPlaceholder="Describe the shape change"
      />

      <ShortText
        label={copy.dailyIssues}
        value={answers.dailyIssues}
        onChange={(v) => setAns('dailyIssues', v)}
        placeholder={copy.dailyIssuesPlaceholder}
      />
    </div>
  )
}

function SubmitStep({ comments, setComments, urgent, setUrgent }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-ink">Comments &amp; submit</h3>

      <label className="block">
        <span className="mb-2 block text-base font-bold text-ink">Any additional comments?</span>
        <textarea
          rows={5}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Anything else you'd like your doctor to know..."
          className="w-full rounded-2xl border border-white/60 bg-white/70 px-5 py-4 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-brand"
        />
      </label>

      <button
        onClick={() => setUrgent((u) => !u)}
        className={`flex w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left backdrop-blur transition ${
          urgent ? 'border-red-400 bg-red-50/80' : 'border-white/70 bg-white/60'
        }`}
      >
        <span
          className={`grid h-10 w-10 place-items-center rounded-full ${
            urgent ? 'bg-red-500 text-white' : 'bg-white/80 text-muted'
          }`}
        >
          <Siren size={20} />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-ink">Flag as Urgent / Emergency</p>
          <p className="text-xs text-muted">Alert your care team immediately</p>
        </div>
        <span
          className={`relative h-6 w-11 rounded-full transition ${urgent ? 'bg-red-500' : 'bg-muted/40'}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              urgent ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </span>
      </button>

      {urgent && (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <AlertTriangle size={16} /> This will be marked as an emergency consultation.
        </p>
      )}
    </div>
  )
}

function ShortText({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-ink">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/60 bg-white/70 px-5 py-3.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-brand"
      />
    </label>
  )
}

function YesNo({ label, value, onChange, details, onDetails, detailPlaceholder }) {
  return (
    <div>
      <span className="mb-2 block text-base font-bold text-ink">{label}</span>
      <div className="flex gap-3">
        {['no', 'yes'].map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-2xl border-2 py-3 text-sm font-semibold capitalize backdrop-blur transition ${
              value === opt
                ? 'border-brand bg-brand/15 text-brand-dark'
                : 'border-white/70 bg-white/60 text-muted'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {value === 'yes' && (
        <input
          value={details}
          onChange={(e) => onDetails(e.target.value)}
          placeholder={detailPlaceholder}
          className="mt-3 w-full rounded-2xl border border-white/60 bg-white/70 px-5 py-3.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-brand animate-fade-in"
        />
      )}
    </div>
  )
}

/* ---------------- Detail view of an existing consultation ---------------- */

function ConsultationDetail({ consultation }) {
  const navigate = useNavigate()
  const reviewed = consultation.status === 'reviewed'
  const a = consultation.answers
  const rows = [
    ['Doing okay?', a.doingOkay],
    ['Discomfort?', a.discomfort],
    ['Colour fading?', a.colorFading === 'yes' ? `Yes — ${a.colorFadingDetails}` : 'No'],
    ['Deforming?', a.deforming === 'yes' ? `Yes — ${a.deformingDetails}` : 'No'],
    ['Daily-use issues?', a.dailyIssues],
    ['Comments', a.comments || '—'],
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Consultation" showBack onBack={() => navigate('/dashboard')} />

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-ink">
              {consultation.type === 'emergency' ? 'Urgent Check-in' : 'Weekly Check-in'}
            </p>
            <p className="text-sm text-muted">{consultation.date}</p>
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              reviewed ? 'bg-brand/15 text-brand-dark' : 'bg-pastel-peach/30 text-amber-600'
            }`}
          >
            {reviewed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
            {reviewed ? 'Reviewed' : 'Pending Review'}
          </span>
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

        {reviewed && consultation.doctorNote && (
          <div className="mt-5 rounded-2xl border border-brand/30 bg-brand/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">
              Doctor&apos;s note
            </p>
            <p className="mt-1 text-sm text-ink">{consultation.doctorNote}</p>
          </div>
        )}
      </div>
    </div>
  )
}
