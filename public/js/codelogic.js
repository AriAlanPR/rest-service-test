console.log("Entered code logic");

function showTxtPrettyJSON() {
    try {
        let json = document.getElementById("body").value;
        if(json.includes('\\')) json = JSON.parse(json);
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
        json = {body: json};
        json.organization = document.getElementById("organizationid").value;
        json.script = document.getElementById("scriptnumber").value;
        json.deploy = document.getElementById("deploynumber").value;
        json.method = document.getElementById("method").value;
        json.timestamp = (parseInt(Date.now() / 1000));
        if(document.getElementById("tba").checked) {
            json.netsuite_instance = document.getElementById("netsuite_instance").value;
        }

        let response = await fetch('/', {
            body: JSON.stringify(json),
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            }
        });

        response = await response.text();

        console.log("response:", response);
        document.getElementById("body").value = response;
        document.getElementById("makepretty").click();
    } catch (e) {
        console.error("Error in request", e.message);
        console.error("Error in line", e.lineNumber);
    }
}

function enableNSInstance(sender) {
    if(sender.checked) {
        document.getElementById("netsuite_instance").disabled = false;
    } else {
        document.getElementById("netsuite_instance").disabled = true;
    }
}