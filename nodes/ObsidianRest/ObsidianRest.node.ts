import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class ObsidianRest implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Obsidian REST API',
        name: 'obsidianRest',
        icon: 'file:obsidian.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with Obsidian vault via Local REST API',
        defaults: {
            name: 'Obsidian REST',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'obsidianApi',
                required: true,
            },
        ],
        properties: [
            // Resource
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Vault File',
                        value: 'vault',
                        description: 'Manage files in your vault',
                    },
                    {
                        name: 'Active File',
                        value: 'activeFile',
                        description: 'Manage the currently active file in Obsidian',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'Search notes in your vault',
                    },
                    {
                        name: 'Command',
                        value: 'command',
                        description: 'Execute Obsidian commands',
                    },
                    {
                        name: 'Periodic Note',
                        value: 'periodicNote',
                        description: 'Manage daily/weekly/monthly notes',
                    },
                    {
                        name: 'System',
                        value: 'system',
                        description: 'Get system status',
                    },
                ],
                default: 'vault',
            },

            // ==================== VAULT OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['vault'],
                    },
                },
                options: [
                    {
                        name: 'List Files',
                        value: 'listFiles',
                        description: 'List files in a directory',
                        action: 'List files in vault',
                    },
                    {
                        name: 'Read File',
                        value: 'readFile',
                        description: 'Read file content',
                        action: 'Read file from vault',
                    },
                    {
                        name: 'Create/Update File',
                        value: 'createFile',
                        description: 'Create a new file or update existing',
                        action: 'Create or update file',
                    },
                    {
                        name: 'Append to File',
                        value: 'appendFile',
                        description: 'Append content to a file',
                        action: 'Append content to file',
                    },
                    {
                        name: 'Delete File',
                        value: 'deleteFile',
                        description: 'Delete a file',
                        action: 'Delete file from vault',
                    },
                ],
                default: 'listFiles',
            },
            {
                displayName: 'Directory Path',
                name: 'directoryPath',
                type: 'string',
                default: '',
                placeholder: 'folder/subfolder',
                description: 'Path to directory (leave empty for root)',
                displayOptions: {
                    show: {
                        resource: ['vault'],
                        operation: ['listFiles'],
                    },
                },
            },
            {
                displayName: 'File Path',
                name: 'filePath',
                type: 'string',
                default: '',
                placeholder: 'folder/note.md',
                description: 'Path to file relative to vault root',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['vault'],
                        operation: ['readFile', 'createFile', 'appendFile', 'deleteFile'],
                    },
                },
            },
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                typeOptions: {
                    rows: 10,
                },
                default: '',
                description: 'File content (Markdown)',
                displayOptions: {
                    show: {
                        resource: ['vault'],
                        operation: ['createFile', 'appendFile'],
                    },
                },
            },
            {
                displayName: 'Return JSON Metadata',
                name: 'returnJson',
                type: 'boolean',
                default: false,
                description: 'Whether to return parsed JSON with frontmatter and metadata instead of raw markdown',
                displayOptions: {
                    show: {
                        resource: ['vault'],
                        operation: ['readFile'],
                    },
                },
            },

            // ==================== ACTIVE FILE OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['activeFile'],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get content of the active file',
                        action: 'Get active file content',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update the active file',
                        action: 'Update active file',
                    },
                    {
                        name: 'Append',
                        value: 'append',
                        description: 'Append to the active file',
                        action: 'Append to active file',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete the active file',
                        action: 'Delete active file',
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                typeOptions: {
                    rows: 10,
                },
                default: '',
                description: 'Content to update/append',
                displayOptions: {
                    show: {
                        resource: ['activeFile'],
                        operation: ['update', 'append'],
                    },
                },
            },

            // ==================== SEARCH OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['search'],
                    },
                },
                options: [
                    {
                        name: 'Simple Search',
                        value: 'simpleSearch',
                        description: 'Search using simple text query',
                        action: 'Simple search',
                    },
                    {
                        name: 'Dataview Query',
                        value: 'dataviewQuery',
                        description: 'Search using Dataview DQL',
                        action: 'Dataview query',
                    },
                ],
                default: 'simpleSearch',
            },
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                default: '',
                required: true,
                description: 'Search query text',
                displayOptions: {
                    show: {
                        resource: ['search'],
                        operation: ['simpleSearch'],
                    },
                },
            },
            {
                displayName: 'Dataview Query',
                name: 'dataviewQuery',
                type: 'string',
                typeOptions: {
                    rows: 5,
                },
                default: 'TABLE file.name FROM "folder"',
                description: 'Dataview DQL query',
                displayOptions: {
                    show: {
                        resource: ['search'],
                        operation: ['dataviewQuery'],
                    },
                },
            },

            // ==================== COMMAND OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['command'],
                    },
                },
                options: [
                    {
                        name: 'List Commands',
                        value: 'listCommands',
                        description: 'List all available commands',
                        action: 'List commands',
                    },
                    {
                        name: 'Execute Command',
                        value: 'executeCommand',
                        description: 'Execute a specific command',
                        action: 'Execute command',
                    },
                ],
                default: 'listCommands',
            },
            {
                displayName: 'Command ID',
                name: 'commandId',
                type: 'string',
                default: '',
                required: true,
                description: 'ID of the command to execute',
                displayOptions: {
                    show: {
                        resource: ['command'],
                        operation: ['executeCommand'],
                    },
                },
            },

            // ==================== PERIODIC NOTE OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['periodicNote'],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get current periodic note',
                        action: 'Get periodic note',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update periodic note',
                        action: 'Update periodic note',
                    },
                    {
                        name: 'Append',
                        value: 'append',
                        description: 'Append to periodic note',
                        action: 'Append to periodic note',
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Period',
                name: 'period',
                type: 'options',
                options: [
                    { name: 'Daily', value: 'daily' },
                    { name: 'Weekly', value: 'weekly' },
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Quarterly', value: 'quarterly' },
                    { name: 'Yearly', value: 'yearly' },
                ],
                default: 'daily',
                description: 'Type of periodic note',
                displayOptions: {
                    show: {
                        resource: ['periodicNote'],
                    },
                },
            },
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                typeOptions: {
                    rows: 10,
                },
                default: '',
                description: 'Content to update/append',
                displayOptions: {
                    show: {
                        resource: ['periodicNote'],
                        operation: ['update', 'append'],
                    },
                },
            },

            // ==================== SYSTEM OPERATIONS ====================
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['system'],
                    },
                },
                options: [
                    {
                        name: 'Get Status',
                        value: 'getStatus',
                        description: 'Get API server status',
                        action: 'Get system status',
                    },
                ],
                default: 'getStatus',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        const credentials = await this.getCredentials('obsidianApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
        const apiKey = credentials.apiKey as string;
        const ignoreSsl = credentials.ignoreSslIssues as boolean;

        // 构建认证头 - 这是关键！所有请求都需要这个头
        const authHeaders = {
            Authorization: `Bearer ${apiKey}`,
        };

        for (let i = 0; i < items.length; i++) {
            try {
                let responseData: any;

                // ==================== VAULT ====================
                if (resource === 'vault') {
                    if (operation === 'listFiles') {
                        const directoryPath = this.getNodeParameter('directoryPath', i) as string;
                        const path = directoryPath ? `/vault/${directoryPath}/` : '/vault/';

                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}${path}`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }

                    if (operation === 'readFile') {
                        const filePath = this.getNodeParameter('filePath', i) as string;
                        const returnJson = this.getNodeParameter('returnJson', i) as boolean;

                        const headers: any = { ...authHeaders };
                        if (returnJson) {
                            headers['Accept'] = 'application/vnd.olrapi.note+json';
                        }

                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/vault/${filePath}`,
                            headers,
                            skipSslCertificateValidation: ignoreSsl,
                            returnFullResponse: !returnJson,
                        });

                        if (!returnJson && typeof responseData === 'object' && responseData.body) {
                            responseData = { content: responseData.body };
                        }
                    }

                    if (operation === 'createFile') {
                        const filePath = this.getNodeParameter('filePath', i) as string;
                        const content = this.getNodeParameter('content', i) as string;

                        await this.helpers.httpRequest({
                            method: 'PUT',
                            url: `${baseUrl}/vault/${filePath}`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true, path: filePath };
                    }

                    if (operation === 'appendFile') {
                        const filePath = this.getNodeParameter('filePath', i) as string;
                        const content = this.getNodeParameter('content', i) as string;

                        await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/vault/${filePath}`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true, path: filePath };
                    }

                    if (operation === 'deleteFile') {
                        const filePath = this.getNodeParameter('filePath', i) as string;

                        await this.helpers.httpRequest({
                            method: 'DELETE',
                            url: `${baseUrl}/vault/${filePath}`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true, deleted: filePath };
                    }
                }

                // ==================== ACTIVE FILE ====================
                if (resource === 'activeFile') {
                    if (operation === 'get') {
                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/active/`,
                            headers: {
                                ...authHeaders,
                                'Accept': 'application/vnd.olrapi.note+json',
                            },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }

                    if (operation === 'update') {
                        const content = this.getNodeParameter('content', i) as string;
                        await this.helpers.httpRequest({
                            method: 'PUT',
                            url: `${baseUrl}/active/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true };
                    }

                    if (operation === 'append') {
                        const content = this.getNodeParameter('content', i) as string;
                        await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/active/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true };
                    }

                    if (operation === 'delete') {
                        await this.helpers.httpRequest({
                            method: 'DELETE',
                            url: `${baseUrl}/active/`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true };
                    }
                }

                // ==================== SEARCH ====================
                if (resource === 'search') {
                    if (operation === 'simpleSearch') {
                        const query = this.getNodeParameter('query', i) as string;
                        responseData = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/search/simple/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/plain',
                            },
                            body: query,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }

                    if (operation === 'dataviewQuery') {
                        const query = this.getNodeParameter('dataviewQuery', i) as string;
                        responseData = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/search/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'application/vnd.olrapi.dataview.dql+txt',
                            },
                            body: query,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }
                }

                // ==================== COMMAND ====================
                if (resource === 'command') {
                    if (operation === 'listCommands') {
                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/commands/`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }

                    if (operation === 'executeCommand') {
                        const commandId = this.getNodeParameter('commandId', i) as string;
                        await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/commands/${commandId}/`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true, command: commandId };
                    }
                }

                // ==================== PERIODIC NOTE ====================
                if (resource === 'periodicNote') {
                    const period = this.getNodeParameter('period', i) as string;

                    if (operation === 'get') {
                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/periodic/${period}/`,
                            headers: {
                                ...authHeaders,
                                'Accept': 'application/vnd.olrapi.note+json',
                            },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }

                    if (operation === 'update') {
                        const content = this.getNodeParameter('content', i) as string;
                        await this.helpers.httpRequest({
                            method: 'PUT',
                            url: `${baseUrl}/periodic/${period}/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true };
                    }

                    if (operation === 'append') {
                        const content = this.getNodeParameter('content', i) as string;
                        await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}/periodic/${period}/`,
                            headers: {
                                ...authHeaders,
                                'Content-Type': 'text/markdown',
                            },
                            body: content,
                            skipSslCertificateValidation: ignoreSsl,
                        });
                        responseData = { success: true };
                    }
                }

                // ==================== SYSTEM ====================
                if (resource === 'system') {
                    if (operation === 'getStatus') {
                        responseData = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/`,
                            headers: { ...authHeaders },
                            skipSslCertificateValidation: ignoreSsl,
                        });
                    }
                }

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData),
                    { itemData: { item: i } },
                );
                returnData.push(...executionData);

            } catch (error) {
                if (this.continueOnFail()) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    returnData.push({
                        json: {
                            error: errorMessage,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
            }
        }

        return [returnData];
    }
}
