import {generateAccessToken} from '../services/token.js';
import bcrypt from'bcrypt';
import User from'../models/user.js';
import * as db from'../services/database.js';

export const register = (req,res) =>
{
    let users = db.getUsers();
    let username = req.body.username;
    let password = req.body.password;
    for(let u of users)
        if(u.username === username)
            return res.status(409).json({message:"Name is already taken"});

    
    let hashedPassword = bcrypt.hashSync(password,10)

    let user = new User(username,hashedPassword);
    users.push(user);
    db.saveUsers(users);

    db.createUserData(user.username);
    db.createUserPokemons(user.username);

    res.status(201).json
    ({
        message:"Account created"
    });
}

export const login = (req,res) =>
{
    let users = db.getUsers();
    let user;
    let username = req.body.username;
    let password = req.body.password;
    
    for(let u of users)
        if(u.username === username)
            user = u;
    
    if(!user)
        return res.status(401).json({message:"User dont exist"});
    
    if(!bcrypt.compareSync(password,user.password))
        return res.status(401).json({message:"Bad password"});


    let token = generateAccessToken({username:user.username});
    res.status(200).json
    ({
        message:"Loged",
        token:token
    });
}

export const getGameData = (req,res) =>
{
    let username = req.body.username;
    let userData = db.getUserData(username);

    res.status(200).json
    ({
        message:"Retured user game data",
        data:userData
    });
}

export const deleteUser = (req,res) =>
{
    let users = db.getUsers();
    let username = req.body.username;
    let user;

    for(let u of users)
        if(u.username === username)
            user = u;
    
    if(!user)
        return res.status(401).json({message:"User dont exist"});

    
    users = users.filter((u) => u !== user);

    db.removeUserData(user.username);
    db.removeUserPokemons(user.username);

    db.saveUsers(users);

    res.status(201).json
    ({
        message:"Account deleted"
    });
}
