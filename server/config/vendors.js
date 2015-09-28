/**
 * Created by gmazlami on 28.09.15.
 */
var vendors = require("./vendor_db");

exports.lookup = function(mac_addr){
  var prefix = mac_addr.substr(0,6);
  console.log(vendors.vendors[prefix]);
}
