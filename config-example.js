var _ = require('lodash');
var port = 2055;
var publicIPs = []; // will be /24 addresses i.e. [[x, x, x, 0], [y, y, y, 0]] The last number is not compared
var db = {X,
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