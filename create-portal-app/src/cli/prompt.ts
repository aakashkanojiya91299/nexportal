import { createInterface } from 'readline'

const rl = createInterface({ input: process.stdin, output: process.stderr })

/** Ask a free-text question. Returns `defaultVal` if user presses Enter. */
export function ask(question: string, defaultVal = ''): Promise<string> {
  return new Promise((resolve) => {
    const display = defaultVal ? `${question} (${defaultVal}): ` : `${question}: `
    rl.question(display, (ans) => resolve(ans.trim() || defaultVal))
  })
}

/** Present a numbered list, return the selected value. */
export async function select<T extends string>(
  question: string,
  options: Array<{ value: T; label: string; hint?: string }>,
): Promise<T> {
  process.stderr.write(`\n${question}\n`)
  options.forEach((o, i) => {
    const hint = o.hint ? `  — ${o.hint}` : ''
    process.stderr.write(`  ${i + 1}. ${o.label}${hint}\n`)
  })
  const raw = await ask(`Enter number (1–${options.length})`, '1')
  const idx = Math.max(0, Math.min(parseInt(raw, 10) - 1, options.length - 1))
  const chosen = options[isNaN(idx) ? 0 : idx]
  process.stderr.write(`   → ${chosen.label}\n`)
  return chosen.value
}

export function closePrompt() {
  rl.close()
}
