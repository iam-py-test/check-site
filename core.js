/*
this script contains the functions used by the popup, background and the link report
Last Updated: 10/6/2021
*/

window.checksite = {
  private:{
	  updateLists(){
		  var lists = ["https://raw.githubusercontent.com/curbengh/urlhaus-filter/master/urlhaus-filter-domains.txt","https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareDomains.txt?noc=true","https://raw.githubusercontent.com/iam-py-test/my_filters_001/main/Alternative%20list%20formats/porn_pure_hosts.txt?noc=true","https://raw.githubusercontent.com/iam-py-test/site-reports-001/main/site_reports.json?noc=true"]
		  lists.forEach(async function(url){
		  try{
			  const c = await caches.open("assets")
			  c.add(url)
		  }
		  catch(err){
		  }
		  })
	  },
    isLocalhost(url){
		try{
		const u = new URL(url);
		
		}
		catch(err){
			//if it is not a real URL, than it is not localhost
			return false
		}
		try{
			const u = new URL(url)
			if(u.protocol === "data:" ||  (u.protocol !== "http:" & u.protocol !== "https:")){
				//if it is not https: or http:
				return false;
			}
			else{
				if(u.hostname === "127.0.0.1"){
					//if it is 127.0.0.1, it is localhost even thought it would fail our test
					//so we return true
					return true;
				}
				else{
					if(u.host === "localhost"){
						//if it is plain localhost
						return true;
					}
					else{
					//if it is http: or https: and it is not 127.0.0.1 or plain localhost
					//split it into diffrent parts
				var urlParts = u.hostname.split(".")
				//if the last part is localhost. This should be true for all subdomains of localhost, but untrue for anyone else
				return urlParts[urlParts.length - 1] === "localhost";
					}
				}
			}
		}
		catch(err){
			return false;
		}
	}
	
  },
	
isSecureConnection(url){
	try{
		var purl = new URL(url)
		if(purl.protocol === 'https:' || checksite.private.isLocalhost(url) === true){
			return true
		}
		if(purl.protocol === 'http:'){
			return false
		}
		return "unknown"
	}
	catch(err){
		console.log("Error: ",err)
		return "unknown"
	}
},
	
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
        caches.open("assets").then(function(cache){
          console.log(cache)
          cache.add("https://raw.githubusercontent.com/curbengh/urlhaus-filter/master/urlhaus-filter-domains.txt")
        })
      }
      catch(err){
	 //on an error, return null    
        res(null)
      }
    })
  },
  dandelioncheck:async function(domain){
    /*this function checks a domain against DandelionSprout's Anti-malware list*/
	  /*
	  args: a domain
	  returns: if that domain is blocked in DandelionSprout's antimalware list
	  */
    return new Promise(res => {
      try{
        //fetch it
        fetch('https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareDomains.txt?noc=true&random=' + Math.round(Math.random()*900)).then(async function(req){
          try{
		  var c = await caches.open("assets")
		  c.add('https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareDomains.txt?noc=true')
	  }
		catch(err){
		}
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
		
        }).catch(async function(err){
          //if there is an error, use the cached version
          console.log("Error:",err)
		try{
			caches.match('https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareDomains.txt?noc=true').then(async function(req){
				console.log(req)
				if(req === undefined){
					//if it is not cached (i.e. first run) return null
					res(null)
				}
				else{
					//if it is cached, parse it normally
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
				}
			}).catch(console.warn)
		}
		catch(err){
			//if something goes wrong, return null
          res(null);
		}
        })
      }
      catch(err){
        res(null)
      }
    })
  },
  pornblock:function(domain){
    /*fetch my pornography blocklist*/
    //please report problems with this blocklist and unblocked domains to https://github.com/iam-py-test/my_filters_001
    //todo: add link to the support websites for each list 
   return new Promise(function(res){
     //fetch the list off GitHub - for easy parsing we are using the pure (no comments - just entries) HOSTS version of the porn blocklist
     //todo: store this for offline use
     fetch("https://raw.githubusercontent.com/iam-py-test/my_filters_001/main/Alternative%20list%20formats/porn_pure_hosts.txt?noc=true&random=" + Math.round(Math.random()*900)).then(async function(req){
       if(req.ok !== true){
         //if something went wrong, but no error was thrown 
         //return null and log the request for debugging
         console.log("Req status error:",req)
         res(null)
         //exit the function to prevent errors
         return null;
       }
       //get the text and split it up into an array based on lines
       var text = await req.text()
       var lines = text.split("\n");
       for(var t = 0;t < lines.length;t++){
         // we are fetching the pure porn hosts, so comments are not a worry
         try{
           //split it - the part that is important is the domain part, the other part is just 127.0.0.1
         if(lines[t].split(" ")[1] === domain){
           res(true)
         }
         }
         catch(err){
           //be ready for weird things
           //i.e. a random line with no content, or an invalid line
         }
       }
       //if nothing happened, assume that there was no match
       res(false)
     })
   }).catch(function(err){
     //handle errors (like the network going out) by logging them and returning null
     console.log("Error:",err);
     res(null)
   })
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
	    if(checksite.private.isLocalhost("http://" + domain) === true){
		    res("localhost")
	    }
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
  lists:new Map([["The BlockList Project fraud","https://raw.githubusercontent.com/blocklistproject/Lists/master/fraud.txt"],["The BlockList Project malware","https://raw.githubusercontent.com/blocklistproject/Lists/master/malware.txt"],["The BlockList Project phishing","https://raw.githubusercontent.com/blocklistproject/Lists/master/phishing.txt"],["The BlockList Project ransomware","https://raw.githubusercontent.com/blocklistproject/Lists/master/ransomware.txt"],["The BlockList Project scams","https://raw.githubusercontent.com/blocklistproject/Lists/master/scam.txt"],["The BlockList Project crypto","https://raw.githubusercontent.com/blocklistproject/Lists/master/crypto.txt"]]),
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
