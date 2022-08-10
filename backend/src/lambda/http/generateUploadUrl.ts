import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {presignedUrl } from '../../businessLogic/businessLogic'
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const purchaseId = event.pathParameters.purchaseId
    

    const uploadUrl = await presignedUrl(purchaseId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({
        uploadUrl:uploadUrl
      })
  }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )