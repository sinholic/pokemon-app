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
    const [activeTab, setActiveTab] = useState('stats'); // Inisialisasi tab aktif dengan 'stats'

    // Fungsi untuk mengganti tanda hubung (-) dengan spasi pada string
    const formatAttributeName = (attributeName: string) => {
        return attributeName.replace(/-/g, ' ');
    };

    // Fungsi untuk mengubah tab aktif
    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName);
    };
  
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
          <div className="flex items-center justify-center">
            <Image src={pokemonDetail.sprites.front_default} alt={pokemonDetail.name} width={200} height={200} />
          </div>
          <h2 className="text-2xl font-bold text-center capitalize mt-4">{pokemonDetail.name}</h2>
          <div className="mt-6">
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 mx-2 rounded focus:outline-none ${
                    activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabChange('stats')}
                >
                    Stats
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded focus:outline-none ${
                    activeTab === 'moves' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabChange('moves')}
                >
                    Moves
                </button>
            </div>
            <div className="p-4 rounded">
                {activeTab === 'stats' && (
                    <div>
                    <h2 className="text-xl font-bold mb-2">Stats:</h2>
                        <ul>
                            {pokemonDetail.stats.map((stat) => (
                                <li key={stat.stat.name} className="flex justify-between">
                                <span className='capitalize'>{formatAttributeName(stat.stat.name)}</span>
                                <span>{stat.base_stat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeTab === 'moves' && (
                    <div>
                    <h2 className="text-xl font-bold mb-2">Moves:</h2>
                        <ul>
                        {pokemonDetail.moves.map((move) => (
                            <li key={move.move.name} className="capitalize">{formatAttributeName(move.move.name)}</li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="mt-4">
            <button
                onClick={() => router.push('/')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            >
                Back to Home
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PokemonDetailPage;
  