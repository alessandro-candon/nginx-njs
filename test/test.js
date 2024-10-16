const auth = async () => {
    await fetch('http://localhost:8080/configurations', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: '{"user":{"user_id":"583c3ac3f38e84297c002546","email":"test@test.com","name":"test@test.com","given_name":"Hello","family_name":"Test","nickname":"test","last_ip":"94.121.163.63","logins_count":15,"email_verified":true},"access_token":{"scope":["openid","profile"],"authorization_details":[],"client_id":"my","iss":"test.iss.test","jti":"jit","sub":"asdasd","uid":"asdasd","origin":"asdasd","iat":1717063455,"uuid":"asdasdasd","exp":1717070655},"id_token":{"user_id":"583c3ac3f38e84297c002546","email":"test@test.com","name":"test@test.com","given_name":"Hello","family_name":"Test","nickname":"test","last_ip":"94.121.163.63","logins_count":15,"email_verified":true,"scope":["openid","profile"],"authorization_details":[],"client_id":"my","iss":"test.iss.test","jti":"jit","sub":"asdasd","uid":"asdasd","origin":"asdasd","iat":1717063455,"uuid":"asdasdasd","exp":1717070655}}'
    });
    response = await fetch("http://localhost:8080/as/token.oauth2", {
        method: "POST",
        redirect: "follow"
    });
    return JSON.parse(await response.text()).access_token;
}

const test = async (port, token) => {

    /**
     * Fetch unprotected endpoint
     */
    let response = await fetch(`http://localhost:${port}/hello`, {
        method: "GET",
        redirect: "follow"
    });
    if (response.status !== 200) {
        console.error("Error response!", response);
        process.exit(1);
    }

    /**
     * Fetch secret endpoint without token
     */

    try {
        response = await fetch(`http://localhost:${port}/secret`, {
            method: "GET",
            redirect: "follow"
        });
        if (response.status === 200) {
            console.error("Successful response, but it should not be...");
            process.exit(1);
        }
    } catch (error) {
        if (response.status !== 401) {
            console.error("Error, response should be 401!");
            process.exit(1);
        }
    }


    /**
     * Fetch secret endpoint with token and obtain jwt
     */
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + token);
    response = await fetch(`http://localhost:${port}/secret`, {
        method: "GET",
        headers,
        redirect: "follow"
    });
    if (response.status !== 200) {
        console.error("Error response!", response);
        console.error(await response.text());
        process.exit(1);
    } else {
        const json = await response.json();
        if (json.mysupersecretkey !== '123123123') {
            console.error("Error response!", json);
            process.exit(1);
        }
    }
}

const exec = async () => {
    const token = await auth()

    console.log("*********************************************");
    console.log("********* Functional testing njs ************");
    console.log("*********************************************");
    await test(8008, token)

    console.log("*********************************************");
    console.log("********* Functional testing node ***********");
    console.log("*********************************************");
    await test(3003, token)

    console.log("*********************************************");
    console.log("****************** DONE! ********************");
    console.log("*********************************************");
}

exec();