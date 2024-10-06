import express from "express";
import {get,identity,merge, reduce} from 'lodash';
import { getUserBySessionToken } from "../db/users";
export const isOwner=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const {id}=req.params;
        const session=req.cookies['saeed-auth'];
        const currentUserId=(await getUserBySessionToken(session))._id.toString();
        
        
        
        
        if (!currentUserId){
            res.status(400).json({
                status:400,
                message:"please provide the id",
            })
            return ;

        }
        if (currentUserId.toString()!== id){
            res.status(400).json({
                status:400,
                message:"not allowed",
            })
            return ;
        }
        next();

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            status: 400,
            message: 'something went wrong',
          });
          
    }
}
export const isAuthenticated=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const sessionToken=req.cookies['saeed-auth'];
        if (!sessionToken){
            res.status(400).json({
                status: 400,
                message: 'The user does not exist',
              });
              return;
        }
        const existingUser=await getUserBySessionToken(sessionToken);
        if(!existingUser){
            res.status(400).json({
                status: 400,
                message: 'you don\'t have access',
              });
              return;
        }
        merge(req,{identity,existingUser});
        return next();
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
          });
        
    }
}