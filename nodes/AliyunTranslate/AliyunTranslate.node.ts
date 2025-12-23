import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';


import alimt20181012, * as $alimt20181012 from '@alicloud/alimt20181012';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

export class AliyunTranslate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Aliyun Translate',
    name: 'aliyunTranslate',
    icon: { light: 'file:../../icons/aliyun.svg', dark: 'file:../../icons/aliyun.svg' },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["sourceLanguage"] + " → " + $parameter["targetLanguage"]}}',
    description: 'Translate text using Aliyun Machine Translation API',
    defaults: { name: 'Aliyun Translate' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'aliyunTranslateApi', required: true }],
    properties: [
      {
        displayName: 'Text to Translate',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Enter text to translate',
        description: 'The text that needs to be translated',
      },
      {
        displayName: 'Source Language',
        name: 'sourceLanguage',
        type: 'options',
        required: true,
        default: 'auto',
        description: 'The language code of the source text',
        options: [
          { name: 'Auto Detect', value: 'auto' },
          { name: 'Chinese (Simplified)', value: 'zh' },
          { name: 'English', value: 'en' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Korean', value: 'ko' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Spanish', value: 'es' },
          { name: 'Russian', value: 'ru' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Italian', value: 'it' },
          { name: 'Arabic', value: 'ar' },
          { name: 'Thai', value: 'th' },
          { name: 'Vietnamese', value: 'vi' },
          { name: 'Indonesian', value: 'id' },
          { name: 'Malay', value: 'ms' },
        ],
      },
      {
        displayName: 'Target Language',
        name: 'targetLanguage',
        type: 'options',
        required: true,
        default: 'en',
        description: 'The language code for the translation result',
        options: [
          { name: 'Chinese (Simplified)', value: 'zh' },
          { name: 'English', value: 'en' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Korean', value: 'ko' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Spanish', value: 'es' },
          { name: 'Russian', value: 'ru' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Italian', value: 'it' },
          { name: 'Arabic', value: 'ar' },
          { name: 'Thai', value: 'th' },
          { name: 'Vietnamese', value: 'vi' },
          { name: 'Indonesian', value: 'id' },
          { name: 'Malay', value: 'ms' },
        ],
      },
      {
        displayName: 'Format Type',
        name: 'formatType',
        type: 'options',
        required: true,
        default: 'text',
        description: 'The format of the text to be translated',
        options: [
          { name: 'Plain Text', value: 'text' },
          { name: 'HTML', value: 'html' },
        ],
      },
      {
        displayName: 'Scene',
        name: 'scene',
        type: 'options',
        required: true,
        default: 'general',
        description: 'The translation scene',
        options: [
          { name: 'General', value: 'general' },
          { name: 'Title', value: 'title' },
          { name: 'E-commerce', value: 'ecommerce' },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('aliyunTranslateApi');

    const config = new $OpenApi.Config({
      accessKeyId: credentials.accessKeyId as string,
      accessKeySecret: credentials.accessKeySecret as string,
    });
    config.endpoint = (credentials.endpoint as string) || 'mt.cn-shanghai.aliyuncs.com';

    const client = new alimt20181012(config);

    for (let i = 0; i < items.length; i++) {
      try {
        const text = this.getNodeParameter('text', i) as string;
        const sourceLanguage = this.getNodeParameter('sourceLanguage', i) as string;
        const targetLanguage = this.getNodeParameter('targetLanguage', i) as string;
        const formatType = this.getNodeParameter('formatType', i) as string;
        const scene = this.getNodeParameter('scene', i) as string;

        if (!text) {
          throw new NodeOperationError(this.getNode(), 'Text to translate is required', { itemIndex: i });
        }
        if (sourceLanguage === targetLanguage) {
          throw new NodeOperationError(this.getNode(), 'Source and target languages cannot be the same', { itemIndex: i });
        }

        const translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest({
          formatType: formatType,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          sourceText: text,
          scene: scene,
        });

        const runtime = new $Util.RuntimeOptions();

        const resp = await client.translateGeneralWithOptions(translateGeneralRequest, runtime);

        if (resp.statusCode === 200 && resp.body?.data?.translated) {
          returnData.push({
            json: {
              originalText: text,
              translatedText: resp.body.data.translated,
              sourceLanguage,
              targetLanguage,
              success: true,
            },
          });
        } else {
          throw new NodeOperationError(
            this.getNode(),
            `Translation failed: ${resp.body?.message || 'Unknown error'}`
          );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message, success: false } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}