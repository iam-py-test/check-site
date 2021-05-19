var checksite = {
  urlhaus:function(domain){
    return new Promise(res => {
      try{
        fetch('https://raw.githubusercontent.com/curbengh/urlhaus-filter/master/urlhaus-filter-domains.txt').then(async function(req){
          var text = await req.text()
          var split = text.split("\n")
          for(var t = 0;t < split.length;t++){
            if(split[t].startsWith("#")){continue}
            if(split[t] === domain){
              res(true)
            }
          }
          res(false)
        }).catch(function(){res(null)})
      }
      catch(err){
        res(null)
      }
    })
  },
  gethostorurl:function gethostorurl(url){
    try{
      return (new URL(url).hostname||url)
    }
    catch(err){
      return url
    }
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
  var url = await checksite.getTabURL()
  console.log(checksite.gethostorurl(url),url)
document.getElementById('hostname').textContent = checksite.gethostorurl(await checksite.getTabURL())
  var result_urlhaus = await checksite.urlhaus(checksite.gethostorurl(url))
  document.getElementById('urlhaus').textContent = (result_urlhaus === true)?"malware":(result_urlhaus === false)?"safe":"unknown"
  var urlreports = document.querySelectorAll("a.url[data-href]")
  for(var t = 0;t < urlreports.length;t++){
    urlreports[t].href = urlreports[t].getAttribute("data-href").replace("$URL",url)
  }
}
main().catch(function(err){
  console.trace("Error:",err)
})
