const olPokemon = document.getElementById('pokemonList')
const loadMorebutton = document.getElementById('loadMoreButton')
const pokedex = []
const maxRecords = 151
const limit = 15
let offset = 0

const renderPokemons = pokemons => {
    const ol = olPokemon
    const fragment = document.createDocumentFragment()

    pokemons.forEach(pokemon => {
        const li = document.createElement('li')
        const spanNumber = document.createElement('span')
        spanNumber.setAttribute('class','number')
        spanNumber.textContent = `#${pokemon.id.toString().padStart(3,0)}`
        
        const spanName = document.createElement('span')
        spanName.setAttribute('class','name')
        spanName.textContent = `${pokemon.name}`
        
        const detailDiv = document.createElement('div')
        detailDiv.setAttribute('class','detail')
        const olTypes = document.createElement('ol')
        olTypes.setAttribute('class','types')
        const types = pokemon.types.map((type) => {
            const litype = document.createElement('li')
            litype.setAttribute('class',`type ${type}`)
            litype.textContent = `${type}`   
            olTypes.append(litype)
        })
        
        const img = document.createElement('img')
        img.setAttribute('src', pokemon.photo)
        img.setAttribute('alt', pokemon.name)
        detailDiv.append(olTypes,img)

        li.setAttribute('class',`pokemon ${pokemon.type}`)
        li.addEventListener('click',()=>{window.location.replace('details.html?id=' + pokemon.id)})
        li.append(spanNumber,spanName,detailDiv)

        fragment.append(li)
    })
    ol.append(fragment)
}


function loadPokemonsItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokedex.push(pokemons)
        renderPokemons(pokemons)
        nextPokemonRender()
    }) 
}


const loadMore = () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if(qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonsItens(offset, newLimit)

    } else {
        loadPokemonsItens(offset, limit)
    }
}

const observerLastPokemon = pokemonsObserver => {
    const lastPokemon = olPokemon.lastChild
    pokemonsObserver.observe(lastPokemon)
}

const nextPokemonRender = () => {
    const pokemonsObserver = new IntersectionObserver(([lastPokemon], observer) => {
        if(!lastPokemon.isIntersecting) {
            return
        }
        observer.unobserve(lastPokemon.target)
        loadMore()
    },{rootMargin:'200px'})
    observerLastPokemon(pokemonsObserver)
}
loadPokemonsItens(offset, limit)