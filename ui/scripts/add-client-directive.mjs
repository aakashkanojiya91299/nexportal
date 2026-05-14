import { readFileSync, writeFileSync } from 'fs'

const DIRECTIVE = '"use client";\n'

for (const file of ['dist/index.js', 'dist/index.mjs']) {
  const content = readFileSync(file, 'utf8')
  if (!content.startsWith('"use client"')) {
    writeFileSync(file, DIRECTIVE + content)
    console.log(`✔ Added "use client" to ${file}`)
  }
}
