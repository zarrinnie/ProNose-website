import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Callout from './Callout'

const MARKER = /^\s*\[!(\w+)\]\s*/i

// remark plugin: turn a blockquote that starts with [!TYPE] into a <callout>
// node carrying its variant, so it renders as a styled Callout instead of a
// plain quote. Walks the tree without extra dependencies.
function remarkCallouts() {
  return (tree) => walk(tree)

  function walk(node) {
    if (!node?.children) return
    for (const child of node.children) {
      if (child.type === 'blockquote') {
        const firstText = child.children?.[0]?.children?.[0]
        if (firstText?.type === 'text') {
          const m = firstText.value.match(MARKER)
          if (m) {
            firstText.value = firstText.value.slice(m[0].length)
            child.data = child.data || {}
            child.data.hName = 'callout'
            child.data.hProperties = { variant: m[1].toLowerCase() }
          }
        }
      }
      walk(child)
    }
  }
}

// Tailwind styling for rendered Markdown, matched to the app's design tokens.
const components = {
  callout: ({ variant, children }) => <Callout variant={variant}>{children}</Callout>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-6 text-lg font-bold text-ink first:mt-0 md:text-xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1.5 mt-5 text-base font-bold text-brand-dark">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mb-1 mt-4 text-sm font-bold text-ink">{children}</h3>,
  p: ({ children }) => <p className="my-2 text-sm leading-relaxed text-ink/90">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink/90 marker:text-brand">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink/90 marker:font-semibold marker:text-brand-dark">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-brand-dark underline" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="my-5 border-white/60" />,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-brand/40 pl-4 text-sm italic text-muted">
      {children}
    </blockquote>
  ),
}

export default function CareContent({ children = '' }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkCallouts]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
