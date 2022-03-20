/* Moralis init code */
const serverUrl = "YOUR_SERVER_URL";
const appId = "YOUR_APP_ID";
Moralis.start({ serverUrl, appId });


var loginBtn = document.getElementById("btn-login");
var logoutBtn = document.getElementById("btn-logout");
var getBtn = document.getElementById("btn-get");
var downloadBtn = document.getElementById("btn-download");

async function getUsers() {
  // request user data
  userData = await Moralis.Cloud.run("userList");
  // provide data in html
  document.getElementById("content").innerHTML = userData;
}

async function getUsersCSV() {
  // request user data
  userData = await Moralis.Cloud.run("userList");

  // prepare csv data
  objJson = JSON.parse(userData);
  if (objJson.length != 0) {
    // Get all elements in array
    var json = [];
    for (let i = 0; i < objJson.length; i++) {
      json.push(objJson[i]);
    }
    var fields = Object.keys(objJson[0]);
    var replacer = function (key, value) { return value === null ? '' : value };
    var csv = json.map(function (row) {
      return fields.map(function (fieldName) {
        cell = JSON.stringify(row[fieldName], replacer);
        if (cell.includes(",")) {
          // comma ... !
          return '"' + JSON.stringify(row[fieldName], replacer).replaceAll('"', '""') + '"';
        }
        else {
          return JSON.stringify(row[fieldName], replacer);
        }
      }).join(',')
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
  }
  else {
    csv = "";
  }

  // provide the name for the CSV file to be downloaded  
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';

  hiddenElement.download = 'UserList.csv';
  hiddenElement.click();
}


async function logIn() {
  let user = Moralis.User.current();
  if (!user) {
    try {
      user = await Moralis.authenticate();
      document.getElementById("myAddress").innerHTML = user.get('ethAddress');
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } catch (error) {
      console.log(error);
    }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  document.getElementById("myAddress").innerHTML = "";
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}

loginBtn.onclick = logIn;
logoutBtn.onclick = logOut;
getBtn.onclick = getUsers;
downloadBtn.onclick = getUsersCSV;

if (Moralis.User.current()) {
  document.getElementById("myAddress").innerHTML = Moralis.User.current().get('ethAddress');
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
}
else {
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}
