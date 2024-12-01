const urlParams = new URLSearchParams(window.location.search)
const pokeId = urlParams.get('id')
const detailPokemon = document.getElementById('pokeDetail')
const header = document.getElementById('top')
const about = document.getElementById('about')
const baseStats = document.getElementById('baseStats')
const pokeMoves = document.getElementById('moves')
const pokeEvolu = document.getElementById('evolution')

function cardPokedex(id) {
    pokeApi.getPokemon(id).then((pokemon) => {
        console.log(pokemon)
        detailsPokemon(pokemon)  
    });
  }


const detailsPokemon = (pokemon) => {

   const statname = ['HP','Attack','Defense','Sp. Atk','Sp. Def.','Speed']
   let totalStat = 0
   for (let key in pokemon.stats) {
    totalStat += pokemon.stats[key];
    }
    const typeD = pokemon.type

    detailPokemon.setAttribute('class',`${pokemon.type}`)

    header.innerHTML = `
    <div id="infos">
        <div id="top-bar" >
            <h1 id="name">${pokemon.name}</h1>
            <ol id="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
        </div>
        <span id="number">#${pokemon.id.toString().padStart(3,0)}</span>
    </div>
    <div id="img">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" id="poke-img" alt="pokemon">
    </div> `

    about.innerHTML = `
        <div class="about">
        <div class="stat-row">
                <p>${pokemon.description}</p> 
            </div>
            <div class="stat-row">
                <div class="about-desc">Species</div>
                <div class="about-number">${pokemon.species}</div> 
            </div>
            <div class="stat-row">
                <div class="about-desc">Height</div>
                <div class="about-number">${(pokemon.height / 10).toFixed(2)}m</div>  
            </div>
            <div class="stat-row">
                <div class="about-desc">Weight</div>
                <div class="about-number">${pokemon.weight / 10} kg</div>                
            </div>
            <div class="stat-row">
                <div class="about-desc">Abilities</div>
                <div class="about-number">${pokemon.abilities.map((ability)=> ability).join(', ')}</div>    
            </div>
            <div class="about">
                <div class="stat-row">
                    <h4>Breeding</h4>
                </div>
                <div class="stat-row">
                    <div class="about-desc">Gender</div>
                    <div class="about-gender">
                    <span class="male"><img
                    src="./assets/img/gender-male.svg"
                    alt="icon_male"
                    />${pokemon.gender.male}</span>
                    <span class="female"><img
                    src="./assets/img/gender-female.svg"
                    alt="icon_female"
                    />${pokemon.gender.female}</span>
                    </div>
                </div>
                <div class="stat-row">
                    <div class="about-desc">Egg Groups</div>
                    <div class="about-number">${pokemon.egg_groups.map((egg_group)=> egg_group).join(', ')}</div>
                </div>
                <div class="stat-row">
                    <div class="about-desc">Egg Cycle</div>
                    <div class="about-number">${pokemon.egg_groups.map((egg_group)=> egg_group).join(', ')}</div>
                </div>
            </div>
        </div>`

    baseStats.innerHTML = `
        <div id="stats">
            ${pokemon.stats.map((stat, i) =>`
                <div class="stat-row">
                    <div class="stat-desc">${statname[i]}</div>
                    <div class="stat-number">${stat.toString().padStart(3,0)}</div>
                    <div class="stat-bar">
                        <div class="bar-outer ${pokemon.type}">
                            <div class="bar-inner ${pokemon.type}" style="width: ${stat}%;"></div>
                        </div>
                    </div>
                </div>`).join('')}
                <div class="stat-row">
                    <div class="stat-desc">Total</div>
                    <div class="stat-number">${totalStat.toString().padStart(3,0)}</div>
                    <div class="stat-bar">
                        <div class="bar-outer ">
                            <div class="bar-inner ${pokemon.type}" max="600" style="width: ${totalStat}%;"></div>
                        </div>
                    </div>
                </div>
        </div>`

    pokeMoves.innerHTML = `
        <div  class="moves">
            <ol >
            ${pokemon.moves.map((move) => `<li class="stat-row" >${move}</li>`).join('')}
            </ol>
        </div>`


    pokeEvolu.innerHTML = getEvoltions(pokemon)
    function getEvoltions(pokemon){
    if (pokemon.evolutions.length > 0){ return `
    <div class="cardEvol">
      ${pokemon.evolutions.map((evol, index) =>` 
          <div class="evol" key="${index}">
    ${evol.min_level ? `<span class="lv"> Lv. ${evol.min_level}</span>` : ''}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evol.id}.png" alt="pokemon">
    </div>`).join('')}
    </div> `   }}
}

const closePopup = () => {
    window.location.replace("index.html")
}

const pageLoad = () => {
    const tabs = document.querySelectorAll('.tabs')
    const navs = document.querySelectorAll('#data nav a')
    
    navs.forEach((nav,index) => {
        nav.addEventListener('click', () => {
            tabs.forEach((tab) => {
                tab.classList.remove('active')
            })
            navs.forEach((nav) => {
                nav.classList.remove('focus')
            })
            tabs[index].classList.add('active')
            navs[index].classList.add('focus')
        })
     })
    cardPokedex(pokeId)
}

pageLoad()