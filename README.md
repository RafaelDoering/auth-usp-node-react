# USP Authetication project with Node and React

In the project root directory, you need to create a .env file with the format:

```
MONGO_DOCKER_URL=0.0.0.0
MONGO_DOCKER_DB=auth-usp

JWT_PRIVATE_KEY=wqe<#)weqwbrE6SB7

OAUTH_REQUEST_TOKEN_URL= https://uspdigital.usp.br/wsusuario/oauth/request_token
OAUTH_ACCESS_TOKEN_URL= https://uspdigital.usp.br/wsusuario/oauth/access_token
OAUTH_USER_AUTHORIZATION_URL= https://uspdigital.usp.br/wsusuario/oauth/authorize
OAUTH_USER_RESOURCE_URL= https://uspdigital.usp.br/wsusuario/oauth/usuariousp
OAUTH_CONSUMER_KEY=icmc_auth_usp
OAUTH_CONSUMER_SECRET=wqeDhsduiashduiashduiashdioqwhieuhqw

FRONTEND_URL=http://localhost:8080

SESSION_KEY=ultrastrongkey
```

This file is not versioned on git because is your keys.

Next you can run mongo datebase on docker with:

### `docker-compose up -d`
