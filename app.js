var _ = require('lodash');
var Collector = require('Netflow');
var sql = require('mssql');
config = require('./config');

var packetCount = 0;
var packetThreshold = 100; //number of packets before writing to DB

//need to use 2 collectors so no flows are missed during DB Write
var flowCollector1 = []; // {ip, upBytes, downBytes}
var flowCollector2 = []; // {ip, upBytes, downBytes}
var useFlow1 = true;


var x = new Collector(function(err){
    if(err!=null){
        console.log(err);
    }
}).on("listening", function(){
    console.log(`Listening on port ${config.port}`);
}).on("packet", function(packet){
    packetCount ++;
    
    _.forEach(packet.v5Flows, function(f){
        let ip, upBytes = 0, downBytes = 0;
        
        if(config.localIP(f.srcaddr)){
            ip = f.srcaddr.join('.');
            upBytes = f.dOctets;
        }else if(config.localIP(f.dstaddr)){
            ip = f.dstaddr.join('.');
            downBytes = f.dOctets;
        }else return;

        if(useFlow1){
            let ipExists = false;
            _.forEach(flowCollector1, function(fc){
                if(fc.ip == ip){
                    ipExists = true;
                    fc.upBytes += upBytes;
                    fc.downBytes += downBytes;
                    
                }
            });
            if(!ipExists){
                flowCollector1.push({ip: ip, upBytes: upBytes, downBytes: downBytes});
            }
            if(packetCount > packetThreshold){
                console.log("Flow Full, Writing to DB");
                writeToDB(flowCollector1);
                packetCount = 0;
                useFlow1 = false;
            }
        }else{
            let ipExists = false;
            _.forEach(flowCollector2, function(fc){
                if(fc.ip == ip){
                    ipExists = true;
                    fc.upBytes += upBytes;
                    fc.downBytes += downBytes;
                    
                }
            });
            if(!ipExists){
                flowCollector2.push({ip: ip, upBytes: upBytes, downBytes: downBytes});
            }
            if(packetCount > packetThreshold){
                writeToDB(flowCollector2);
                packetCount = 0;
                useFlow1 = true;
            }
        }
    });
}).listen(config.port);


function writeToDB(obj){
    // console.log("WRITE")

}
function dbTest(){
    console.log("dbTest");
    sql.connect(config.db, function(err){
        if(err) console.log(err);

        var request = new sql.Request();

        request.query(`SELECT name FROM customer WHERE id = '2368'`, function(err, data){
            if(err) console.log(err);

            console.log(data.recordset[0]);
            sql.close();
        });
    });
}
/* {
    srcaddr: [Array],
    dstaddr: [Array],
    nexthop: [Array],
    input: 3,
    output: 0,
    dPkts: 3,
    dOctets: 924,
    first: 2545151524,
    last: 2545157544,
    srcport: 68,
    dstport: 67,
    pad1: 0,
    tcp_flags: 0,
    prot: 17,
    tos: 184,
    src_as: 0,
    dst_as: 0,
    src_mask: 0,
    dst_mask: 0
  } */