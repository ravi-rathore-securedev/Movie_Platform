
//asynhandler to handle request and response to efficieny


const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))
    }
}


export {asyncHandler}

//another way to request
// const asyncHandler = (fn) = async (req,res,next) => {
//     try {
//        await fn(req,res,next) 
//     } catch (error) {
//         res.status(error.code || 500).json(
//             {
//                 success:false,
//                 message:error.message
//             }
//         )
        
//     }
// }
