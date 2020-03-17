var Collector = require('Netflow');
var port = 2055;
var monitorIP = [10, 2, 1, 150];
var x = new Collector(function(err){
    if(err!=null){
        console.log(err);
    }
}).on("listening", function(){
    console.log(`Listening on port ${port}`);
}).on("packet", function(packet){
    Object.keys(packet.v5Flows).forEach(function(p){

        if(validate(packet.v5Flows[p], monitorIP)){
            console.log(`Src Address: ${packet.v5Flows[p].srcaddr}`);
            console.log(`Dst Address: ${packet.v5Flows[p].dstaddr}`);
        }
        

    });
    /* console.log("Begin")
    console.log(packet.v5Flows[0].srcaddr);
    console.log(packet.v5Flows[0].dstaddr);
    console.log("End"); */
}).listen(port);


function validate(flow, target){
    var src = flow.srcaddr;
    var dst = flow.dstaddr;
    var valid = true;
    if(src[0] === target[0] && src[1] === target[1] && src[2] === target[2] && src[3] === target[3]){
        return true;
    }else if(dst[0] === target[0] && dst[1] === target[1] && dst[2] === target[2] && dst[3] === target[3]){
        return true;
    }else{
        return false;
    }
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