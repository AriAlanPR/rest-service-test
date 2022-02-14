console.log("Entered code logic");

function showTxtPrettyJSON() {
    try {
        let json = document.getElementById("body").value;
        console.log("json", json);
    } catch(e) {
        console.error("Error converting text to Json");
    }
}