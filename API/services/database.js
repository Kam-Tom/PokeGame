import fs from 'fs';

import UserData from '../models/userData.js';
import User from '../models/user.js';

import UserPokemon from '../models/userPokemon.js';
import Pokemon from'../models/pokemon.js';

const usersFile = "./data/users.csv";
const usersGameFolder = "./data/game/";
const userGameDataExtension = "Data.csv";
const userPokemonDataExtension = "Pokemons.csv";

const pokemonsDBFile = "./data/pokemonList.csv";

export const getUsers = () =>
{
    let users = [];
    
    let file = fs.readFileSync(usersFile, 'utf8');
    let lines = file.split(/\r?\n/);
    for(let line of lines) 
    {
        let data = line.split(';');
        if(data.length === 0) continue;
        users.push
        (
            new User(data[0],data[1])
        )
      
    };

    return users;
}

export const saveUsers = (users) =>
{
    let data = [];
    for(let user of users)
    {
        let line = `${user.username};${user.password}`;
        data.push(line);
    };
    data = data.join('\n');

    fs.writeFileSync(usersFile, data, 'utf8');
}

export const getUserData = (username) => 
{

    let file = fs.readFileSync(usersGameFolder+username+userGameDataExtension, 'utf8');
    let lines = file.split(/\r?\n/);
    
    return new UserData
    (
        parseInt(lines[0]),
        JSON.parse(lines[1]),
        JSON.parse(lines[2]),
        JSON.parse(lines[3]),
        JSON.parse(lines[4]),
        JSON.parse(lines[5]),
        JSON.parse(lines[6]),
        JSON.parse(lines[7]),
        JSON.parse(lines[8]),
        JSON.parse(lines[9])
    )
}

export const createUserData = (username) =>
{

    const fileName = usersGameFolder + username + userGameDataExtension;
    let data = [];
    let regionsCount = 10;

    data.push('0'); //VS Score
    for(let i=0;i<regionsCount;i++)
    {
        data.push('[0,0,0]'); //Region Score
    }

    data = data.join('\n');

    fs.writeFileSync(fileName, data, 'utf8');
}

export const createUserPokemons = (username) =>
{
    const fileName = usersGameFolder + username + userPokemonDataExtension;
    let data = "";
    fs.writeFileSync(fileName, data, 'utf8');
}

export const removeUserPokemons = (username) =>
{
    const fileName = usersGameFolder + username + userPokemonDataExtension;
    fs.unlinkSync(fileName);
}

export const removeUserData = (username) =>
{
    const fileName = usersGameFolder + username + userGameDataExtension;
    fs.unlinkSync(fileName);
}

export const getUserPokemons = (username) => 
{
    let pokemons = [];
    const fileName = usersGameFolder+username+userPokemonDataExtension;
    let file = fs.readFileSync(fileName, 'utf8');
    let lines = file.split(/\r?\n/);

    for(let line of lines)
    {
        let data = line.split(';');
        if(data.length === 0) continue;
        pokemons.push
        (
            new UserPokemon
            (
                data[0],
                data[1],
                data[2],
                data[3],
                data[4],
                data[5],
            )
        );
    };

    return pokemons;
}

export const saveUserData = (username,userData) => 
{
    const fileName = usersGameFolder + username + userGameDataExtension;
    let data = [];

    data.push(userData.vsScore);
    data.push(`[${userData.gen1Score}]`);
    data.push(`[${userData.gen2Score}]`);
    data.push(`[${userData.gen3Score}]`);
    data.push(`[${userData.gen4Score}]`);
    data.push(`[${userData.gen5Score}]`);
    data.push(`[${userData.gen6Score}]`);
    data.push(`[${userData.gen7Score}]`);
    data.push(`[${userData.gen8Score}]`);
    data.push(`[${userData.gen9Score}]`);
    data = data.join('\n');

    fs.writeFileSync(fileName, data, 'utf8');
}


export const saveUserPokemons = (username,pokemons) => 
{
    const fileName = usersGameFolder+username+userPokemonDataExtension;

    let data = [];
    for(let pokemon of pokemons)
    {
        let line = `${pokemon.secretId};${pokemon.id};${pokemon.name};${pokemon.generation};${pokemon.mainType};${pokemon.secondType}`;
        data.push(line);
    };
    data = data.join('\n');

    fs.writeFileSync(fileName, data, 'utf8');
}

export const getPokemons = () =>
{
    let pokemons = [];

    let file = fs.readFileSync(pokemonsDBFile, 'utf8');
    let lines = file.split(/\r?\n/);

    for(let line of lines)
    {
        let data = line.split(';');
        pokemons.push(new Pokemon
        (
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5],
            data[6]

        ));
    }

    return pokemons;
}
