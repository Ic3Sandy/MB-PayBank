var QRCode = require('qrcode')

exports.getQR = function(url) {
  console.log('Gen QR: '+url)
  QRCode.toFile('qrcode.png', url, {
  margin: 1,
  scale: 4,
  errorCorrectionLevel: 'H'
}, function (err) {
  if (err) throw err
  console.log('done')
})
}