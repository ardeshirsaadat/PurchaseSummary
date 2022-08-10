import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreatePurchaseItemRequest } from '../../requests/createPurchaseItemRequest'
import { createPurchaseItem } from '../../businessLogic/businessLogic'

export const handler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newPurchase: CreatePurchaseItemRequest = JSON.parse(event.body)
  
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const newPurchaseItem = await createPurchaseItem(newPurchase,jwtToken)

    
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item:newPurchaseItem
    })
  } 
  }

