var htmlencode = function(data){
  return data.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;").replaceAll("'","&#39;").replaceAll("\\","&#92;").replaceAll("$","&#36;").replaceAll("=","&#61;").replaceAll("%","&#37;")
}

chrome.contextMenus.create({title:"Check link",id:"linkcheck",contexts:["link"]})
chrome.contextMenus.onClicked.addListener(async function(data,tab){
  console.log(data,tab,1)
chrome.windows.create({type:"popup","url":"link_report.html?url=" + encodeURIComponent(data.linkUrl)})
})
try{
checksite.private.updateLists()
}
catch(err){
  console.log("Error:",err)
}
