let deckId
let playerScore = 0
let computerScore = 0

const newDeckBtn = document.getElementById("new-deck")
const cardsEl = document.getElementById("cards")
const drawCardsBtn = document.getElementById("draw-cards")
const headerText = document.getElementById("header")
const remainingCardsText = document.getElementById("remaining-cards")
const playerScoreText = document.getElementById("player-score")
const computerScoreText = document.getElementById("computer-score")

async function generateNewDeck() {
    const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    const data = await res.json()

    // set the deckID for the current deck
    deckId = data.deck_id

    // reset the deck content for a new war
    resetGame()

    // display remaining cards
    remainingCardsText.textContent = `Remaining cards: ${data.remaining}`
}

newDeckBtn.addEventListener('click', generateNewDeck)


async function drawCards() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    drawCardsBtn.disabled = false

    remainingCardsText.textContent = `Remaining cards: ${data.remaining}`

    // display images of current hands
    cardsEl.children[1].innerHTML = `
            <img src="${data.cards[0].image}"/>
        `
    cardsEl.children[2].innerHTML = `
            <img src="${data.cards[1].image}"/>
        `
    headerText.textContent = determineCardWinner(data.cards[0], data.cards[1])

    // handle war (same hands)
    if (headerText.textContent === "It's a war!") {
        drawCardsBtn.disabled = true
        setTimeout(drawWarCards, 500)
    }
    
    // display final result
    if (data.remaining === 0) {
        drawCardsBtn.disabled = true
        if (computerScore > playerScore) {
            headerText.textContent = "Computer wins the game!"
        }
        if (computerScore < playerScore) {
            headerText.textContent = "Player wins the game!"
        }
        if (computerScore === playerScore) {
            headerText.textContent = "It's a tie game!"
        }
    }
}
drawCardsBtn.addEventListener('click', drawCards)


const cardCollection = [
    "2", "3", "4", "5", "6", "7", "8", "9", 
     "10", "JACK", "QUEEN", "KING", "ACE"
]
function determineCardWinner(firstCard, secondCard) {
    const firstCardPlace = cardCollection.indexOf(firstCard.value)
    const secondCardPlace = cardCollection.indexOf(secondCard.value)

    if (firstCardPlace > secondCardPlace) {
        computerScore++
        computerScoreText.textContent = computerScore
        return "Computer wins!"
    }
    if (firstCardPlace < secondCardPlace) {
        playerScore++
        playerScoreText.textContent = playerScore
        return "Player wins!"
    }
    if (firstCardPlace === secondCardPlace) {
        return "It's a war!"
    }
}

async function drawWarCards() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`)
    drawCards() = await res
}

function resetGame() {
    drawCardsBtn.disabled = false
    playerScore = 0
    computerScore = 0
    playerScoreText.textContent = 0
    computerScoreText.textContent = 0
    headerText.textContent = "War Game"
    cardsEl.children[1].innerHTML = `
            
        `
        cardsEl.children[2].innerHTML = `
            
        `
}