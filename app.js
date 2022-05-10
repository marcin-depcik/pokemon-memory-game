const pokemons = document.querySelector('.pokemons')
const gameboard = document.querySelector('.memory-gameboard')
const btn = document.querySelector('.btn')
const pokemonTypes = 6

let isFliped = false
let block = false
let matchedPairs = 0
let clicks = 0
let firstCard, secondCard
let startPonit, endPoint

btn.addEventListener('click', () => {
    startPonit = Date.now()
    pokemons.innerHTML = ''
    gameboard.innerHTML = ''
    fetchPokemons()
})

async function fetchPokemons() {
    for (let i = 0; i < pokemonTypes; i++) {
        const randomID = Math.floor(Math.random() * 500)
        await getPokemon(randomID)
    }
    shuffleCards(document.querySelectorAll('.memory-card'))
    flipCard(document.querySelectorAll('.memory-card'))
}

async function getPokemon(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let pokemon = await response.json()
    createPokemonList(pokemon)
    createPokemonCard(pokemon)
}

function createPokemonList(pokemon) {
    pokemons.innerHTML += `<img src="${pokemon.sprites.other['official-artwork'].front_default}" />`
}

function createPokemonCard(pokemon) {
    gameboard.innerHTML += `<div class="memory-card" data-pokemon-name="${pokemon.name}">
                                <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="front" />
                                <img src="./images/pokeball.png" alt="pokeball" class="back" />
                            </div>
                            <div class="memory-card" data-pokemon-name="${pokemon.name}">
                                <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="front" />
                                <img src="./images/pokeball.png" alt="pokeball" class="back" />
                            </div>`
}

function shuffleCards(cards) {
    cards.forEach((card) => {
        const random = Math.floor(Math.random() * 500)
        card.style.order = random
    })
}

function flipCard(cards) {
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            clicks++
            if (block) return
            if (card === firstCard) return

            card.classList.add('flip')
            if (!isFliped) {
                isFliped = true
                firstCard = card
            } else {
                isFliped = false
                secondCard = card
                isMatch(firstCard, secondCard)
            }
        })
    })
}

function isMatch(first, second) {
    if (first.dataset.pokemonName === second.dataset.pokemonName) {
        matchedPairs++
        block = true
        setTimeout(() => {
            first.classList.add('hidden')
            second.classList.add('hidden')
            resetVariables()
            isGameOver()
        }, 750)
    } else {
        block = true
        setTimeout(() => {
            first.classList.remove('flip')
            second.classList.remove('flip')
            resetVariables()
        }, 1500)
    }
}

function resetVariables() {
    firstCard = null
    secondCard = null
    isFliped = false
    block = false
}

function isGameOver() {
    if (matchedPairs === pokemonTypes) {
        endPoint = Date.now()
        const time = Number((endPoint - startPonit) / 1000).toFixed(2)

        gameboard.innerHTML = ` <div class="game-stats">
                                    <h2>Congratulation You Won!</h2><br/>
                                    <h3>Click Counter: ${clicks} clicks</h3>
                                    <h3>Time: ${time} s</h3>
                                </div>`
    }
}
