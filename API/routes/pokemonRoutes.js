import express from 'express';
import * as pokemonController from '../controllers/pokemonController.js';
import {authenticateToken} from '../services/token.js';
const router = express.Router();

router.get("/data/:secretId",authenticateToken, pokemonController.getUserPokemon);
router.get("/img/:secretId",authenticateToken, pokemonController.getPokemonImg);
router.put("/:secretId",authenticateToken, pokemonController.updatePokemon);
router.post("/wild/fight",authenticateToken, pokemonController.fightPokemons);
router.get("/wild/name/:secretId",authenticateToken, pokemonController.getWildPokemonName);
router.get("/wild/img/:secretId",authenticateToken, pokemonController.getWildPokemonImg);

export default router;