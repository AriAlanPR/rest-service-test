const res = require("express/lib/response");

console.log("Entered code logic");

function showTxtPrettyJSON() {
    try {
        let json = document.getElementById("body").value;
        json = JSON.parse(json);
        console.log("json: ");
        console.log(json);
        document.getElementById("jsoncontent").innerHTML = json;
    } catch(e) {
        console.error("Error converting text to Json");
    }
}

async function Request() {
    try {
        let json = document.getElementById("json").value;
        json = JSON.parse(json);
        let url = document.getElementById("requesturl").value;
        let method = document.getElementById("method").value;

        let response = await fetch(url, {
            body: json,
            method: method,
            headers: { 
                "Content-Type": "application/json"
            }
        });

        response = await response.text();

        document.getElementById("jsoncontent").innerHTML = response;
    } catch (e) {
        console.error("Error in request", e.message);
    }
}