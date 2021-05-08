const mongoose =require('mongoose');

const ItemSchema = mongoose.Schema({
    sku:{ type: Number, required:true, index:{unique:true}}, // types of the values of the properties
    name:{type:String, required:true},
    price:{type:Number, required:true},
},{
    timestamps:true, // this will help mongoose make two optional fields automatically, one field contains the timestamp when the document was created and the other will contain the timestamp when the document was last updated
});

module.exports= mongoose.model('Item', ItemSchema);