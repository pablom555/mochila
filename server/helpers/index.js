const { OAuth2Client } = require('google-auth-library');

const createJSONResponse = (ok, message) => {

    let jsonResp = { ok };

    if (!ok) {
        jsonResp.err = message
    } else {
        jsonResp.data = message
    }

    return jsonResp;
}


const verifyTokenGoogle = async (token, CLIENT_ID) => {

    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

module.exports = {
    createJSONResponse,
    verifyTokenGoogle
}