import {
    ICredentialType,
    INodeProperties,
    Icon,
} from 'n8n-workflow';

export class AliyunTranslateApi implements ICredentialType {
    name = 'aliyunTranslateApi';
    displayName = 'Aliyun Translate API';
    documentationUrl = 'https://help.aliyun.com/zh/machine-translation';
    icon: Icon = { light: 'file:../icons/aliyun.svg', dark: 'file:../icons/aliyun.svg' };
    properties: INodeProperties[] = [
        {
            displayName: 'Access Key ID',
            name: 'accessKeyId',
            type: 'string',
            default: '',
            required: true,
            description: 'Your Aliyun Access Key ID',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Access Key Secret',
            name: 'accessKeySecret',
            type: 'string',
            default: '',
            required: true,
            description: 'Your Aliyun Access Key Secret',
            typeOptions: {
                password: true,
            },
        },
        {
            displayName: 'Region Endpoint',
            name: 'endpoint',
            type: 'options',
            default: 'mt.cn-hangzhou.aliyuncs.com',
            description: 'The region endpoint for Aliyun Translate API',
            options: [
                {
                    name: 'China (Shanghai)',
                    value: 'mt.cn-shanghai.aliyuncs.com',
                },
                {
                    name: 'China (Hangzhou)',
                    value: 'mt.cn-hangzhou.aliyuncs.com',
                },
                {
                    name: 'China (Beijing)',
                    value: 'mt.cn-beijing.aliyuncs.com',
                },
                {
                    name: 'China (Shenzhen)',
                    value: 'mt.cn-shenzhen.aliyuncs.com',
                },
                {
                    name: 'Singapore',
                    value: 'mt.ap-southeast-1.aliyuncs.com',
                },
            ],
        },
    ];
}