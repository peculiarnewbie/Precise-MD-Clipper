
if(!document.getElementById("closeButton")){

    const floatingPage = document.createElement("div");
    floatingPage.id = "floatingPage";
    floatingPage.style.position = "fixed";
    floatingPage.style.top = "50%";
    floatingPage.style.left = "50%";
    floatingPage.style.transform = "translate(-50%, -50%)";
    floatingPage.style.backgroundColor = "white";
    floatingPage.style.padding = "10px";
    floatingPage.style.zIndex = "9999";
    floatingPage.innerHTML = "<button id='closeButton'>Close</button> <button id='downloadButton'>Download</button> <p>sheeesh</p>";
    
    document.body.appendChild(floatingPage);
    
    console.log("create floating page")
    const closeButton = document.getElementById("closeButton");
    closeButton.addEventListener("click", () => {
        document.getElementById("floatingPage").style.display = "none";
    });

    const downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", () => {
        console.log("clicked download")
        chrome.runtime.sendMessage({ action: "download" }, (response) => {
            console.log("sent message")
            if (response.success) {
                console.log("success")
                document.getElementById("floatingPage").style.display = "none";
            }
            console.log("done")
        })
        
    });
}
else{
    document.getElementById("floatingPage").style.display = "block";
}

    console.log("called")
    
   
