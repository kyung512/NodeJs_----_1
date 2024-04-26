const fs = require('fs');

fs.readFile('sample.txt', 'utf8', function(err, data){
  console.log(data)
});

var testFolder = './data';
fs.readdir(testFolder, function(error, filelist) {
  console.log(filelist);
})