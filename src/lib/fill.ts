// Emitted by @contentrain/emitter-astro — the template runtime.
//
// Chrome, item templates and attribute values carry three marker forms:
//   @@mark@@                                       — a value, escaped
//   @@mark_html@@                                  — a value, raw HTML
//   <!--@@repeat:list@@-->…<!--@@/repeat@@-->      — once per list item
//   <!--@@if:name@@-->…<!--@@/if@@-->              — only when name has a value
// Rendering order is repeats → conditionals → marks, so a repeat body may hold
// conditionals and marks that only make sense per item.

/** Where page content splices into the body chrome — must match @contentrain/types CHROME_BODY_SLOT. */
export const BODY_SLOT = '<!--@@body@@-->'

const REPEAT_RE = /<!--@@repeat:([a-z0-9_]+)(?:\|([\s\S]*?))?@@-->([\s\S]*?)<!--@@\/repeat@@-->/gi
const IF_RE = /<!--@@if:(!?)([a-z0-9_]+)@@-->([\s\S]*?)<!--@@\/if@@-->/gi
const MARK_RE = /@@([a-z0-9_]+)@@/gi

export type Values = Record<string, unknown>

export const esc = (value: unknown): string =>
  String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const isFilled = (value: unknown): boolean =>
  Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ''

/**
 * Replace @@marks@@. Values are escaped unless the mark name ends in _html —
 * escaping is the default so content-derived text can never break the page,
 * and the _html opt-in exists for themes that print a post's own markup
 * (full content in a list card, a link-bearing excerpt).
 */
export function fillMarks(html: string, values: Values): string {
  return html.replace(MARK_RE, (_all, key: string) => {
    const value = values[key]
    if (Array.isArray(value)) return value.map((v) => esc(v)).join(', ')
    return key.toLowerCase().endsWith('_html') ? String(value ?? '') : esc(value ?? '')
  })
}

/** Expand repeat blocks; each item renders the inner fragment with its own values. */
export function expandRepeats(html: string, values: Values): string {
  return html.replace(REPEAT_RE, (_all, name: string, sep: string | undefined, inner: string) => {
    const list = values[name]
    if (!Array.isArray(list) || list.length === 0) return ''
    return list
      .map((item, index) => {
        const itemValues: Values = { ...values, item, item_index: String(index) }
        if (item && typeof item === 'object') {
          for (const [k, v] of Object.entries(item as Record<string, unknown>)) itemValues['item_' + k] = v
        }
        return renderTemplate(inner, itemValues)
      })
      .join(sep ?? '')
  })
}

/** Drop conditional blocks whose value is empty (or present, when negated). */
export function applyConditions(html: string, values: Values): string {
  return html.replace(IF_RE, (_all, negate: string, name: string, inner: string) =>
    isFilled(values[name]) !== (negate === '!') ? inner : '',
  )
}

/** Full render: repeats → conditionals → marks. */
export function renderTemplate(html: string, values: Values): string {
  return fillMarks(applyConditions(expandRepeats(html, values), values), values)
}

/** Fill marks inside attribute values (per-page classes like postid-123). */
export function fillAttrs(attrs: Record<string, string> | undefined, values: Values): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [name, value] of Object.entries(attrs ?? {})) out[name] = fillMarks(value, values)
  return out
}

/**
 * Compose the body chrome with the page content. The split happens BEFORE any
 * rendering: the @@…@@ pattern would otherwise consume the @@body@@ inside the
 * marker comment, leaving <!----> behind and silently dropping the content
 * (measured cost on a real page: 49.8 vs 97.8).
 */
export function composeBody(chromeBody: string, values: Values, content: string): string {
  return chromeBody
    .split(BODY_SLOT)
    .map((part) => renderTemplate(part, values))
    .join(content)
}

/** Component mount marker — must match @contentrain/types CHROME_COMPONENT_OPEN / CHROME_COMPONENT_CLOSE. */
export const COMPONENT_OPEN = '<!--@@component:'
export const COMPONENT_CLOSE = '@@-->'
const COMPONENT_RE = /<!--@@component:([^@\s]+)@@-->/g

export interface BodyPart {
  html: string
  /** A mount point: the component id the marker named. */
  component?: string
}

/**
 * Split rendered chrome at component markers into html parts interleaved with
 * mount points, so the layout can render a real component where the theme's
 * comments form (or contact form) stood. The parts are output in order, so the
 * page's HTML is exactly the chrome with the component's markup at the marker —
 * no parser sees the pieces separately.
 */
export function splitComponents(html: string): BodyPart[] {
  const parts: BodyPart[] = []
  let last = 0
  for (const match of html.matchAll(COMPONENT_RE)) {
    parts.push({ html: html.slice(last, match.index) })
    parts.push({ html: '', component: match[1] ?? '' })
    last = match.index + match[0].length
  }
  parts.push({ html: html.slice(last) })
  return parts
}

/** Where a list section's wrapper takes its items — must match @contentrain/types LIST_ITEMS_SLOT. */
export const ITEMS_SLOT = '<!--@@items@@-->'

export interface ListSection {
  template: string
  wrapper?: string
  count?: number
}

/**
 * Render a list in sections. Themes often render the newest post as a big card
 * and the rest as a grid — two templates in two containers — so a list is a
 * sequence of sections, each taking a count of items (or the remainder).
 */
export function renderSections<T>(
  sections: ListSection[],
  items: T[],
  values: (item: T) => Values,
): string {
  let index = 0
  const out: string[] = []
  for (const section of sections) {
    const take = section.count ?? items.length - index
    const slice = items.slice(index, index + take)
    index += slice.length
    if (slice.length === 0) continue
    const rendered = slice.map((item) => renderTemplate(section.template, values(item))).join('')
    out.push(section.wrapper ? section.wrapper.split(ITEMS_SLOT).join(rendered) : rendered)
  }
  return out.join('')
}

/** Emitted stylesheets live under /styles/legacy/ — pages reference them by file name. */
export const cssHref = (file: string): string => '/styles/legacy/' + (file.split('/').pop() ?? file)

export interface MarkablePost {
  slug: string
  title: string
  body?: string
  dates?: string[]
  author?: string
  author_first?: string
  author_last?: string
  authors?: string[]
  terms?: string[]
  featured?: string[]
  excerpt?: string
  excerpt_html?: string
  marks?: Record<string, unknown>
}

/**
 * The mark vocabulary: title, author (+ first/last), date{n}, term{n}, feat{n},
 * excerpt, slug — plus `terms`/`authors` as LISTS for repeat blocks, the
 * _html variants for raw insertion, and any producer-supplied extras.
 */
export function postMarks(post: MarkablePost): Values {
  const values: Values = {
    title: post.title,
    author: post.author ?? '',
    author_first: post.author_first ?? '',
    author_last: post.author_last ?? '',
    excerpt: post.excerpt ?? '',
    excerpt_html: post.excerpt_html ?? post.excerpt ?? '',
    body_html: post.body ?? '',
    slug: post.slug,
    feat: post.featured?.[0] ?? '',
    terms: post.terms ?? [],
    authors: post.authors ?? (post.author ? [post.author] : []),
  }
  for (const [i, d] of (post.dates ?? []).entries()) values['date' + i] = d
  for (const [i, t] of (post.terms ?? []).entries()) values['term' + i] = t
  for (const [i, f] of (post.featured ?? []).entries()) values['feat' + i] = f
  return { ...values, ...(post.marks ?? {}) }
}

/**
 * The shapes of the emitted data files. Pages import JSON and assert these
 * rather than letting TypeScript infer the shape from the file's contents:
 * inference reads only the fields the data HAPPENS to carry, so a site whose
 * posts need no extra route parameters produced a type without `params` and
 * `astro check` — which the build runs first — failed on the page that reads
 * it. The contract is what the emitter may write, not what one site wrote.
 */
/** Content-store address of an entry — what a mounted comments component keys its thread by. */
export interface EntryRef {
  model_id: string
  entry_id: string
  locale?: string
}

export interface EmittedPost extends MarkablePost {
  body: string
  /** Route parameters beyond slug — the date parts of a dated permalink, a post id. */
  params?: Record<string, string>
  /** Stylesheets only this page loads. */
  css?: string[]
  locale?: string
  /** Present when the producer bound this post to the content store. */
  entry?: EntryRef
}

/** One static path of a list route, as it appears in the emitted query data. */
export interface EmittedQueryPage {
  params: Record<string, string>
  items: EmittedPost[]
  marks?: Record<string, unknown>
  css?: string[]
  item_template?: string
  sections?: ListSection[]
  title?: string
}
