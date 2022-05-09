const uuid = require('uuid');
const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');
const env = dotenv.parse(fs.readFileSync(`${__dirname}/../.env`));

console.log("ENV data", env);

//parse timestamp to int
const oauth_nonce = uuid.v1().replace(/-/g, "").substring(0,24);
const signature_for = {
    Trox_S: {
        consumer_key: process.env.TROXSBCK || env.TROXSBCK || "",
        consumer_secret: process.env.TROXSBCS || env.TROXSBCS || "",
        access_token: process.env.TROXSBAT || env.TROXSBAT || "",
        token_secret: process.env.TROXSBTS || env.TROXSBTS || "",
        realm: process.env.TROXSBREALM || env.TROXSBREALM || "",
        organization: process.env.TROXSBORGANIZATION || env.TROXSBORGANIZATION || ""
    },
    Trox_P: {
        consumer_key: process.env.TROXPRODCK || env.TROXPRODCK || "",
        consumer_secret: process.env.TROXPRODCS || env.TROXPRODCS || "",
        access_token: process.env.TROXPRODAT || env.TROXPRODAT || "",
        token_secret: process.env.TROXPRODTS || env.TROXPRODTS || "",
        realm: process.env.TROXPRODREALM || env.TROXPRODREALM || "",
        organization: process.env.TROXPRODORGANIZATION || env.TROXPRODORGANIZATION || ""
    },
    JDGroup: {
        consumer_key: process.env.JDGROUPCK || env.JDGROUPCK || "",
        consumer_secret: process.env.JDGROUPCS || env.JDGROUPCK || "",
        access_token: process.env.JDGROUPAT || env.JDGROUPCK || "",
        token_secret: process.env.JDGROUPTS || env.JDGROUPCK || "",
        realm: process.env.JDGROUPREALM || env.JDGROUPCK || "",
        organization: process.env.JDGROUPORGANIZATION || env.JDGROUPCK || ""
    }
}

function encodeParams(parameters) {
    var container = new Array();
    container.push(`deploy=${parameters.deploy}`);
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
    console.log("params authorization: ", signature_for.Trox_S);
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