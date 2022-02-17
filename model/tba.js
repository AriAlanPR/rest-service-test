const uuid = require('uuid');
const crypto = require('crypto');

const oauth_timestamp = (Math.round(new Date().getTime() / 1000));
const oauth_nonce = uuid.v1().replace(/-/g, "").substring(0,24);
const signature_for = {
    Trox: {
        consumer_key: "f67937de9b073215e3bc3f0257208109344207649027c3982aa4bcb1bc04eeac",
        consumer_secret: "84138d738d37db327a481e7fca94c8788338dc6d9af4c17ab0d8253d2d8be477",
        access_token: "cd0ab3f9eab5df82e573f8631b7b5828540e08d8ecf74465b9ce6139ed11b2a0",
        token_secret: "a15460f7671f882b59718a692cd3e0566325b72ac5cb23d76e75de8ae828bf3a",
        realm: "3393086_SB1",
        organization: "3393086-sb1"
    },
    JDGroup: {
        consumer_key: "347d06d618f5255b011dc214c6d23baf0b3b92fbdc58ceb3c192ccddf03086cb",
        consumer_secret: "d8e6160af221b214f72e3a0c1895b197ecc33a09fe0b3dbb376ec31282cf35ae",
        access_token: "837ac86209b42ca34aba3f6514d7bbcd3d17ee2a26bc8667edaf24c0f4c90440",
        token_secret: "358c05c74d522d760e2018f46f4b80e2b4a46e3e2102ce85c48dfc7af82676d3",
        realm: "TSTDRV1681055",
        organization: "tstdrv1681055"
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