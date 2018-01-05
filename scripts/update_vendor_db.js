const fs = require('fs')
const readline = require('readline')

var rd = readline.createInterface({
  input: fs.createReadStream('./oui.txt'),
  output: process.stdout,
  console: false
});

const vendorList = ['Samsung', 'Apple', 'Google', 'Cisco', 'Huawei', 'Sony', 'Hewlett Packard', 'D-Link', 'Microsoft']

console.log(`exports.vendors = {`)

rd.on('line', function(line) {

  // if we find base 16, we are on a parsable line
  if (line.indexOf('(base 16)') !== -1) {
    
    let lineArr = line.split(/\s+/)
    let macPrefix = lineArr[0].toLowerCase()
    let vendor = lineArr.slice(lineArr.indexOf('16)') + 1).join(' ')

    for (let name of vendorList) {
      if (vendor.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
        vendor = name
      }
    }

    console.log(`\t"${macPrefix}": "${vendor}",`)
  }

});

rd.on('close', function() {
  console.log(`}`)
})