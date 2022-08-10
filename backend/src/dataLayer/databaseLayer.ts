import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { purchaseItem } from '../models/purchaseItemCreate'
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('purchase summary')

// Implement the dataLayer logic

export class purchaseAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly purchaseTable = process.env.PURCHASE_TABLE) {
    }
  
    async getAllPurchases(userId:string): Promise<purchaseItem[]> {
        logger.info('GETTING ALL PURCHASES');

      const result = await this.docClient.query({
        TableName: this.purchaseTable,
        KeyConditionExpression: '#userId =:i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      }).promise();
  
      const items = result.Items
      return items as purchaseItem[]
    }
  
    async createPurchaseItem(purchaseItem: purchaseItem): Promise<purchaseItem> {
      logger.info('CREATING A PURCHASE');
      await this.docClient.put({
        TableName: this.purchaseTable,
        Item: {...purchaseItem}
      }).promise()
  
      return purchaseItem as purchaseItem
    }

    async deletePurchase(purchaseId: string, userId: string) {
        logger.info('DELETING A purchase');
    
        await this.docClient.delete({
          TableName: this.purchaseTable,
          Key: {
            userId: userId,
            purchaseId: purchaseId
          }
        }).promise();
      }
    }




  
  
  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  