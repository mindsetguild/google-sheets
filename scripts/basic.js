// get count of attendees with seperated confirmed and maybe confirmed counts
function getNumberOfAttendees(...args) {
  
  let yesCount = 0;
  let maybeCount = 0;
  
  args.forEach(range => range.filter(item => item != '').forEach(item => item == 'Yes' ? yesCount++ : item == 'Maybe' ? maybeCount++ : false));
  
  return yesCount + (maybeCount > 0 ? ' (+' + maybeCount + '?)' : '');
}

// get current date in czech format
function getDate() {
  return new Date().toLocaleDateString('cs-CZ');
}

// replaces idea command prefix from discord
function replaceIdeaPrefix(idea) {
  return idea.replace('!idea ', '');
}

// cancel pending task
function cancelPendingTask() {
  
  let ui = SpreadsheetApp.getUi();
  let confirmation = ui.alert('Confirmation', 'Are you sure you want cancel selected task?', ui.ButtonSet.YES_NO);
  
  if (confirmation == ui.Button.YES) {
    return true;
  }
  else {
    ui.alert('Task remains active!');
  }
}

// randomly generate task id
function generateTaskIds() {
  
  let status = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasklist').getRange('G2:H').getValues();
  
  for (let index in status) {
    let taskStatus = status[index];
  }
  
  let min = 10000;
  let max = 99999;
  let number;
  
  let numberExists;

  // create unique id
  do {
    number = Math.floor(Math.random() * (max - min + 1)) + min;
    numberExists = false;

    activeIds.filter(id => id != '').forEach(function (id) {
      if (id == number) {
        numberExists = true;
      }
    });
  }
  while (numberExists);

  // return complete id
  return 'T' + number;
}
