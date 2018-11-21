const tar = require('tar')
const request = require('request')

module.exports = (user, repo, branch, destination) => new Promise((resolve, reject) => {
  request({
    url: `https://api.github.com/repos/${user}/${repo}/tarball/${branch}`,
    headers: {
      'User-Agent': 'liquality'
    }
  }).pipe(tar.x({
    strip: 1,
    C: destination
  })).on('end', () => resolve()).on('error', e => reject(e))
})
