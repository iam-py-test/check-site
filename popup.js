/*this script uses window.checksite from core.js*/
window.main = async function(){
  /*a main async function for all operations*/
  var url = await checksite.getTabURL()
  console.log(checksite.gethostorurl(url),url)
document.getElementById('hostname').textContent = checksite.gethostorurl(url)
  /*check the site against URLHaus*/
checksite.urlhaus(checksite.gethostorurl(url)).then(function(result_urlhaus){
  document.getElementById('urlhaus').textContent = (result_urlhaus === true)?"malware":(result_urlhaus === false)?"unrated":"unknown"
}).catch(console.error)
  /*check the site against Dandelion Sprout's Antimalware list*/
  checksite.dandelioncheck(checksite.gethostorurl(url)).then(function(result){
    document.getElementById('dand').textContent = (result === true)?"malware":(result === false)?"unrated":"unknown"
  }).catch(console.error)
  /*check the site against my porn blocklist*/
  checksite.pornblock(checksite.gethostorurl(url)).then(function(result){
    document.getElementById('pornblock').textContent = (result === true)?"porn":(result === false)?"unrated":"unknown"
  }).catch(console.error)
  
  checksite.getSiteRep(checksite.gethostorurl(url)).then(function(result){
    if(result === 'site-safe'){document.getElementById('sitereport').title = 'This site is safe, but some content on it may not'}
    document.getElementById('sitereport').textContent = (result === "unknown")?"Not rated":(result === "safe")?"Safe":(result === "site-safe")?"Caution":(result === "malware")?"Malware":"Unknown"
  })
  var urlreports = (document.querySelectorAll("a.reportlink[data-href]")||[])
  for(var t = 0;t < urlreports.length;t++){
    urlreports[t].href = urlreports[t].getAttribute("data-href").replace("$URL",encodeURIComponent(url)).replace("$HOST",encodeURI(checksite.gethostorurl(url)))
  }
}
main().catch(function(err){
  console.trace("Error:",err)
})
