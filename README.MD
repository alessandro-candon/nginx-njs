# Auth SPA for secrets

Try to allow download "secrets" like x-api-keys for SPA only for auth users.

## DISCLAIMER : NOT USE THIS TO STORE CRITICAL SECRETS LIKE PASSWORDS, KEYS, ETC.
XApiKeys in SPA are used only to identify the application that is using the backend. 
BackEnd or APIGateway should validate the key and jwt, allowing or deny the request.


## What is this test consists of?

The Proof of Concept (POC) consists of setting up a test environment using NGINX and Node.js as web servers to serve a 
Single Page Application (SPA). 
The POC aims to validate the configuration and functionality for securely serving the SPA and providing access to certain
sensitive information ("secrets") that the SPA requires for its operation, such as an x-api-key.

The POC involve NGINX with the ngx_http_js_module.so module and a Node.js service to validate fetching 
user information using JWT authentication and serving "secrets" securely.

### NGINX Configuration with ngx_http_js_module.so
NGINX will use the ngx_http_js_module.so module to execute JavaScript for handling requests.
When a request is made to fetch "secrets," the module will verify the JWT (JSON Web Token) to authenticate the user calling user profile API.
If the JWT validation is successful, NGINX will retrieve and return the requested secrets to the SPA.
If the authentication fails, NGINX will respond with an appropriate error (e.g., 401 Unauthorized).

### Native Node.js Backend
The Node.js service will handle similar functionality natively by verifying JWTs in incoming requests.
It will provide an API route that serves the "secrets" when authentication is successful.
This route will allow for a direct comparison of handling JWT verification and secrets retrieval in both NGINX and Node.js environments.


For this POC, testing the performance under high load while using a reduced amount of CPU and RAM will be a key focus. 
The goal is to evaluate how well NGINX with the ngx_http_js_module.so and Node.js perform under constrained system 
resources when serving the SPA and handling JWT authentication to fetch "secrets."


Using [Locust](https://locust.io/) for the stress testing in this POC will allow for effective simulation of high load conditions 
to evaluate the performance of NGINX and Node.js under limited CPU and RAM.


## Result:

### Functional test

Setup environment:
```shell
docker-compose up
```

Run js test:
```shell
node test/test.js
```

If

    *********************************************
    ****************** DONE! ********************
    *********************************************

is printed, the test is successful.

Shutdown environment:
```shell
docker-compose down
```

# Performance test

Where the test is executed:
* GCP hosting
* Machine type: e2-medium - 2vCPU - 4GB Ram
* Architecture: x86/64


We create 4 environments:
* NJS-open (NGINX with ngx_http_js_module.so) with hegh resource limits
* Node-open (Node.js) without resource limits
* NJS-slim (NGINX with ngx_http_js_module.so) with 0,25 CPU and 50MB RAM
* Node-slim (Node.js) with 0,25 CPU and 50MB RAM

Docker used to running all systems:
* fake-oauth: Fake OAuth2 server to generate valid JWT
* nginx: stock NGINX image only to serve 200 status on high load

We test with this locust configuration:
* Low load
  * Number of users: 10
  * Ramp-up: 2 users starting every seconds 
* High load
  * Number of users: 1000
  * Ramp-up: 15 users starting every seconds

!! Docker resetted every test to avoid caching and other side effects. !!


Setup environment:
```shell
docker-compose -f docker-compose-stress.yaml up
```

[Install locust](https://docs.locust.io/en/stable/installation.html) if not installed.


Run locust:
```shell
locust -f stresstest/locustfile.py
```


