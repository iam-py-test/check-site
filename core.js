window.checksite = {
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
    /*get site rep from check site's lists*/
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
        res(tab[0].url)
      })
    })
  }
}


var hostslists = {
  lists:new Map([["The BlockList Project fraud","https://raw.githubusercontent.com/blocklistproject/Lists/master/fraud.txt"],["The BlockList Project malware","https://raw.githubusercontent.com/blocklistproject/Lists/master/malware.txt"],["The BlockList Project phishing","https://raw.githubusercontent.com/blocklistproject/Lists/master/phishing.txt"],["The BlockList Project ransomware","https://raw.githubusercontent.com/blocklistproject/Lists/master/ransomware.txt"],["The BlockList Project scams","https://raw.githubusercontent.com/blocklistproject/Lists/master/scam.txt"],["The BlockList Project crypto","https://raw.githubusercontent.com/blocklistproject/Lists/master/crypto.txt"],["StevenBlack HOSTS","https://raw.githubusercontent.com/StevenBlack/hosts/master/data/StevenBlack/hosts"]]),
  loadHOSTS:function(domain,list){
    return new Promise(res => {
      fetch(list + (list.includes("?")?"&randomnoc=" + Math.round(Math.random()*900):"?randomnoc=" + Math.round(Math.random()*1000))).then(async function(req){
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
