import joi from "joi";
export const validation=(Schema)=>{
    return (req,res,next)=>{
        const inputs=req.body;
        const validationResults=Schema.validate(inputs,{abortEarly: false});

        if(validationResults.error){
            return res.status(400).send({error:validationResults.error,details:validationResults.error.details});
        }
        return next()
    }
}