import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressBar from 'react-bootstrap/ProgressBar';

function App() {

  const [pokemon, setPokemon] = useState();
  const [allPokemons, setAllPokemons] = useState();
  const [pokemonsByAbility, setPokemonsByAbility] = useState();
  const [ability, setAbility] = useState();
  const [type, setType] = useState();
  const [pokemonsByType, setPokemonsByType] = useState();
  const [pokemonData, setPokemonData] = useState({
    name: "",
    images: {},
    hp: 0,
    attack: 0,
    defense: 0,
    velocity: 0,
    peso: 0,
    size: 0,
    arrayTypes: [],
    arrayAbilities: [],
    id: null,
  });
  const [page, setPage] = useState("all");


  // async function getAllPokemons() {
  //   try {
  //     const data = await axios.get("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20000");
  //     console.log("data", data);
  //     setAllPokemons(data.data.results);
  //     // let images = Object.values(pokemonData.images);

  //     // setPokemonImages(images);
  //   } catch (error) { }
  // }

  async function getPokemon(received) {
    try {
      let data
      if (received) {
        data = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${received}`
        );
      }
      else {

        data = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );
      }

      let types = [];
      for (let index = 0; index < data.data.types.length; index++) {
        let objTypes = {
          name: data.data.types[index].type.name,
          url: data.data.types[index].type.url,
        };
        types.push(objTypes);
      }

      let abilities = [];
      for (let index = 0; index < data.data.abilities.length; index++) {
        let objTypes = {
          name: data.data.abilities[index].ability.name,
          url: data.data.abilities[index].ability.url,
        };
        abilities.push(objTypes);
      }
      setPokemonData({
        name: data.data.name,
        images: data.data.sprites,
        hp: data.data.stats[0].base_stat,
        attack: data.data.stats[1].base_stat,
        defense: data.data.stats[2].base_stat,
        velocity: data.data.stats[5].base_stat,
        weight: data.data.weight,
        size: data.data.height,
        arrayTypes: types,
        arrayAbilities: abilities,
        id: data.data.id,
      });
      setPage("infos");
      // let images = Object.values(pokemonData.images);

      // setPokemonImages(images);
    } catch (error) { }
  }

  async function getByAbility(url) {

    try {
      const data = await axios.get(`${url}`);
      setPokemonsByAbility(data.data.pokemon);
      setPage("abilities");
    } catch (error) { }
  }
  async function getByType(url) {
    try {
      const data = await axios.get(`${url}`);
      setPokemonsByType(data.data.pokemon);
      setPage("types");
    } catch (error) { }
  }

  useEffect(() => {
    getPokemon();
  }, []);

  function pokemonInputChange(e) {
    setPokemon(e.target.value.toLowerCase());
  }

  function handleSubmit(e) {
    e.preventDefault();
    getPokemon();
  }
  function onClickPokemon(pokemonRcvd) {
    getPokemon(pokemonRcvd)
  }

  return (
    <div className="App">
      <div>
        <h1 className="title">PokePage</h1>
        <form className="formulario" onSubmit={handleSubmit}>
          <label>
            <input className="inputPokemon"
              type="text"
              onChange={pokemonInputChange}
              placeholder="Digite o nome do pokemon"
            />
          </label>
          <button type="submit" className="submitPokemon"> Pesquisar </button>
        </form>
        <div>
          {page === "all" && (
            <div >

            </div>
          )}

          {page === "infos" && pokemonData && (
            <div className="infos">
              {Object.keys(pokemonData.images).length != 0 && (
                <img
                  className="imagem"
                  src={pokemonData.images.front_default}
                ></img>
              )}
              <h2 style={{ textTransform: "capitalize" }}> {pokemonData.name}</h2>
              <div className="infosPokemon">

                <div className="info">
                  <span>HP </span>
                  <div>

                    <progress id="file" value={pokemonData.hp} max="100"> {pokemonData.hp} </progress>
                    <span> {pokemonData.hp} </span>
                  </div>
                </div>
                <div className="info">
                  <span>Ataque </span>
                  <div>

                    <progress id="file" value={pokemonData.attack} max="100"> {pokemonData.attack} </progress>
                    <span> {pokemonData.attack} </span>
                  </div>
                </div>
                <div className="info">
                  <span>Defesa </span>
                  <div>

                    <progress id="file" value={pokemonData.defense} max="100"> {pokemonData.defense} </progress>
                    <span> {pokemonData.defense} </span>
                  </div>
                </div>
                <div className="info">
                  <span>Velocidade </span>
                  <div>

                    <progress id="file" value={pokemonData.velocity} max="100"> {pokemonData.velocity} </progress>
                    <span> {pokemonData.velocity} </span>
                  </div>
                </div>
                <div className="info">
                  <span>Peso </span>
                  <span>{pokemonData.weight}</span>
                </div>
                <div className="info">
                  <span>Tamanho </span>
                  <span>{pokemonData.size}</span>
                </div>
                <div className="info">
                  <span>Habilidades </span>
                  <div className="typeAndAbility">


                    {pokemonData.arrayAbilities.map((ability) => (
                      <div style={{ textTransform: "capitalize" }}>
                        <br />
                        <div
                          onClick={function () { getByAbility(ability.url); setAbility(ability.name) }}
                          key={ability.url}
                        >
                          {ability.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info">
                  <span>Tipos </span>
                  <div className="typeAndAbility">

                    {pokemonData.arrayTypes.map((type) => (
                      <div style={{ textTransform: "capitalize" }}>
                        <br />
                        <div onClick={function () { getByType(type.url); setType(type.name) }}>
                          {type.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === "abilities" &&
            <div style={{ width: '90%', margin: 'auto' }}>
              <h1 className="typeAndAbilityTitle">Pokemons com a habilidade {ability}</h1>
              <li className="listPokemons">
                {pokemonsByAbility.map((pokemon) => (
                  <div onClick={() => { onClickPokemon(pokemon.pokemon.name) }} style={{ textTransform: "capitalize" }}>
                    <br />
                    <div className="cardPokemon">
                      <span>
                        {pokemon.pokemon.name}
                      </span>
                      <img src={pokemon.po}></img>
                    </div>
                  </div>
                ))}
              </li>
            </div>}

          {page === "types" &&
            <div style={{ width: '90%', margin: 'auto' }}>
              <h1>Pokemons do tipo {type}</h1>
              <li className="listPokemons">

                {pokemonsByType.map((pokemon) => (
                  <div onClick={() => { onClickPokemon(pokemon.pokemon.name) }} style={{ textTransform: "capitalize" }}>
                    <br />
                    <div className="cardPokemon">
                      <span>
                        {pokemon.pokemon.name}
                      </span>
                      <img src={pokemon.po}></img>
                    </div>
                  </div>
                ))}
              </li>
            </div>}
        </div>
      </div >
    </div >
  );
}

export default App;
