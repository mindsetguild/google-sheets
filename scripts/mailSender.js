const sheetUrl = 'https://docs.google.com/spreadsheets/d/19gnzO-dhxZAhBHTUaamlEiaKiRwpdUNuUVjf1WYINH0/edit#gid=1513085910';
const dateLocale = 'cs-CZ';

// check if task is valid
function checkTask(task, contacts) {
  // check date and task name
  for (let i = 0; i < 2; i++) {
    if (task[i] == '') {
      return false;
    }
  }
  // username is missing
  if (task[4] == '') {
    return false;
  }
  return true;
}

// check if username exist with set address and return address
function getUserMail(user, contacts) {
  
  for (let index in contacts) {
    let contact = contacts[index];
    
    // check username and address
    if (contact[0] == user && contact[1] != '') {
      return contact[1];
    }
  }
  return false;
}

// get array of all users
function getAllUserMails(contacts) {
  
  let addresses = [];
  
  for (let index in contacts) {
    let contact = contacts[index];
    
    // check username and address
    if (contact[0] != '' && contact[1] != '') {
      addresses.push(contact[1]);
    }
  }
  return addresses.length > 0 ? addresses : false;
}

function sendMail(address, subject, message) {
  MailApp.sendEmail({
    to: address,
    subject: subject,
    htmlBody: message,
  });
}

// send reminder mails to all users with pending tasks
function sendReminderMails() {
  
  let ui = SpreadsheetApp.getUi();
  let tastlistSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasklist');
  let tasklist = tastlistSheet.getRange('A2:H').getValues();
  let contacts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contacts').getRange('A2:B').getValues();
  
  let reminderCount = 0;
  
  for (let index in tasklist) {
    let task = tasklist[index];
    
    if (!checkTask(task, contacts)) {
      continue;
    }

    let userName = task[4] != '' ? task[4] : '';
    let address = getUserMail(userName, contacts);
    let currentDate = new Date().toLocaleDateString(dateLocale);
    let taskDate = task[7] != '' ? task[7].toLocaleDateString(dateLocale) : '';
    
    if (address && task[5] == '' && task[6] == 'Pending' && taskDate != currentDate) {
      
      tastlistSheet.getRange('H' + (parseInt(index) + 2)).setValue(currentDate);

      let dateCreated = task[0].toLocaleDateString(dateLocale);
      let taskName = task[1];
      let taskComment = task[2] != '' ? task[2] : '';
      let managementComment = task[3] != '' ? task[3] : '';
      
      let address = getUserMail(userName, contacts);
      let subject = 'Mindset - You have pending task!';
      let message = '<html>Hey ' + userName + ',<br><br>';
      message += 'Your task "' + taskName + '" which was created on ' + dateCreated + ' is still pending. Go check it out <a href="' + sheetUrl + '">HERE</a>!<br><br>';
      message += taskComment ? ('Task Comment: ' + taskComment + '<br>') : '';
      message += managementComment ? ('Management Comment: ' + managementComment + '<br><br>') : '<br>';
      message += 'Keep up the work,<br>Mindset Guild</html>';
      
      sendMail(address, subject, message);
      reminderCount++;
    }
  }
  ui.alert(reminderCount == 1 ? reminderCount + ' reminder have been sent!' : reminderCount + ' reminders have been sent');
}

function sendGlobalMail() {
  
  let ui = SpreadsheetApp.getUi();
  let playersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
  let subject = playersSheet.getRange('I17').getValue();
  let message = playersSheet.getRange("I18").getValue();
  let contacts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contacts').getRange('A2:B').getValues();
  let addresses = getAllUserMails(contacts).join(',');
  
  if (addresses && subject && message) {
    sendMail(addresses, subject, message.replace(/(?:\r\n|\r|\n)/g, '<br>'));
    playersSheet.getRange("I17").clearContent();
    playersSheet.getRange("I18").clearContent();
    ui.alert('Global email sent!');
  } else {
    ui.alert('Missing subject or text!');
  }
}