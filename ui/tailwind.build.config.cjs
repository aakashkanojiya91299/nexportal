const { join } = require('path')
const preset = require('./dist/tailwind/preset.js')

module.exports = {
  presets: [preset],
  // Scan the compiled SDK bundle so all utility classes used in components are included
  content: [
    join(__dirname, 'dist/index.js'),
    join(__dirname, 'src/**/*.{ts,tsx}'),
  ],
}
