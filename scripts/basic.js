// get count of attendees with seprated confirmed and maybe confirmed counts
function getNumberOfAttendees(...args) {
  
  var yesCount = 0;
  var maybeCount = 0;
  
  args.forEach(range => range.filter(item => item != '').forEach(item => item == 'Yes' ? yesCount++ : item == 'Maybe' ? maybeCount++ : false));
  
  return yesCount + (maybeCount > 0 ? ' (+' + maybeCount + '?)' : '');
}

// get current date in czech format
function getDate() {
  return new Date().toLocaleDateString('cs-CZ');
}