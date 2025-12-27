import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ObsidianApi implements ICredentialType {
    name = 'obsidianApi';
    displayName = 'Obsidian Local REST API';
    documentationUrl = 'https://coddingtonbear.github.io/obsidian-local-rest-api/';

    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://127.0.0.1:27124',
            placeholder: 'https://obsidian.example.com',
            description: 'The base URL of your Obsidian Local REST API. Can be localhost or a tunneled URL.',
            required: true,
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Your Obsidian Local REST API key. Find it in Obsidian Settings → Local REST API.',
            required: true,
        },
        {
            displayName: 'Ignore SSL Issues',
            name: 'ignoreSslIssues',
            type: 'boolean',
            default: true,
            description: 'Whether to ignore SSL certificate issues (useful for self-signed certificates)',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/',
            skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
            headers: {
                Authorization: '={{"Bearer " + $credentials.apiKey}}',
            },
        },
    };
}
