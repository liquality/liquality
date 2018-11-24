const os = require('os')
const fs = require('fs')
const path = require('path')
const https = require('https')

const mkdirp = require('mkdirp')
const express = require('express')
const helmet = require('helmet')
const compress = require('compression')
const symlinkDir = require('symlink-dir')
const opn = require('opn')

const cert = require('./cert')
const download = require('./download')

const GITHUB_USER = 'liquality'
const GITHUB_REPO = 'liquality-swap'
const GITHUB_BRANCH = 'gh-pages'

const HOME_DIR = os.homedir()
const APP_NAME = GITHUB_USER
const APP_DIR = path.join(HOME_DIR, `.${APP_NAME}`)
const KEYS_DIR = path.join(APP_DIR, 'keys')
const ASSET_DIR = path.join(APP_DIR, GITHUB_REPO)
const LATEST_ASSET_DIR = path.join(ASSET_DIR, 'latest')
const HTTPS_KEY_PATH = path.join(KEYS_DIR, 'key.pem')
const HTTPS_CERT_PATH = path.join(KEYS_DIR, 'cert.pem')

mkdirp.sync(KEYS_DIR)
mkdirp.sync(ASSET_DIR)

const request = require('request-promise')
const app = express()

app.use(helmet())
app.use(compress())

module.exports = async (skipLatestCheck = false, port = 8080, openInBrowser = true, useHttp = false, config = {
  btcRpc: false,
  btcRpcUser: false,
  btcRpcPass: false,
  ethRpc: false
}) => {
  if (!skipLatestCheck) {
    const { object: { sha } } = await request({
      url: `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
      headers: {
        'User-Agent': 'liquality'
      },
      json: true
    })

    const currentVersionDir = path.join(ASSET_DIR, sha)

    if (!fs.existsSync(currentVersionDir)) {
      console.log(`Downloading the latest version of Liquality Atomic Swap (${sha})`)

      mkdirp.sync(currentVersionDir)

      await download(GITHUB_USER, GITHUB_REPO, GITHUB_BRANCH, currentVersionDir)
      await symlinkDir(currentVersionDir, LATEST_ASSET_DIR)
    }
  }

  let keys

  if (fs.existsSync(HTTPS_KEY_PATH) && fs.existsSync(HTTPS_CERT_PATH)) {
    keys = {
      serviceKey: fs.readFileSync(HTTPS_KEY_PATH, 'utf-8'),
      certificate: fs.readFileSync(HTTPS_CERT_PATH, 'utf-8')
    }
  } else {
    console.log(`Generating SSL certificate...`)
    keys = await cert()

    fs.writeFileSync(HTTPS_KEY_PATH, keys.serviceKey, 'utf-8')
    fs.writeFileSync(HTTPS_CERT_PATH, keys.certificate, 'utf-8')
  }

  const configContent = [
    `window.appSubPath = '/'`
  ]

  if (config.btcRpc) configContent.push(`window.btcRpc = '${config.btcRpc}'`)
  if (config.btcRpcUser) configContent.push(`window.btcRpcUser = '${config.btcRpcUser}'`)
  if (config.btcRpcPass) configContent.push(`window.btcRpcPass = '${config.btcRpcPass}'`)
  if (config.ethRpc) configContent.push(`window.ethRpc = '${config.ethRpc}'`)

  const indexHtmlPath = path.join(LATEST_ASSET_DIR, 'index.html')
  const indexHtmlContent = fs
    .readFileSync(indexHtmlPath, 'utf-8')
    .replace('<meta charset="utf-8">', '<meta charset="utf-8"><script>' + configContent.join(';') + '</script>')

  app.get('/', (req, res) => {
    res.send(indexHtmlContent)
  })

  app.use('/', express.static(LATEST_ASSET_DIR))

  const url = `http${!useHttp ? 's' : ''}://localhost:${port}`
  console.log(`Serving Liquality Atomic Swap on ${url}`)

  if (useHttp) {
    app.listen(port)
  } else {
    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port)
  }

  if (openInBrowser) {
    opn(url)
  }
}
