import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

function Pokemon(props){
    const [state, setState] = useState({
        name: '',
        imageUrl: '',
        pokemonIndex: '',
        types: [],
        description: '',
        stats:{
           hp: '',
           attack: '',
           defense: '',
           speed: '',
           specialAttack: '',
           specialDefense: '' 
        },
        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: ''
    });
    
    const { pokemonIndex } = useParams();
    useEffect(() => {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        const fetchData = async () =>{
            const pokemonRes = await axios.get(pokemonUrl);

            const name = pokemonRes.data.name;
            const imageUrl = pokemonRes.data.sprites.front_default;

            let {hp, attack, defense, speed, specialAttack, specialDefense} = '';

            pokemonRes.data.stats.map(stat => {
                switch(stat.stat.name){
                    case 'hp':
                        hp = stat['base_stat'];
                        break;
                    case 'attack':
                        attack = stat['base_stat'];
                        break;
                    case 'defense':
                        defense = stat['base_stat'];
                        break;
                    case 'speed':
                        speed = stat['base_stat'];
                        break;
                    case 'special-attack':
                        specialAttack = stat['base_stat'];
                        break;
                    case 'special-defense':
                        specialDefense = stat['base_stat'];
                        break;
                }
            });

            //convetir decimetros a pies
            const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100 ) /100;

            //convetir a libras
            const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100 ) /100;

            const types = pokemonRes.data.types.map(type => type.type.name);

            const abilities =  pokemonRes.data.abilities.map(ability =>{
                return ability.ability.name.toLowerCase().split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            });
            
            const evs = pokemonRes.data.stats.filter(stat => {
                if(stat.effort > 0){
                    return true;
                }
                return false;
            }).map(stat => {
                return `${stat.effort} ${stat.stat.name.toLowerCase().split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}`;
                
            }).join(', ');


            await axios.get(pokemonSpeciesUrl).then(res => {
                let description = '';
                res.data.flavor_text_entries.some(flavor => {
                    if(flavor.language.name === 'es'){
                        description = flavor.flavor_text;
                        return;
                    }
                });

                const femaleRate = res.data['gender_rate'];
                const genderRatioFemale = 12.5 * femaleRate;
                const genderRatioMale = 12.5 * (8 - femaleRate );

                const catchRate = Math.round((100/255) * res.data['capture_rate']);

                const eggGroups = res.data['egg_groups'].map( group => {
                    return group.name.toLowerCase().split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
                }).join(', ');

                const hatchSteps = 255 * (res.data['hatch_counter'] + 1);
                setState({
                    description,
                    genderRatioFemale,
                    genderRatioMale,
                    catchRate,
                    eggGroups,
                    hatchSteps,
                    name,
                    imageUrl,
                    pokemonIndex,
                    types,
                    stats: {
                        hp,
                        attack,
                        defense,
                        speed,
                        specialAttack,
                        specialDefense
                    },
                    height,
                    weight,
                    abilities,
                    evs
                });
            });

            
        };
        fetchData();
    },[]);
     
    return (
        <div className="col">
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-10 ">
                            <h5>{state.pokemonIndex}</h5>
                        </div>
                        <div className="col-2 ">
                            <div className="float-right">
                                {state.types.map(type => (
                                    <span key={type} 
                                        className="badge badge-pill mr-2"
                                        style={{
                                            backgroundColor: `#${TYPE_COLORS[type]}`,
                                            color: 'white'
                                        }}
                                        >
                                            {type.toLowerCase()
                                                .split(' ')
                                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                .join(' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <img src={state.imageUrl} className="card-img-top rounded mx-auto mt-2"></img>
                            </div>
                            <div className="col-md-9">
                                <h4 className="mx-auto">{state.name.split(' ')
                                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                        .join(' ')}
                                </h4>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">HP</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.hp}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.hp}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.attack}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.attack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Defense</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.defense}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.defense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Speed</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.speed}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.speed}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Special Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.specialAttack}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.specialAttack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Special Defense</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressBar" style={{
                                                width: `${state.stats.specialDefense}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                 <small>{state.stats.specialDefense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col">
                                        <p>{state.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>                                   
                    </div>
                    <hr />
                    <div className="card-body">
                        <h5 className="card-title text-center">Perfil</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Height:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.height} ft.</h6>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Weight:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.weight} lbs.</h6>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Catch Rate:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.catchRate} %</h6>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Gender Ratio:</h6>      
                                        </div>  
                                        <div className="col">
                                            <div className="progress">
                                                <div
                                                    className="progress-bard"
                                                    role="progressbar"
                                                    style={{
                                                        witdh: `${state.genderRatioFemale}%`,
                                                        background: '#C2185B'
                                                    }}
                                                    aria-valuenow='15'
                                                    aria-valuemin='0'
                                                    aria-valuemax='100'
                                                >
                                                    <small>{state.genderRatioFemale}</small>
                                                </div>
                                                <div className="progrss-bar"
                                                    role='progressbar'
                                                    style={{
                                                        width: `${state.genderRatioMale}%`,
                                                        backgroundColor: '#1976D2'
                                                    }}
                                                    aria-valuenow='30'
                                                    aria-valuemin='0'
                                                    aria-valuemax='100'
                                                >
                                                    <small>{state.genderRatioMale}</small>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Egg Groups:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.eggGroups}</h6>
                                        </div> 
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Hatch Steps:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.hatchSteps}</h6>
                                        </div> 
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">Abilities:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.abilities}</h6>
                                        </div> 
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="float-right">EVs:</h6>      
                                        </div>  
                                        <div className="col">
                                            <h6 className="float-left">{state.evs}</h6>
                                        </div> 
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export {Pokemon};