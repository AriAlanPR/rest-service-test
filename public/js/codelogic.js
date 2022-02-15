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