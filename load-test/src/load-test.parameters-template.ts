export const RegistrantTestParameters: RegistrantTestParameters = {
    baseUrl: '',
    authEndpoint: '',
    basicAuth: '',
    usernameBase: '',
    passwordBase: '',
    grantType: '',
    scope: ''
};

interface RegistrantTestParameters {
    baseUrl: string;
    authEndpoint: string;
    basicAuth: string;
    usernameBase: string;
    passwordBase: string;
    grantType: string;
    scope: string;
}

export const ResponderTestParameters: ResponderTestParameters = {
    baseUrl: '',
    taskId: '',
    authEndpoint: '',
    basicAuth: '',
    grantType: '',
    username: '',
    password: '',
    scope: '',
};

interface ResponderTestParameters {
    baseUrl: string;
    taskId: string;
    authEndpoint: string;
    basicAuth: string;
    grantType: string;
    username: string;
    password: string;
    scope: string;
}

export const MAX_VU = 1;
export const MAX_ITER = 1;