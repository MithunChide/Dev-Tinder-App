
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status : {
        type : String,
        enum : {
            values : ["ignored", "interested", "accepted", "rejected"],
            message : "{VALUE} status is not supported"
        }
    }
},
{
    timestamps: true,
})

connectionRequestSchema.pre("save", async function() {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send the request to yourself");
    }
})
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;