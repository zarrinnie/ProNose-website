// Seed content for the patient care guide. Authored from a clinician evidence
// pack under strict constraints: no drug names or doses; no invented numeric
// thresholds (only 2 kg / 2 weeks, 2–4 day adhesive interval, 72 h new-prosthesis
// fragility, 3-monthly review are used); extrapolated modules are labelled; no
// commercial product names. This is starter copy — a super_admin edits it in the
// Admin Console, and it must be signed off by the treating team before it is
// relied on. Callouts use the convention: a blockquote beginning with
// [!NOTE] / [!CAUTION] / [!WARNING] / [!EXTRAPOLATED].

const PENDING_META = {
  reviewer: 'Pending clinician sign-off',
  lastReviewed: 'Not yet reviewed',
}

const NOSE_GUIDES = [
  {
    slug: 'prosthesis',
    title: 'Prosthesis care',
    icon: 'SprayCan',
    accent: 'lavender',
    sort_order: 1,
    summary:
      'How to remove, clean, reattach and store your nasal prosthesis — plus adhesives and looking after your skin.',
    meta: { ...PENDING_META },
    content: `# Why daily care matters

Cleaning your prosthesis is not just about how it looks. The skin under a prosthesis carries more germs and yeast than uncovered skin, and silicone picks these up easily. Keeping it clean is what keeps the skin underneath healthy and helps the prosthesis last as long as it should.

## Taking the prosthesis off

1. Find the easiest edge to lift from and gently work it loose from there. Don't pull it straight off.
2. The thin edges (the **margins**) are the weak point and tear easily — support them as you go.
3. Take your time with the adhesive. Rushing is what damages both the skin and the edges.

> [!NOTE]
> Some clinics suggest cleaning only what is soiled each day and fully removing the built-up adhesive layers every 2–4 days. This is one common approach — follow whatever your own prosthetist advises.

## Cleaning it

- Use your fingers, or a damp cotton bud for debris caught in the folds. **Do not brush the coloured outer surface** — brushing wears the surface down and fades the colour.
- Only if your prosthetist has approved it, a soft brush may be used **on the inner (fitting) surface** to lift old adhesive — never on the outside.
- Wash under **cool or lukewarm water, never hot.** Dry gently, taking care around the edges.
- Use a mild soap. Avoid antibacterial soaps.

> [!NOTE]
> The evidence on cleaning agents is mixed — some studies favour a disinfectant soak, others plain soap and water. Use mild soap and water as your everyday method, and ask your prosthetist which agent, if any, they want you to soak it in.

## Putting it back on

1. Your skin must be **clean and completely oil-free** before you apply anything.
2. Practise positioning it with little or no adhesive first, so you learn where it sits.
3. It is normal for this to feel awkward at first — for many people it takes a couple of weeks before it becomes easy. That is expected, not a sign anything is wrong.
4. Glasses with thicker frames can help hide the edges and make wearing it easier.

> [!CAUTION]
> Never use superglue or any household glue for a quick fix. A well-fitted prosthesis should sit passively and should not create sore spots. If a sore spot develops, stop wearing it and contact your clinic.

## Storing it

When you're not wearing it, keep it in a clean, dry container somewhere safe.

## Adhesives and your skin

- Skin adhesives stick under light pressure — they don't need water or heat to work.
- Apply a water-based adhesive first and let it dry, then a silicone-based adhesive over it. Using the silicone one on its own tends to tear the edges on removal.
- To protect your skin over months of use: clean and dry the skin, let any barrier film dry **fully** before applying adhesive, and lift adhesive off gently with a remover rather than rubbing.

> [!NOTE]
> Adhesives have real downsides worth knowing. They don't hold firmly against heat, sweat and movement, they can irritate skin over time, and they slowly wear the edges. Heat and humidity reduce their grip. If skin problems keep happening, tell your care team rather than scrubbing harder.

A newly made or newly re-coloured prosthesis is fragile for the first **72 hours** — handle it extra carefully and keep cosmetics off it during that window.

---

**About this information.** Adapted from published research and prosthetics-clinic guidance on facial-prosthesis hygiene, handling and adhesives. It does not replace the instructions of your own prosthetist and care team.`,
  },

  {
    slug: 'wound-care',
    title: 'Wound & defect care',
    icon: 'Droplets',
    accent: 'blue',
    sort_order: 2,
    summary: 'Looking after the nasal area and managing crusting while it heals.',
    meta: { ...PENDING_META },
    content: `> [!EXTRAPOLATED]
> There is no wound-care research specific to the open nasal area after rhinectomy. The guidance below is adapted from recovery after other nasal (sinus) surgery. Always follow the specific instructions your surgical team gives you.

# Keeping the area clean

Crusting is the main thing to manage. Trapped crust can cause blockage, a stuffy feeling, a bad smell and headache. Gentle rinsing keeps crusts soft so they clear on their own.

> [!WARNING]
> Never dig crusts out with your fingers, a cotton bud, or anything sharp. If crusts are stubborn, rinse more often to soften them instead.

## Rinsing safely

> [!CAUTION]
> Use **distilled water, or water that has been boiled and then cooled.** Never rinse with plain tap water. This is the single most important safety point on this page.

- Rinse gently and regularly, as directed by your team.
- Some teams recommend particular rinsing solutions or dressings — use only what your team has given you.

## What to expect

Crusting is often most noticeable in the first couple of months and settles as the area heals. How much crusting you get depends on how much tissue was removed. Your team may clean the area for you at review visits.

## Check the area

Because the prosthesis lifts off easily, you get a clear view of the healed area. **Look at it each time you take the prosthesis off**, and report anything new — see the Warning signs page.

Your prosthesis fit and overall recovery are usually reviewed around every three months.

---

**About this information.** Adapted from published guidance on recovery after nasal (sinus) surgery, applied cautiously because rhinectomy-specific evidence is not available. It does not replace the instructions of your own surgical team.`,
  },

  {
    slug: 'pain',
    title: 'Pain management',
    icon: 'Pill',
    accent: 'peach',
    sort_order: 3,
    summary: "How pain is managed after surgery, and what to do if it isn't controlled.",
    meta: { ...PENDING_META },
    content: `> [!EXTRAPOLATED]
> Pain-management research in this area comes from larger head-and-neck cancer operations, not rhinectomy specifically. This page explains general principles only. It names no medicine and no dose — your own team decides those.

# How pain is managed

Modern practice uses several gentle methods together rather than relying on strong painkillers alone. The aim is to keep you comfortable while keeping the use of strong (opioid) painkillers as low as possible, because reducing them lowers the risk of longer-term dependence.

## What you can do

- Take pain relief exactly as your team prescribed it — no more, no less.
- Tell your team early if pain is not well controlled, rather than waiting.
- Ask before adding any over-the-counter remedy, so it doesn't clash with what you've been given.

> [!NOTE]
> Everyone recovers differently. Some people need very little pain relief; others need more for a while. Neither is a problem — what matters is that your pain is controlled enough for you to rest, eat and move.

> [!WARNING]
> If your pain is not controlled by what you have been prescribed, contact your care team — see the Warning signs page for how to reach them.

---

**About this information.** Adapted from general post-surgery and head-and-neck pain-management guidelines. It gives principles only and names no medicines or doses. It does not replace the instructions of your own care team.`,
  },

  {
    slug: 'diet',
    title: 'Diet & nutrition',
    icon: 'Apple',
    accent: 'pink',
    sort_order: 4,
    summary: 'Eating well during recovery, and the weight change to watch for.',
    meta: { ...PENDING_META },
    content: `# Eating well while you heal

Good nutrition helps you recover. This is one area with clear, up-to-date guidance, so it is worth paying attention to.

## Watch your weight

> [!CAUTION]
> Weigh yourself regularly. **If you lose 2 kg or more within two weeks, tell your dietitian.** This is the one clear number to act on.

## Staying on track

- Eat as soon after surgery as your team allows; getting nutrition in early helps healing.
- If you can't eat enough by mouth, your team can arrange other ways to keep your nutrition up.
- A dietitian is usually involved both before and after surgery — keep those appointments, as support may continue for several weeks, and longer after bigger operations.
- If swallowing is affected, a speech and swallowing specialist can help.

> [!NOTE]
> Losing your sense of smell after rhinectomy can change how food tastes and how hungry you feel. If eating has become harder for this reason, tell your dietitian — they can help you keep your intake up.

---

**About this information.** Based on current head-and-neck cancer nutrition guidelines. It does not replace the advice of your own dietitian and care team.`,
  },

  {
    slug: 'warning-signs',
    title: 'Warning signs',
    icon: 'AlertTriangle',
    accent: 'pink',
    sort_order: 5,
    summary: 'Signs that need attention, and exactly who to contact.',
    meta: {
      ...PENDING_META,
      contact: {
        clinicName: '[Clinic name]',
        phone: '[Clinic phone number]',
        hours: '[Opening hours]',
        afterHours: '[After-hours / emergency contact]',
      },
    },
    content: `> [!WARNING]
> This list is a general starting point and has not been finalised by a clinician. Your care team should confirm which signs apply to you and set the limits. If something worries you and it isn't listed here, contact them anyway.

Every sign below ends with what to do. Use the **Message your doctor** button at the bottom of this page, or the clinic contact details, to get in touch.

# Skin and prosthesis

- **Sore spots under the prosthesis.** A well-fitted prosthesis shouldn't cause these. Stop wearing it and contact your clinic.
- **Redness, raised or scaly skin, or intense itching where the adhesive sits.** This can be a skin reaction to the adhesive — contact your clinic.
- **Skin tearing or stripping when you remove the prosthesis.** Have your team review your removal routine rather than managing it alone.
- **Skin irritation that continues despite correct cleaning.** Contact your clinic for assessment — don't scrub harder.

# The nasal area

- **Any new lump, sore, ulcer or change** at the healed area. Report it to your clinic promptly.
- **A bad smell, worsening blockage, or headache.** These often mean trapped crust that needs a clinic clean rather than an emergency — arrange a review.
- **Bleeding.** Your surgical team should tell you what is normal for you and when to call. Follow their limits, and contact them if you're unsure.

# Eating

- **Losing 2 kg or more in two weeks.** Tell your dietitian.
- **Not being able to eat or drink enough.** Contact your team so they can help.

# Pain

- **Pain that isn't controlled** by what you have been prescribed. Contact your care team.

# How you're feeling

- **Low mood that won't lift, or pulling away from people.** This is common and it matters. Reach out to your care team — you don't have to manage it alone.

---

**About this information.** Assembled from complication reports across the published literature as a starting draft. The final version, and the limits that apply to you, should come from your treating team. It does not replace their instructions.`,
  },
]

// Microtia (ear / auricular prosthesis) starter content. This is placeholder
// copy adapted from the nasal guides plus general auricular-prosthesis
// principles — a super_admin should refine it and the treating team must sign
// it off before it is relied on.
const MICROTIA_GUIDES = [
  {
    slug: 'prosthesis',
    title: 'Prosthesis care',
    icon: 'SprayCan',
    accent: 'lavender',
    sort_order: 1,
    summary:
      'How to remove, clean, reattach and store your ear prosthesis — plus adhesives and looking after the skin behind and around your ear.',
    meta: { ...PENDING_META },
    content: `> [!NOTE]
> This is placeholder guidance for ear (auricular) prostheses, awaiting review by your care team. Always follow the instructions your own prosthetist gives you.

# Why daily care matters

The skin under a prosthesis carries more germs and yeast than uncovered skin, and silicone picks these up easily. Keeping your ear prosthesis clean is what keeps the skin behind and around the ear healthy and helps the prosthesis last as long as it should.

## Taking the prosthesis off

1. Find the easiest edge to lift from — often behind the ear — and gently work it loose from there. Don't pull it straight off.
2. The thin edges (the **margins**) are the weak point and tear easily — support them as you go.
3. Take your time with the adhesive. Rushing is what damages both the skin and the edges.

## Cleaning it

- Use your fingers, or a damp cotton bud for debris caught in the folds and the detail of the ear. **Do not brush the coloured outer surface** — brushing wears the surface down and fades the colour.
- Wash under **cool or lukewarm water, never hot.** Dry gently, taking care around the edges.
- Use a mild soap. Avoid antibacterial soaps.

## Putting it back on

1. The skin must be **clean and completely oil-free** before you apply anything.
2. Practise positioning it with little or no adhesive first, so you learn where it sits relative to your other ear and your glasses.
3. It is normal for this to feel awkward at first — for many people it takes a couple of weeks before it becomes easy.

> [!CAUTION]
> Never use superglue or any household glue for a quick fix. A well-fitted prosthesis should sit passively and should not create sore spots. If a sore spot develops, stop wearing it and contact your clinic.

## Storing it

When you're not wearing it, keep it in a clean, dry container somewhere safe.

## Adhesives, clips and your skin

- Ear prostheses may be held by skin adhesive or by clips onto implants (a bar or magnets), depending on what you were fitted with. Follow the method your prosthetist set up for you.
- If you use adhesive: apply it thinly, let it become tacky, and lift it off gently with a remover rather than rubbing.
- If you have implant-retained clips or magnets: keep the abutment sites clean and dry as your team showed you.

---

**About this information.** Placeholder copy adapted from facial-prosthesis hygiene and handling guidance. It does not replace the instructions of your own prosthetist and care team.`,
  },

  {
    slug: 'wound-care',
    title: 'Skin & site care',
    icon: 'Droplets',
    accent: 'blue',
    sort_order: 2,
    summary: 'Looking after the skin around the ear and any implant sites while things heal.',
    meta: { ...PENDING_META },
    content: `> [!EXTRAPOLATED]
> This guidance is adapted from general facial-prosthesis and implant aftercare. Always follow the specific instructions your surgical team gives you.

# Keeping the area clean

Keep the skin around the ear and, if you have them, the implant abutment sites clean and dry. Gentle daily cleaning as your team showed you helps prevent irritation and infection.

> [!WARNING]
> Don't pick at healing skin or abutment sites with your fingers or anything sharp. If something is crusting or sore, clean gently as directed and tell your team.

## What to expect

Some tenderness and mild redness can be normal early on and should settle as things heal. Because the prosthesis lifts off easily, you get a clear view of the skin underneath — **look at it each time you take the prosthesis off**, and report anything new (see the Warning signs page).

Your prosthesis fit and overall recovery are usually reviewed at regular intervals set by your team.

---

**About this information.** Placeholder copy adapted from implant and prosthesis aftercare guidance. It does not replace the instructions of your own surgical team.`,
  },

  {
    slug: 'pain',
    title: 'Pain management',
    icon: 'Pill',
    accent: 'peach',
    sort_order: 3,
    summary: "How pain is managed after surgery, and what to do if it isn't controlled.",
    meta: { ...PENDING_META },
    content: `> [!EXTRAPOLATED]
> This page explains general principles only. It names no medicine and no dose — your own team decides those.

# How pain is managed

Modern practice uses several gentle methods together rather than relying on strong painkillers alone. The aim is to keep you comfortable while keeping the use of strong (opioid) painkillers as low as possible.

## What you can do

- Take pain relief exactly as your team prescribed it — no more, no less.
- Tell your team early if pain is not well controlled, rather than waiting.
- Ask before adding any over-the-counter remedy, so it doesn't clash with what you've been given.

> [!WARNING]
> If your pain is not controlled by what you have been prescribed, contact your care team — see the Warning signs page for how to reach them.

---

**About this information.** Placeholder copy adapted from general post-surgery pain-management principles. It names no medicines or doses and does not replace the instructions of your own care team.`,
  },

  {
    slug: 'diet',
    title: 'Diet & nutrition',
    icon: 'Apple',
    accent: 'pink',
    sort_order: 4,
    summary: 'Eating well during recovery to support healing.',
    meta: { ...PENDING_META },
    content: `# Eating well while you heal

Good nutrition helps you recover, especially in the weeks around surgery.

## Staying on track

- Eat as soon after surgery as your team allows; getting nutrition in early helps healing.
- Keep well hydrated and aim for balanced meals with enough protein.
- If eating is difficult for any reason, tell your team so they can help.

> [!NOTE]
> If you have a dietitian involved in your care, keep those appointments — support may continue for several weeks.

---

**About this information.** Placeholder copy adapted from general post-surgery nutrition principles. It does not replace the advice of your own dietitian and care team.`,
  },

  {
    slug: 'warning-signs',
    title: 'Warning signs',
    icon: 'AlertTriangle',
    accent: 'pink',
    sort_order: 5,
    summary: 'Signs that need attention, and exactly who to contact.',
    meta: {
      ...PENDING_META,
      contact: {
        clinicName: '[Clinic name]',
        phone: '[Clinic phone number]',
        hours: '[Opening hours]',
        afterHours: '[After-hours / emergency contact]',
      },
    },
    content: `> [!WARNING]
> This list is a general starting point and has not been finalised by a clinician. Your care team should confirm which signs apply to you and set the limits. If something worries you and it isn't listed here, contact them anyway.

Every sign below ends with what to do. Use the **Message your doctor** button at the bottom of this page, or the clinic contact details, to get in touch.

# Skin and prosthesis

- **Sore spots under the prosthesis.** A well-fitted prosthesis shouldn't cause these. Stop wearing it and contact your clinic.
- **Redness, raised or scaly skin, or intense itching where the adhesive or clips sit.** This can be a skin reaction — contact your clinic.
- **Skin tearing or stripping when you remove the prosthesis.** Have your team review your removal routine rather than managing it alone.

# Implant sites (if you have them)

- **Redness, swelling, discharge, pain or a loose abutment** around an implant site. Contact your clinic promptly.

# Pain

- **Pain that isn't controlled** by what you have been prescribed. Contact your care team.

# How you're feeling

- **Low mood that won't lift, or pulling away from people.** This is common and it matters. Reach out to your care team — you don't have to manage it alone.

---

**About this information.** Placeholder draft assembled from general complication guidance. The final version, and the limits that apply to you, should come from your treating team. It does not replace their instructions.`,
  },
]

// Combined seed set, each guide tagged with the prosthesis it belongs to.
export const CARE_GUIDES = [
  ...NOSE_GUIDES.map((g) => ({ ...g, prosthesis_type: 'nose' })),
  ...MICROTIA_GUIDES.map((g) => ({ ...g, prosthesis_type: 'microtia' })),
]
