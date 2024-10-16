function jwt_decode(token) {
    const parts = token.split('.').slice(0, 2)
        .map(v => Buffer.from(v, 'base64url').toString())
        .map(JSON.parse);
    return {headers: parts[0], payload: parts[1]};
}

const profile_me = async (token) => {
    const response = await ngx.fetch(`${process.env.USER_FETCH_URL}`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        },
        verify: false
    })
    return await response.text();
}

const auth = async (r) => {
    console.log(r)
    try {
        const raw_jwt = r.headersIn.Authorization.slice(7);
        const jwt_content = jwt_decode(raw_jwt)
        if (jwt_content) {
            await profile_me(raw_jwt);
            r.return(200, process.env.SECRETS);
            return;
        }
    } catch (e) {
        console.log(e)
        r.return(401, "Unauthorized due to error on decode" + e.toString());
        return;
    }
    r.return(401, "Unauthorized");
}


export default {auth}