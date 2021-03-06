console.log('JS connected!');

// creating functions to derive random values for ship attributes

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomAccuracy = (min, max) => {
    return Math.random() * (max - min) + min;
}

// creating ship objects

const humanShip = {
    name: 'USS Schwarzenegger',
    hull: 20,
    firepower: 5,
    accuracy: 0.7,
    attack: attackTarget => {
        console.log('Targetting the alien ship with ze lasers!!');
        if (Math.random() < humanShip.accuracy) {
            attackTarget.hull -= humanShip.firepower;
            console.log(`%c Success!  You\'ve hit the enemy ship for ${humanShip.firepower} damage!  They have ${attackTarget.hull} health left.`, 'font-size: 20px; font-style: italic; background: azure; border: 1px solid blue');
            gameObject.currentTurn = aliensArray[0];
            gameObject.currentTarget = humanShip;
            isFightOver();
        } else {
            console.log('way to go, you missed.  not like the earth is at stake or anything.')
            gameObject.currentTurn = aliensArray[0];
            gameObject.currentTarget = humanShip;
            isFightOver();
        }
    }
}

// initializing array to hold alien ships

let aliensArray = [];

// creating class

class alienShip {
    constructor() {
        this.name = 'Alien Ship';
        this.hull = randomInt(3,6);
        this.firepower = randomInt(2,4);
        this.accuracy = randomAccuracy(0.6, 0.8);
        this.attack = attackTarget => {
            console.log('ahahahha you puny humans we will DESTROY you!!!')
            if (Math.random() < this.accuracy) {
                attackTarget.hull -= this.firepower;
                console.log(`%c You have been hit for ${this.firepower} damage!  You have ${attackTarget.hull} health left.`, 'font-size: 24px; color: red; font-style: bold; background: azure; border: 1px solid grey');
                gameObject.currentTurn = humanShip;
                gameObject.currentTarget = aliensArray[0];
                isFightOver();
            } else {
                console.log('Luckily these aliens can\'t aim, their attack missed');
                gameObject.currentTurn = humanShip;
                gameObject.currentTarget = aliensArray[0];
                isFightOver();
            }
        }
    }
}

// generating the ships

const genAliens = (x) => {
    for (i = 0; i < x; i++) {
        aliensArray.push(new alienShip());
    }
}

genAliens(6);

// function to start the game

const begin = () => {
    const userInput = prompt('You have encountered a fleet of alien vessels, what is your decision Captain?', 'Attack / Retreat');
    if (userInput.toLocaleLowerCase() === 'attack') {
        gameObject.currentTurn = humanShip;
        fight();
    } else if (userInput.toLocaleLowerCase() === 'retreat') {
        alert('Great thanks I guess we\'re just doomed then, bye.  Hope you can outrun them.');
        $('body').hide('slow');
    } else {
        begin();
    }
}

// this one is self explanatory

function fight() {
    if (gameObject.currentTurn === humanShip) {
        humanShip.attack(gameObject.currentTarget);
    } else {
        aliensArray[0].attack(humanShip);
    }
}

// big function that runs after every attack turn and decides whats good

const isFightOver = () => {
    if (aliensArray[0].hull <= 0 && aliensArray.length !== 0) {
        aliensArray.shift();
        gameObject.shipsRemaining = aliensArray.length;
        gameObject.currentTarget = aliensArray[0];
        gameObject.currentTurn = humanShip;
        console.log('%c ***BOOOM*** **** FIRE **** SPARKS **** WOW ****', 'font-size: 40px; font-style: bold; color: firebrick; background-color: khaki; border: 1px solid grey')
        console.log('Congrats, you killed the enemy ship!  But wait..theres more!!');
        console.log(`%c Current health: ${humanShip.hull}, enemy ships remaining: ${gameObject.shipsRemaining}`, 'color: green; font-size 16px');
        if (aliensArray.length !== 0) {
            const userInput = prompt('Attack the next ship or retreat?', 'Attack / Retreat');
            if (userInput.toLocaleLowerCase() === 'attack') {
                fight();
            } else if (userInput.toLocaleLowerCase() === 'retreat') {
                console.log('not gonna save the planet?  Real cool man.');
                $('body').hide('slow');
            } else {
                isFightOver();
            }
        } else if (aliensArray.length === 0) {
            console.log('%c congrats!  you have literally saved the planet.  you can relax now.', 'font-size: 40px; font-style: bold; color: firebrick; background-color: khaki; border: 1px solid grey');
            $('body').text('YAYYYYYYYY!!  THE EARTH IS SAVED!!!!');
        }
    } else if (humanShip.hull <= 0) {
        console.log('%cwelp, you died.  nice try I guess?', 'color: red; font-size: 16px')
        const userInput = prompt('Do you want to retry?', 'yes / No');
        if (userInput.toLocaleLowerCase() === 'yes' || userInput.toLocaleLowerCase() === 'y') {
            begin();
        } else if (userInput.toLocaleLowerCase() === 'no' || userInput.toLocaleLowerCase() === 'n') {
            alert('okay thanks');
            $('body').hide('slow');
        }
    } else if (aliensArray[0].hull > 0) {
        fight();
    }
}

// object that holds game data as it changes

const gameObject = {
    currentTurn: humanShip,
    currentTarget: aliensArray[0],
    shipsRemaining: 6
}

// jquery to start game

$(() => {
    $('#startButton').on('click', (event) => {
        event.preventDefault();
        begin();
    })
})