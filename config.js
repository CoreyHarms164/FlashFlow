var _ = require('lodash');
var port = 2055;
var publicIPs = [[64, 19, 104, 0],[64, 19, 105, 0]]; // will be /24 addresses
var db = {
    user: '',
    password: '',
    server: '',
    database: ''
};

exports.port = port;
exports.db = db;

exports.localIP = function(ipArr){
    var res = false;
    if(ipArr.length != 4) return false;

    if(ipArr[0] == 10) return true;

    _.forEach(publicIPs, function(ip){
        if(ipArr[0] == ip[0] && ipArr[1] == ip[1] && ipArr[2] == ip[2] && ipArr[3] >=1 && ipArr[3] <= 254) res = true;
    });
    
    return res;
}