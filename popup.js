var checksite = {
  urlhaus:function(domain){
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
  console.log(checksite.gethostorurl(await checksite.getTabURL()))
document.getElementById('hostname').textContent = checksite.gethostorurl(await checksite.getTabURL())
  
}
main().catch(console.log)
