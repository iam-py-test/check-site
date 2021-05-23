var isshort = function(url){
  console.log(url)
  // http://www.surbl.org/tld
  var host = checksite.gethostorurl(url)
  if(url.includes("google.com/url") === true){return "yes"}
  var shortdomains = ["bit.ly","bit.do","ow.ly","goo.gl","x.co","rebrand.ly","tinyurl.com","t.co","is.gd","ht.ly"]
  if(shortdomains.includes(host)){
    return "yes"
  }
  else{
    return "no"
  }
}

(async function(){
  var url = (new URL(location).searchParams.get("url")||"")
  console.log(url)
  document.getElementById('host').textContent = "Report for " + checksite.gethostorurl(url)
  document.getElementById('host').title = url
  document.title = "Report for link"
  checksite.urlhaus(checksite.gethostorurl(url)).then(function(result){
    document.getElementById("urlhaus").textContent = (result===true)?"Detected":"Not detected"
  })
  checksite.dandelioncheck(checksite.gethostorurl(url)).then(function(result){
    document.getElementById("dand").textContent = (result === true)?"Detected":"Not detected"
  })
  document.getElementById('short').textContent = isshort(url)
  document.querySelectorAll(".reportlink").forEach(function(l){
    l.href = l.getAttribute("data-href").replace("$URL",encodeURIComponent(url)).replace("$HOST",encodeURIComponent(checksite.gethostorurl(url)))
  })
})().catch(console.error)
