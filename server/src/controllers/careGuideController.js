import { CareGuide } from '../models/index.js'

// Light fields for the hub grid — no full Markdown body.
const LIST_ATTRS = ['slug', 'title', 'icon', 'accent', 'summary', 'sort_order']

// Resolve which prosthesis's guides to serve: an explicit ?type= (used by the
// admin console to browse any set) wins, otherwise the requester's own type,
// falling back to nose.
function resolveType(req) {
  return req.query.type || req.user?.prosthesis_type || 'nose'
}

// Any authenticated user may read care guides. Ordered for the hub.
export async function list(req, res, next) {
  try {
    const rows = await CareGuide.findAll({
      attributes: LIST_ATTRS,
      where: { prosthesis_type: resolveType(req) },
      order: [['sort_order', 'ASC']],
    })
    res.json({ guides: rows })
  } catch (err) {
    next(err)
  }
}

export async function getBySlug(req, res, next) {
  try {
    const guide = await CareGuide.findOne({
      where: { prosthesis_type: resolveType(req), slug: req.params.slug },
    })
    if (!guide) {
      return res.status(404).json({ error: 'Care guide not found.' })
    }
    res.json({ guide })
  } catch (err) {
    next(err)
  }
}

// Super admin only: edit the content and presentation of a guide. The slug and
// prosthesis type are immutable (topics are fixed), so only the editable
// fields are applied.
export async function update(req, res, next) {
  try {
    const guide = await CareGuide.findOne({
      where: { prosthesis_type: resolveType(req), slug: req.params.slug },
    })
    if (!guide) {
      return res.status(404).json({ error: 'Care guide not found.' })
    }

    const b = req.body
    for (const field of ['title', 'icon', 'accent', 'summary', 'content']) {
      if (typeof b[field] === 'string') guide[field] = b[field]
    }
    if (b.meta && typeof b.meta === 'object') guide.meta = b.meta

    await guide.save()
    res.json({ guide })
  } catch (err) {
    next(err)
  }
}
