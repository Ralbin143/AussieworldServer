const Carrier = require("../models/Carrier");
const asyncHandler = require("express-async-handler");

//------------create Carrier guidance------------

const createCarrier = asyncHandler(async (req,res)=>{
    const carrierData ={
        guidanceName:req.body.guidanceName,
        title:req.body.title,
        images:req.body. images,
        subtitle:req.body.subtitle,
        download:req.body.download,
    }
    try {
        const newCarrier = await Carrier.create(carrierData);
        return res.status(200).json(newCarrier)
    } catch (error) {
        return res.status(200).json(error)
    }
})

//-----------------view all Guiance for Admin--------------

const viewallCarrier = asyncHandler(async(req,res)=>{
    try {
        const carriers = await Carrier.find()
        return  res.status(200).json(carriers)
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})  
     }
})

//-----------------view Guidance for User--------------


const viewsingleCarrier = asyncHandler(async(req,res)=>{
    const  guidanceName= {guidanceName:req.body.name}
    try {
        const carrier = await Carrier.findOne(guidanceName)
        return  res.status(200).json(carrier)
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})  
     }
})

//-----------------Asign Guidance to User By Admin----------------


const assignCarrier = asyncHandler(async(req,res)=>{
    const userId = {userId:req.body.id}
    const guidance = {guidance:req.body.carrier}

    try {
        const assignedGuidance = await Carrier.findOneAndUpdate(userId,guidance)
        return res.status(200).json(assignedGuidance)
        
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})   
    }

})


module.exports = {
    createCarrier,
    viewallCarrier,
    viewsingleCarrier,
    assignCarrier
}


