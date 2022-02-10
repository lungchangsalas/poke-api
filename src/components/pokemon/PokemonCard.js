import React,{useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import styled from "styled-components";
import spinner from '../pokemon/ghostSpinner.gif';

const Sprite = styled.img`
    width: 5em;
    heiht: 5em;
    display:none
`;

const Card = styled.div`
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover{
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    }
    -moz-user-select: none;
    -website-user-select: none;
    user-select: none;
    -o-user-select: none;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active{
        text-decoration: none;
    }
`;

function PokemonCard(props){
    const [state, setState] = useState({
        name: '',
        imageUrl: '',
        pokemonIndex: '',
        imageLoading: true,
        toManyRequest: false
    });
    
    useEffect(() => {
        const {name, url} = props;
        const pokemonIndex = url.split('/')[url.split('/').length - 2];
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`
        setState({name,imageUrl,pokemonIndex});
    },[]);
     
    return(
        <div className="col-md-3 col-sm-6 mb-5">
            <StyledLink to={`pokemon/${state.pokemonIndex}`}>
                <Card className="card">
                    <h5 className="card-header">{state.pokemonIndex}</h5>
                    {state.imageLoading ? (
                        <img src={spinner} style={{width: '5em', height: '5em'}} className="card-img-top rounded mx-auto d-block mt-2"></img> 
                    ): null}
                    <Sprite
                        className='card-img-top rounded mx-auto mt-2' 
                        onError = {() => setState({toManyRequest: true})}
                        src={state.imageUrl}
                        style={
                            state.toManyRequest ? {display: 'none'} : state.imageLoading ? null : {display: 'block'}
                        }>
                    </Sprite>
                   
                    <div className='card-body mx-auto'>
                        <h6 className='card-title'>
                            { state.name.toLocaleLowerCase()
                                .split(' ')
                                .map
                                    (letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                    )
                                .join(' ')
                            }
                        </h6>
                    </div>
                </Card>
            </StyledLink>
        </div>
    );
}

export {PokemonCard};