import { purchaseAccess } from '../dataLayer/databaseLayer'
import { attachmentUtils } from '../dataLayer/storageLayer';
import { purchaseItem } from '../models/purchaseItemCreate'
import { CreatePurchaseItemRequest } from '../requests/createPurchaseItemRequest'

import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils';
import { purchaseSummary } from '../models/purchaseSummary';

//Implement businessLogic

const purchaseAccessInstant = new purchaseAccess()
export const s3Access = new attachmentUtils()

export async function getAllPurchaseItems(userId:string): Promise<purchaseSummary> {

    const purchaseItems=await purchaseAccessInstant.getAllPurchases(userId)
    let total = 0
    for (let item of purchaseItems){
      total += item.price
    }
    const purchaseSummary={
      userId:userId,
      itemsPurchases:purchaseItems,
      total :total

    }
    return purchaseSummary
}

export async function createPurchaseItem(
  createpurchaserequest: CreatePurchaseItemRequest,
  jwtToken: string
): Promise<purchaseItem> {

  const purchaseId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await purchaseAccessInstant.createPurchaseItem({
    userId: userId,
    purchaseId: purchaseId,
    datePurchased: new Date().toISOString(),
    userName: createpurchaserequest.userName,
    nameOfItem: createpurchaserequest.nameOfItem,
    price: createpurchaserequest.price,
    modeOfPurchase:createpurchaserequest.modeOfPurchase,
    attachmentUrl: await s3Access.generateUrl(purchaseId)
  }) as purchaseItem
}



export async function deletePurchase(
    userId:string,
    purchaseId:string,
    ){
        return await purchaseAccessInstant.deletePurchase(purchaseId,userId)  
    }

export async function presignedUrl(purchaseId){
  return await s3Access.signedUrl(purchaseId)
} 
