import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pokemon } from '../type/pokemon';
import { fetchPokemonById, fetchPokemonIds } from '../api/api';
import './DetailView.css';

const DetailView: React.FC = () => {
  //pokemon id 
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  //all pokemon id in an array
  const [allPokemonIds, setAllPokemonIds] = useState<number[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllIds();
  }, []);

  useEffect(() => {
    if (id) {
      fetchPokemonDetail(parseInt(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  //fetch list of pokemon id
  const fetchAllIds = async (): Promise<void> => {
    try {
      const ids = await fetchPokemonIds();
      setAllPokemonIds(ids);
    } catch (error) {
      console.error('Error fetching Pokémon IDs:', error);
    }
  };


  //get pokemon detail like physical and abilities
  const fetchPokemonDetail = async (pokemonId: number): Promise<void> => {
    try {
      const pokemonData = await fetchPokemonById(pokemonId);
      setPokemon(pokemonData);
    } catch (error) {
      console.error('Error fetching Pokémon detail:', error);
    }
  };

  //go previous
  const handlePrevious = (): void => {
    if (!id) return;
    const currentIndex = allPokemonIds.indexOf(parseInt(id));
    if (currentIndex > 0) {
      navigate(`/pokemon/${allPokemonIds[currentIndex - 1]}`);
    }
  };

  //go next
  const handleNext = (): void => {
    if (!id) return;
    const currentIndex = allPokemonIds.indexOf(parseInt(id));
    if (currentIndex < allPokemonIds.length - 1) {
      navigate(`/pokemon/${allPokemonIds[currentIndex + 1]}`);
    }
  };

  if (!pokemon) {
    return <div className="loading">Pokemon not ready yet</div>;
  }

  const currentIndex = allPokemonIds.indexOf(pokemon.id);

  return (
    <div className="container page">
      <div className="detail-card">
        <div className="detail-nav">
          <button 
            onClick={handlePrevious} 
            disabled={currentIndex === 0} 
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <div className="detail-id">#{pokemon.id.toString().padStart(3, '0')}</div>
          
          <button 
            onClick={handleNext} 
            disabled={currentIndex === allPokemonIds.length - 1} 
            className="nav-btn"
          >
            Next →
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-left">
            <img src={pokemon.image} alt={pokemon.name} className="detail-img" />
            <h1 className="detail-name">{pokemon.name}</h1>
            <div className="types">
              {pokemon.types.map((type: string) => (
                <span key={type} className="type-large">{type}</span>
              ))}
            </div>
          </div>

          <div className="detail-right">
            <h2>Physical Attributes</h2>
            <div className="attributes">
              <div className="attr-row">
                <span>Height:</span>
                <span>{(pokemon.height / 10).toFixed(1)} m</span>
              </div>
              <div className="attr-row">
                <span>Weight:</span>
                <span>{(pokemon.weight / 10).toFixed(1)} kg</span>
              </div>
            </div>

            <h2>Abilities</h2>
            <div className="abilities">
              {pokemon.abilities.map((ability: string, index: number) => (
                <span key={index} className="ability-badge">{ability.replace('-', ' ')}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;