var helpers = {}

helpers.visualReadyStatus = function() {
  $('#step1 .button').attr('class', 'button green send')
  setTimeout(function() {
    $('#step1 .button').html('send a file')
    $('#step1 .button').toggleClass('send')
    $('#step1 .button').toggleClass('browse')
  }, 100)
}
helpers.generateRandomString = function() {
  return Math.random().toString(36).slice(-8)
}
helpers.parseAnchor = function() {
  var url = window.location.href.toString()
  var idx = url.indexOf("#")
  anchor = (idx != -1) ? url.substring(idx+1) : ""
  log('Anchor found: '+ anchor)

  if (anchor) {
    var parts = anchor.split(':')
    password = parts[2]
    authCode = parts[1]
    peerID = parts[0]
  }
}
helpers.binaryToBlob = function(decrypted) {
  // See http://stackoverflow.com/a/10473992
  var raw_data = atob(decrypted.split(',')[1])
  // Use typed arrays to convert the binary data to a Blob
  var arraybuffer = new ArrayBuffer(raw_data.length)
  var view = new Uint8Array(arraybuffer)
  for (var i=0; i<raw_data.length; i++) {
    view[i] = raw_data.charCodeAt(i) & 0xff
  }
  try {
    // This is the recommended method:
    var blob = new Blob([arraybuffer], {type: 'application/octet-stream'})
  } catch (e) {
    // The BlobBuilder API has been deprecated in favour of Blob, but older
    // browsers don't know about the Blob constructor
    var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)
    bb.append(arraybuffer)
    var blob = bb.getBlob('application/octet-stream') // <-- Here's the Blob
  }
  // Use the URL object to create a temporary URL
  url = (window.webkitURL || window.URL).createObjectURL(blob)
  return url
}
helpers.step = function(i) {
  if (i == 1) back.fadeOut()
  else back.fadeIn()
  stage.css('top',(-(i-1)*100)+'%')
}
helpers.checkValidity = function(file) {
  if (!/^data:/.test(file)){
    return false
  } else return true
}
helpers.sendOnIncoming = function(conn, file, password) {
  conn.acceptConnections(function() {
    helpers.sendFileInChunks(conn, file, password)
  })
}
helpers.sendFileInChunks = function(conn, file, password) {
  log('helpers.sendFileInChunks()')
  var slice_method
  file_size = file.size
  log('File size: '+ file_size)
  chunk_size = (1024 * 100) // 100KB
  range_start = 0
  range_end = chunk_size
  while (range_end < file_size) {
    log('Chunking while()')
    if (range_end > file_size) {
      self.range_end = file_size
    }
    log('Chunks:')
    log(file.slice(range_start, range_end))

    range_start += chunk_size
    range_end += chunk_size
  }

  // regular functioning
  //helpers.sendOnIncoming(conn, file, password)
  transfer.outgoing(conn, file, password)
}

module.exports = helpers
