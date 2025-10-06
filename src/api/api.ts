import axios from 'axios';
import { Pokemon } from '../type/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';



//all pokemon
export const fetchAllPokemon = async (): Promise<Pokemon[]> => {
  //use try and catch to catch the error
  try {
    //GEN1 has 151 pokemon
    const response = await axios.get(`${BASE_URL}/pokemon?limit=151`);
    const pokemonData: Pokemon[] = await Promise.all(
      response.data.results.map(async (p: any, index: number): Promise<Pokemon> => {
        const details = await axios.get(p.url);
        return {
          /**
           * id start with 1 in api but index start with 0,so +1 here
           * use front_default image for LiseView and GalleryView in the specific page. use official image
           * extra type and abiliies name
           */

          id: index + 1,
          name: p.name,
          image: details.data.sprites.front_default,
          types: details.data.types.map((t: any) => t.type.name),
          height: details.data.height,
          weight: details.data.weight,
          abilities: details.data.abilities.map((a: any) => a.ability.name)
        };
      })
    );
    
    return pokemonData;
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    throw error;
  }
};

//single pokemon in detail view page
export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  try {

    //fix the bug, cant use url to find gen2 pokemon
    if (id < 1 || id > 151) {
      throw new Error(`Pokemon ID must be between 1 and 151. Received: ${id}`);
    }

    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    
    return {
      id: response.data.id,
      name: response.data.name,
      image: response.data.sprites.other['official-artwork'].front_default || 
             response.data.sprites.front_default,
      types: response.data.types.map((t: any) => t.type.name),
      height: response.data.height,
      weight: response.data.weight,
      abilities: response.data.abilities.map((a: any) => a.ability.name)
    };
  } catch (error) {
    console.error(`Error fetching Pokemon #${id}:`, error);
    throw error;
  }
};

//use it in detail view for next and previous pokemon
export const fetchPokemonIds = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=151`);
    return response.data.results.map((_: any, index: number) => index + 1);
  } catch (error) {
    console.error('Error fetching Pokemon IDs:', error);
    throw error;
  }
};