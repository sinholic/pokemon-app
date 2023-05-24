import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface PokemonDetail {
    name: string;
    sprites: {
      front_default: string;
    };
    types: {
      type: {
        name: string;
      };
    }[];
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    moves: {
      move: {
        name: string;
      };
    }[];
  }
  
  const PokemonDetailPage: React.FC = () => {
    const router = useRouter();
    const { pokemonName } = router.query;
  
    const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);
  
    useEffect(() => {
      const fetchPokemonDetail = async () => {
        try {
          const response = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
          setPokemonDetail(response.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      if (pokemonName) {
        fetchPokemonDetail();
      }
    }, [pokemonName]);
  
    if (!pokemonDetail) {
      return null;
    }
  
    const backgroundColor = pokemonDetail.types[0]?.type.name; // Use the first type's name as the background color
  
    return (
      <div className={`bg-${backgroundColor}-200 min-h-screen py-8 px-4 sm:px-8 lg:px-16 xl:px-20`}>
        <div className="max-w-4xl mx-auto bg-gray-500 rounded-md shadow-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className='text-white-100 hover:text-white-100 underline'>
              &larr; Back to Pokemon List
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Image src={pokemonDetail.sprites.front_default} alt={pokemonDetail.name} width={200} height={200} />
          </div>
          <h2 className="text-2xl font-bold text-center capitalize mt-4">{pokemonDetail.name}</h2>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Stats:</h3>
            <ul>
              {pokemonDetail.stats.map((stat) => (
                <li key={stat.stat.name} className="flex justify-between">
                  <span className='capitalize'>{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Moves:</h3>
            <ul>
              {pokemonDetail.moves.map((move) => (
                <li key={move.move.name} className="capitalize">{move.move.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  export default PokemonDetailPage;
  