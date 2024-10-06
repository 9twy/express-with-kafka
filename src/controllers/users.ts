import express from 'express';
import {deleteUserById, getUserById, getUserBySessionToken, getUsers} from '../db/users';
import { produceMessage } from '../kafka/producer';
export const getAllUsers=async (req:express.Request,res:express.Response)=>{
    
    try{
        const users=await getUsers();
        await produceMessage('user-topic', { event: 'GET-USERS', users });
        res.status(200).json({
            status: 400,
            message: 'The users',
            users:users
          });
          return;

        
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            status: 400,
            message: 'The user does not exist',
          });
          
        
    }
}
export const deleteUsers=async(req:express.Request,res:express.Response)=>{
    try{
        const {id}=req.params;
        const deletedUsers=await deleteUserById(id);
        await produceMessage('user-topic', { event: 'USER-DELETED', deleteUsers });
        res.status(200).json({
            status: 200,
            message: 'deleted users',
            users:deletedUsers
          });
          return;

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            status: 400,
            message: 'something went wrong',
          });
          
    }
}
export const updateUser=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const {id}=req.params;
        const {username}=req.body;
        if (!username){
            res.status(400).json({
                status:400,
                message:"something went wrong!"
            })
        }
        const user=await getUserById(id);
        user.username=username
        await user.save()
        await produceMessage('user-topic', { event: 'USER_UPDATED', user });
        res.status(200).json({
            status:200,
            message:"updated successfully"
        })

    }
    catch(error){
        console.log(error);
        res.status(400).json(
            
            {
                status:400,
                message:"something went wrong!"
            }
        )
        
    }
}