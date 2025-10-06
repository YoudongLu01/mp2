import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '../type/pokemon';
import { fetchAllPokemon } from '../api/api';
import './GalleryView.css';

const GalleryView: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    filterByType();
    // add to aviod warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon, selectedTypes]);

  //fetch all pokemon
  const fetchPokemon = async (): Promise<void> => {
    try {
      const pokemonData = await fetchAllPokemon();
      
      const types = new Set<string>();
      pokemonData.forEach((p: Pokemon) => p.types.forEach((t: string) => types.add(t)));
      setAllTypes(Array.from(types).sort());
      
      setPokemon(pokemonData);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };
  
  //add type filter
  const filterByType = (): void => {
    if (selectedTypes.length === 0) {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter((p: Pokemon) =>
        selectedTypes.some((type: string) => p.types.includes(type))
      );
      setFilteredPokemon(filtered);
    }
  };

  const changeType = (type: string): void => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t: string) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };



  return (
    <div className="container page">
      <div className="controls">
        <h2 className="filter-title">Filter by Type</h2>
        <div className="filters">
          {allTypes.map((type: string) => (
            <button
              key={type}
              onClick={() => changeType(type)}
              className={`filter-btn ${selectedTypes.includes(type) ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="count">
          Showing {filteredPokemon.length} of {pokemon.length} Pokémon
        </div>
      </div>

      <div className="gallery">
        {filteredPokemon.map((p: Pokemon) => (
          <div key={p.id} onClick={() => navigate(`/pokemon/${p.id}`)} className="gallery-card">
            <img src={p.image} alt={p.name} className="gallery-img" />
            <div className="pokemon-id">#{p.id.toString().padStart(3, '0')}</div>
            <h3 className="gallery-name">{p.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;