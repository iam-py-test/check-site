var checksite = {
  urlhaus:function(domain){
    /*this function checks a domain against the domains-only version of URLHaus*/
    return new Promise(res => {
      try{
        //download the list
        fetch('https://raw.githubusercontent.com/curbengh/urlhaus-filter/master/urlhaus-filter-domains.txt').then(async function(req){
          var text = await req.text()
          var split = text.split("\n")
          for(var t = 0;t < split.length;t++){
            //if it is a comment, ignore it
            if(split[t].startsWith("#")){continue}
            if(split[t] === domain){
              //if there is a match, return true
              res(true)
            }
          }
          //if there are no matches, return false
          res(false)
        }).catch(function(err){
          //if there is an error, log it and attempt to fetch the internal version
          console.log("Error:",err)
          fetch("/assets/urlhaus.txt").then(async function(req){
              var text = await req.text()
          var split = text.split("\n")
          for(var t = 0;t < split.length;t++){
            if(split[t].startsWith("#")){continue}
            if(split[t] === domain){
              res(true)
            }
          }
          res(false)
          }).catch(function(err){
          res(null);
          })
        })
      }
      catch(err){
        res(null)
      }
    })
  },
  dandelioncheck:function(domain){
    /*this function checks a domain against DandelionSprout's Anti-malware list*/
    return new Promise(res => {
      try{
        //fetch it
        fetch('https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareDomains.txt?noc=true&random=' + Math.round(Math.random()*900)).then(async function(req){
          var text = await req.text()
          var split = text.split("\n")
          for(var t = 0;t < split.length;t++){
            if(split[t].startsWith("#")){continue}
            //unlike URLHaus, this needs the slice
            if(split[t].slice(0,-1) === domain){
              //if there is a match
              res(true)
              break;
            }
          }
          res(false)
        }).catch(function(err){
          //if there is an error, return null
          //to do: add to assets for offline use
          console.log("Error:",err)
          res(null);
        })
      }
      catch(err){
        res(null)
      }
    })
  },
  pornblock:function(domain){
    /*fetch my pornography blocklist*/
    //please report problems with this blocklist to https://github.com/iam-py-test/my_filters_001
   return new Promise(function(res){
     //fetch the list off GitHub
     //todo: create and fetch a domains-only version
     fetch("https://raw.githubusercontent.com/iam-py-test/my_filters_001/main/porn.txt?noc=true&random=" + Math.round(Math.random()*900)).then(async function(req){
       var text = await req.text()
       var lines = text.split("\n");
       for(var t = 0;t < lines.length;t++){
         //if it is a comment or a url, ignore it
         if(lines[t].startsWith('!') || lines[t].startsWith("||")){continue}
         //unlike URLHaus, this needs the slice
         if(lines[t].slice(0,-1) === domain){
           res(true)
         }
       }
       res(false)
     })
   }).catch(function(err){console.log("Error:",err);res(null)})
  },
  gethostorurl:function gethostorurl(url){
    /*a function to get the hostname out of a url, and if it can not be fetched, return the url
    this function is used for the host displayed and for checking the blocklists*/
    try{
      //try to parse the url
      return (new URL(url).hostname||url /*for valid urls with no host, return the url - i.e. about:blank*/)
    }
    catch(err){
      //if the url can not be parsed, assume it is invalid and return the url
      return url
    }
  },
  getSiteRep:function(domain){
    return new Promise(res => {
      fetch("https://raw.githubusercontent.com/iam-py-test/site-reports-001/main/site_reports.json?noc=true&random=" + Math.round(Math.random()*900)).then(async (req) => {
        
        try{
          var text = await req.text()
        var obj = JSON.parse(text)
            }
catch(err){
  var obj = {}
}
        res((obj[domain]||"unknown"))
      }).catch(function(){res(null)})
    })
  },
  getTabURL: function(){
    return new Promise(res => {
      chrome.tabs.query({active:true,currentWindow:true},function(tab){
        console.log(tab)
        res(tab[0].url)
      })
    })
  }
}
var main = async function(){
  /*a main async function for all operations*/
  var url = await checksite.getTabURL()
  console.log(checksite.gethostorurl(url),url)
document.getElementById('hostname').textContent = checksite.gethostorurl(await checksite.getTabURL())
checksite.urlhaus(checksite.gethostorurl(url)).then(function(result_urlhaus){
  document.getElementById('urlhaus').textContent = (result_urlhaus === true)?"malware":(result_urlhaus === false)?"unrated":"unknown"
}).catch(console.error)
  checksite.dandelioncheck(checksite.gethostorurl(url)).then(function(result){
    document.getElementById('dand').textContent = (result === true)?"malware":(result===false)?"unrated":"unknown"
  }).catch(console.error)
  checksite.pornblock(checksite.gethostorurl(url)).then(function(result){
    document.getElementById('pornblock').textContent = (result===true)?"porn":(result===false)?"unrated":"unknown"
  }).catch(console.error)
  checksite.getSiteRep(checksite.gethostorurl(url)).then(function(result){
    document.getElementById('sitereport').textContent = (result === 'unknown')?"Not rated":(result==="safe")?"Safe":(result==="site-safe")?"This site is safe but some content on it may not":(result==='malware')?"Malware":"Unknown"
  })
  var urlreports = (document.querySelectorAll("a.url[data-href]")||[])
  for(var t = 0;t < urlreports.length;t++){
    urlreports[t].href = urlreports[t].getAttribute("data-href").replace("$URL",encodeURIComponent(url))
  }
}
main().catch(function(err){
  console.trace("Error:",err)
})
