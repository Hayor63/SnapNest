import PinModel, { Pin } from "../models/pin"


export default class SearchRepo {
// getALlTags
static getAllTags = async () => {
    const tags = await PinModel.find()
    return tags
} 

// delete tags
static deleteTags : (pinId: string) => Promise<any> = async(pinId) => {
    const data = await PinModel.findByIdAndDelete(pinId)
    return data
}

// search db
static searchDb = async () => {
    const tags = await PinModel.find()
    return tags
} 


}
