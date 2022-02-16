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
        let json = JSON.parse(document.getElementById("json").value);
        json.body = json;
        json.url = document.getElementById("requesturl").value;
        json.method = document.getElementById("method").value;
        

        let response = await fetch('/', {
            body: JSON.stringify(json),
            method: method,
            headers: { 
                "Content-Type": "application/json"
            }
        });

        response = await response.json();

        document.getElementById("jsoncontent").innerHTML = JSON.stringify(response);
    } catch (e) {
        console.error("Error in request", e.message);
    }
}