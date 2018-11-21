const pem = require('pem')

module.exports = () => new Promise((resolve, reject) => {
  pem.createCertificate({ selfSigned: true }, function (err, keys) {
    if (err) {
      reject(err)
      return
    }

    resolve(keys)
  })
})
