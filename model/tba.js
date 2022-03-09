const uuid = require('uuid');
const crypto = require('crypto');

//parse timestamp to int
const oauth_nonce = uuid.v1().replace(/-/g, "").substring(0,24);
const signature_for = {
    Trox: {
        consumer_key: process.env.TROXCK || "",
        consumer_secret: process.env.TROXCS || "",
        access_token: process.env.TROXAT || "",
        token_secret: process.env.TROXTS || "",
        realm: process.env.TROXREALM || "",
        organization: process.env.TROXORGANIZATION || ""
    },
    JDGroup: {
        consumer_key: process.env.JDGROUPCK || "",
        consumer_secret: process.env.JDGROUPCS || "",
        access_token: process.env.JDGROUPAT || "",
        token_secret: process.env.JDGROUPTS || "",
        realm: process.env.JDGROUPREALM || "",
        organization: process.env.JDGROUPORGANIZATION || ""
    }
}

function encodeParams(parameters) {
    var container = new Array();
    container.push(`deploy=${1}`);
    container.push(`oauth_consumer_key=${parameters.oauth_consumer_key}`);
    container.push(`oauth_nonce=${parameters.oauth_nonce}`);
    container.push(`oauth_signature_method=${parameters.oauth_signature_method}`);
    container.push(`oauth_timestamp=${parameters.oauth_timestamp}`);
    container.push(`oauth_token=${parameters.oauth_token}`);
    container.push(`oauth_version=${parameters.oauth_version}`);
    container.push(`script=${parameters.script}`);
    
    var encodedParameters = container.join('&');
    console.log('container.join', encodedParameters);
    
    return encodedParameters;
}

module.exports = function(params) {
    const oauth_timestamp = params.timestamp;
    const netsuite_instance = signature_for[params.netsuite_instance];
    const method = params.method;
    const base_url = params.base_url;
    const query = new URLSearchParams(params.query);
    
    if(netsuite_instance) {
        const parameters = {
            deploy: parseInt(query.get("deploy")),
            oauth_consumer_key: netsuite_instance.consumer_key,
            oauth_nonce: oauth_nonce,
            oauth_signature_method: "HMAC-SHA256",
            oauth_timestamp: oauth_timestamp,
            oauth_token: netsuite_instance.access_token,
            oauth_version: "1.0",
            script: parseInt(query.get("script"))
        }

        let encodedParameters = encodeParams(parameters);

        const encodedUrl = encodeURIComponent(base_url);
        encodedParameters = encodeURIComponent(encodedParameters); // encodedParameters which we generated in last step.
        const signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`;
        console.log(signature_base_string);

        const signing_key = `${netsuite_instance.consumer_secret}&${netsuite_instance.token_secret}`;

        const oauth_signature = crypto.createHmac("sha256", signing_key).update(signature_base_string).digest().toString('base64');

        console.log(oauth_signature);

        const encoded_oauth_signature = encodeURIComponent(oauth_signature);
        
        console.log(encoded_oauth_signature);

        return `OAuth oauth_signature="${encoded_oauth_signature}",` +
                `oauth_version="${parameters.oauth_version}",` +
                `oauth_nonce="${parameters.oauth_nonce}",` +
                `oauth_signature_method="${parameters.oauth_signature_method}",` +
                `oauth_consumer_key="${netsuite_instance.consumer_key}",` +
                `oauth_token="${netsuite_instance.access_token}",` + 
                `oauth_timestamp="${parameters.oauth_timestamp}",` +
                `realm="${netsuite_instance.realm}"`;
    }


    return null;
}