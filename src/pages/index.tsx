import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Pokemon {
  name: string;
  url: string;
}

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
}

const PokemonList: React.FC<{ pokemons: Pokemon[] }> = ({ pokemons }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pokemon List</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.name} className="bg-gray-500 p-4 rounded-md">
            <PokemonItem pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  );
};


const PokemonItem: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get<PokemonDetail>(pokemon.url);
        setPokemonDetail(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemonDetail();
  }, [pokemon.url]);

  if (!pokemonDetail) {
    return null;
  }

  const backgroundColor = pokemonDetail.types[0]?.type.name; // Use the first type's name as the background color

  return (
    <div className={`bg-${backgroundColor}-200 p-4 rounded-md`}>
      <Link href={`/pokemon/${pokemon.name}`}>
          <h3 className="text-lg capitalize text-center font-semibold mb-2">{pokemonDetail.name}</h3>
          <Image src={pokemonDetail.sprites.front_default} alt={pokemonDetail.name} width={200} height={200} />
          <p className="mt-2">Type: {pokemonDetail.types.map((type) => type.type.name).join(', ')}</p>
      </Link>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (url?: string) => {
    try {
      const apiUrl = url || 'https://pokeapi.co/api/v2/pokemon';
      const response = await axios.get(apiUrl);
      const data = response.data.results;
      const nextUrl = response.data.next;
      const prevUrl = response.data.previous;
      setPokemons((prevPokemons) => [...data]);
      setNextPageUrl(nextUrl);
      setPrevPageUrl(prevUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreviousPage = () => {
    if (prevPageUrl) {
      fetchData(prevPageUrl);
    }
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchData(nextPageUrl);
    }
  };

  return (
    <div className="container mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-center my-8">Welcome to the Pokemon App</h1>
      </header>
      <main>
        <PokemonList pokemons={pokemons} />
        <div className="flex justify-between">
          {prevPageUrl && (
            <button
              onClick={handlePreviousPage}
              disabled={!prevPageUrl}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none"
            >
              Previous Page
            </button>
          )}
          {nextPageUrl && (
            <button
              onClick={handleNextPage}
              disabled={!nextPageUrl}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none"
            >
              Next Page
            </button>
          )}
        </div>
      </main>
      <footer className="text-center mt-8">
        <p>© 2023 Mahar Prasetio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
