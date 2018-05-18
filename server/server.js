const express = require('express')
const ReactSSR = require('react-dom/server')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join("__dirname", '../dist/index.html'), 'utf8')
  app.use('/public', express.static(path.join("__dirname", "../dist")))
  app.get('*', (req, res) => {
    const str = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', str))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(5566, () => {
  console.log('Server is running on port #5566')
})
