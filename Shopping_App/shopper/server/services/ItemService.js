const ItemModel = require("../models/mongoose/Item"); // bring the item model created in the Item file that is in the models folder

class itemService{
    static async getAll(){
        return ItemModel.find({}).sort({createdAt: -1}).exec(); // retrun item model by created At from the sorted values in descending order, exec is for the mongoose to return the real promise 
    }

    static async getOne(itemId){
        return  ItemModel.findById(itemId).exec();
    }

    static async create(data){
        const item = new ItemModel(data);
        return item.save();
    }

    static async update(itemId, data){
        return ItemModel.findByIdAndUpdate(itemId, data).exec();
    }

    static async remove(itemId){
        return ItemModel.deleteOne({ _id: itemId}).exec();
    }
}

module.exports =itemService;