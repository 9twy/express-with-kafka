import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers/index';
import {produceMessage} from '../kafka/producer'
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: 400,
        message: 'Please provide email and password',
      });
      return;
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      res.status(400).json({
        status: 400,
        message: 'The user does not exist',
      });
      return;
    }

    const expectedHash = authentication(user.authentication.salt, password);

    
    
    if (user.authentication.password !== expectedHash) {
      res.status(401).json({
        status: 401,
        message: 'Invalid credentials',
      });
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();

    res.cookie('saeed-auth', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
    await produceMessage('user-topic', { event: 'USER-LOGGEDIN', user });
    res.status(200).json({
      status: 201,
      success: true,
      message: 'User logged in successfully',
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({
        status: 400,
        message: 'Please provide email, password, and username',
      });
      return;
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        status: 400,
        message: 'Username already in use',
      });
      return;
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    await produceMessage('user-topic', { event: 'USER-REGISTER', user });
    res.status(200).json({
      status: 201,
      success: true,
      message: 'User created successfully',
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};
