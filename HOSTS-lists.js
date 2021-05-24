var hostslists = {
  lists:new Map(["BlockListProject Fraud","https://raw.githubusercontent.com/blocklistproject/Lists/master/fraud.txt"]),
  loadHOSTS:function(domain,list){
    return new Promise(res => {
      fetch(list).then(async function(req){
        var text = await req.text()
        var stext = text.split("\n")
        for(var t = 0;t < stext.length;t++){
          if(stext[t].startsWith('#')){continue}
          if(domain === stext[t].split(" ")[1]){
            res(true)
          }
        }
        res(false)
      }).catch(function(){res(null)})
    })
  }
}
