import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '../type/pokemon';
import { fetchAllPokemon } from '../api/api';
import './ListView.css';

const ListView: React.FC = () => {
  //all pokemon
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  //pokemon after filte
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

  //use input
  const [searchQuery, setSearchQuery] = useState<string>('');

  //sort by id or name and sord direction
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    filterAndSort();
    //add this link to aviod warning
    // eslint-disable-next-line
  }, [pokemon, searchQuery, sortBy, sortOrder]);


  //fectch all pokemon we got from api id1 to 151
  const fetchPokemon = async (): Promise<void> => {
    try {
      const pokemonData = await fetchAllPokemon();
      setPokemon(pokemonData);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  //filter and sort pokemon by user input
  const filterAndSort = (): void => {
    let result: Pokemon[] = [...pokemon];

    if (searchQuery) {
      result = result.filter((p: Pokemon) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a: Pokemon, b: Pokemon) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.id - b.id;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    //update state with the filter and sort result
    setFilteredPokemon(result);
  };

  //change acs and desc direction
  const chageSortOrder = (): void => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  return (
    <div className="container page">
      <div className="controls">

        {/* user input */}
        <input type="text" placeholder="Search Pokémon..." value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="search-box"/>
        
        {/* change sort */}
        <div className="sort-controls">
          <select value={sortBy} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'id' | 'name')} 
            className="select">

            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </select>
          
          <button onClick={chageSortOrder} className="button">
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
        
        {/* count how many pokemons show up */}
        <div className="count">
          Showing {filteredPokemon.length} of {pokemon.length} Pokémon
        </div>
      </div>

      <div className="grid">
        {filteredPokemon.map((p: Pokemon) => (
          <div key={p.id} onClick={() => navigate(`/pokemon/${p.id}`)} className="card">
            <img src={p.image} alt={p.name} className="card-img" />
            <div className="card-body">
              <div className="pokemon-id">#{p.id.toString().padStart(3, '0')}</div>
              <h3 className="pokemon-name">{p.name}</h3>
              <div className="types">
                {p.types.map((type: string) => (
                  <span key={type} className="type">{type}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;