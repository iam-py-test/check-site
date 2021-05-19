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
        res(tab.url)
      })
    })
  }
}
(async function(){
document.getElementById('hostname').textContent = checksite.gethostorurl(await getTabURL())
})()
