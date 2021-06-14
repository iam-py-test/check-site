var htmlencode = function(data){
  return data.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#39;").replaceAll("\\","&#92;").replaceAll("$","&#36;").replaceAll("=","&#61;").replaceAll("%","&#37;")
}

chrome.contextMenus.create({title:"Check link",id:"linkcheck",contexts:["link"]})
chrome.contextMenus.onClicked.addListener(async function(data,tab){
  
  console.log(data,tab,1)
  if(data.menuItemId === "linkcheck"){
chrome.windows.create({type:"popup","url":"link_report.html?url=" + encodeURIComponent(data.linkUrl)})
  }
  if(data.menuItemId === 'forceu'){
    checksite.private.updateLists()
  }
})

chrome.contextMenus.create({"title":"Force an cache update",id:"forceu",contexts:["browser_action"]})

try{
checksite.private.updateLists()
}
catch(err){
  console.log("Error:",err)
}
