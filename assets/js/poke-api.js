const pokeApi = {}

function convertPokeApiDetailPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.id = pokeDetail.id
    pokemon.photo = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeDetail.id}.png`
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.baseExp = pokeDetail.base_experience;
    pokemon.species = pokeDetail.species.name

    const abilities = pokeDetail.abilities.map((slot) => slot.ability.name)
    pokemon.abilities = abilities;

    const types = pokeDetail.types.map((typeslot) => typeslot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    const moves = pokeDetail.moves.map((moveslot) => moveslot.move.name)
    pokemon.moves = moves

    const stats = pokeDetail.stats.map((statSlot) => statSlot.base_stat)
    pokemon.stats = stats

    return pokemon
}

pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemon = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
      .then((response) => response.json())
      .then(convertPokeApiDetailPokemon)
      .then(pokeApi.getPokemonsSpecies)     
      .then(pokeApi.getEvolution)
      .then(pokeApi.getTypeDefenses)
  }

  pokeApi.getPokemonsSpecies = (pokemon) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
    return fetch(url)
        .then((response) => response.json())
        .then((data)=> {
            const filterDescription = data.flavor_text_entries.filter(
                (lang) => lang.language.name === "en"    
            )
            let description = filterDescription[23].flavor_text
            pokemon.description = description

            let egg_groups = data.egg_groups.map((egg_group) => egg_group.name)
            pokemon.egg_groups = egg_groups

            pokemon.evolution = data.evolution_chain.url;

            pokemon.gender = getGenderPercentages(data.gender_rate)

            return pokemon
        })      
}

pokeApi.getEvolution = (pokemon) => {
    const url = pokemon.evolution
    return fetch(url)
        .then((response) => response.json())
        .then((data)=> {
            
            const pokeEvol= []
            let evoData = data.chain

            do {
                let numberOfEvolutions = evoData.evolves_to.length
          
                pokeEvol.push({
                  id: getUrlId(evoData.species.url),
                  species_name: evoData.species.name,
                  min_level: !evoData ? 1 : evoData.evolution_details[0]?.min_level,
                  trigger_name: !evoData ? null :evoData.evolution_details[0]?.trigger.name,
                  item_name: !evoData ? null : evoData.evolution_details[0]?.item?.name
                })
          
                if (numberOfEvolutions > 1) {
                  for (let i = 1; i < numberOfEvolutions; i++) {
                    pokeEvol.push({
                      id: getUrlId(evoData.evolves_to[i]?.species.url),
                      species_name: evoData.evolves_to[i]?.species.name,
                      min_level: evoData.evolves_to[i]?.evolution_details[0]?.min_level,
                      trigger_name: evoData.evolves_to[i]?.evolution_details[0]?.trigger.name,
                      item_name: evoData.evolves_to[i]?.evolution_details[0]?.item?.name
                    })
                  }
                }
          
                evoData = evoData.evolves_to[0];
              } while (evoData && evoData.evolves_to)

              pokemon.evolutions = pokeEvol

              return pokemon
        })
}

pokeApi.getTypeDefenses = (pokemon) => {
    
    const typeDefenses = {};

    // Consulta a PokeAPI para obter informações de type defenses para cada tipo do Pokémon
    for (const type of pokemon.types) {
        return fetch(`https://pokeapi.co/api/v2/type/${type}`)
            .then((response) => response.json())
            .then((typeData)=> {
                const resistances = typeData.damage_relations.half_damage_to.map((entry) => entry.name);
                const weaknesses = typeData.damage_relations.double_damage_to.map((entry) => entry.name);

        // Armazena as informações no objeto typeDefenses
            typeDefenses[type] = {
                resistances,
                weaknesses,
            }  
        
            pokemon.typeDefenses = typeDefenses
            return pokemon
        })
    }
    
}



  function getGenderPercentages(gender_rate) {
    switch (gender_rate) {
        case -1:
            return { male: 0, female: 0, genderless: 100 };
        case 0:
            return { male: 100, female: 0 };
        case 1:
            return { male: 87.5, female: 12.5 };
        case 2:
            return { male: 75, female: 25 };
        case 3:
            return { male: 62.5, female: 37.5 };
        case 4:
            return { male: 50, female: 50 };
        case 5:
            return { male: 37.5, female: 62.5 };
        case 6:
            return { male: 25, female: 75 };
        case 7:
            return { male: 12.5, female: 87.5 };
        case 8:
            return { male: 0, female: 100 };
        default:
            throw new Error("Invalid gender_rate value");
    }
}

function getUrlId(url){
    var urlSplit = new URL(url).pathname.split("/")
    var id = urlSplit[4]
    return id   
}