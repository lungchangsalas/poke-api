import React, { useEffect, useState } from "react";
import axios from "axios";
import { PokemonCard } from "./PokemonCard";

function PokemonList(){
    const [pokemons, setPokemons] = useState({url: 'https://pokeapi.co/api/v2/pokemon/', pokemon: null});

    useEffect(() => {
        const fetchData = async () =>{
            const res = await fetch(pokemons.url);
            const data = await res.json();
            setPokemons({ pokemon: data.results});
        };
        fetchData();
    }, []);
    
    return (
        (pokemons.pokemon != null) ? (
            <div className="row">
                {pokemons.pokemon.map(pokemon => (
                    <PokemonCard 
                        key={pokemon.name}
                        name={pokemon.name} 
                        url={pokemon.url}>
                    </PokemonCard>
                ))}
            </div>
        ) : (
            <h1>Loading Pokemon</h1>
        )
    );
}

export {PokemonList};