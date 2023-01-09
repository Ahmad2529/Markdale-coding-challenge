function autoFillIPSTemplateGoogleDoc(e) {
  // declare variables from Google Sheet
  let investorName = e.values[1];
  let timeStamp = e.values[0];
  let emailID = e.values[2]

  // convert values from column 3 of Google Sheet to string
  const goals = e.values[4].toString();

  // declare goal variables
  let goal1 = ""
  let goal2 = ""
  let goal3 = ""

  //create an array and parse values from CSV format, store them in an array
  let goalsArr = goals.split(',')
  if (goalsArr.length >= 1)
    goal1 = goalsArr[0]
  if (goalsArr.length >= 2)
    goal2 = goalsArr[1]
  if (goalsArr.length >= 3)
    goal3 = goalsArr[2]

  //return all the numeric values present in the str.
  function getNumericValues(str) {
    let arrayOfNumbers = [];
    let stringWords = str.split(' ');
    stringWords.forEach(word => {
      //replace all non numeric characters with nothing.
      let isNum = word.replace(/\D/g, '');
      if(isNum.length) {
        //convert string to numeric and add in number array.
        arrayOfNumbers.push(+isNum);
      }
    })
    return arrayOfNumbers;
  }

  let riskTakerNumericValues = getNumericValues(e.values[5]);
  let gameShowNumericValues = getNumericValues(e.values[6]);
  let vacationNumericValues = getNumericValues(e.values[7]);

  //do calculations with numbers.
  console.log(riskTakerNumericValues);
  console.log(gameShowNumericValues);
  console.log(vacationNumericValues);

  //for example: multiply all numeric values from risk taker column field with 2.
  riskTakerNumericValues.forEach(val => val * 2);

//grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);

//grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID)

//create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + ' Investment Policy', folder);

//modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());

  var body = doc.getBody();

  body.replaceText('%InvestorName%', investorName);
  body.replaceText('%Date%', timeStamp);

  body.replaceText('%Goal1%', goal1.trim())
  body.replaceText('%Goal2%', goal2.trim())
  body.replaceText('%Goal3%', goal3.trim())

  doc.saveAndClose();

//find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}
