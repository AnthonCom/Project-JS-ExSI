// FINAL DAY TO-DO
// Adjust text so it scales to fill the box it's in? [DONE]
// work to make the background and overall page design less barebones - styled fonts? Background image or just background colour? Background video? [DONE]


const startButton=document.getElementById('start');
startButton.addEventListener('click', game)                                                                         // click button to start game
                                                                                                                    // add secondary button for the reset game function? [DONE]
const restartButton=document.getElementById('restart');
restartButton.style.display = 'none';                                                                               // hide restart button until first round complete

const d1=document.getElementById('startDiscussion');
const d2=document.getElementById('round1Discussion');
const d3=document.getElementById('finaDiscussion');
const vicMessage=document.getElementById('gameOverMessage');


d2.style.display = 'none';                                                                                          // setting up discussion text to be hidden until necessary rounds completed
d3.style.display = 'none';


function game(){
        startButton.style.display = 'none';                                                                         //Need a way to hide this after game starts or spacebar still triggers - THIS FINALLY FIXED IT 
        startButton.disabled = true;                                                                                //Both functions work to hide and disable the button after it is clicked. 

            const squares = document.querySelectorAll('.grid div')                                                  // identifying all classes and ids we've built using query selectors. As there's more than one element that is considered a div within .grid, 
                                                                                                                    // we need to make sure we're using the query selector "all" (querySelectorAll) for the squares
            const resultDisplay = document.querySelector('#result')                                                 // note use of # not . for picking out ID names, instead of class name
            let width = 15
            let currentShooterIndex = 202                                                                           // starting point for the "shooter"
            let currentInvaderIndex = 0                                                                             // starting point for the "invaders" - This also controls their position in general- changing this value 
            let alienInvadersTakenDown = []                                                                         // creating an empty array for the invaders that get shot, resolving for 0 (leaving blank) right now
            let result = 0
            let direction = 1
            let invaderId                                                                                           // initially left blank
            
        // now we need to define the invaders
        // start by basically laying them out how we want them to appear in the squares array

            let alienInvaders = [                                                                                 // we skip 10-14 and 25-29 because we need a 5 "unit" gap for the invaders to move
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
                15,16,17,18,19,20,21,22,23,24, 
                30,31,32,33,34,35,36,37,38,39 
            ]

        // we can "draw" them by adding a class name 
            alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))      // choosing to call each item in the "alienInvaders" array "invader". These get passed through our squares with any current index value that applies to them
                                                                                                                    // a .classList of "invader" is then added to that square
        // we can do the same for the "shooter"
            squares[currentShooterIndex].classList.add('shooter')

        // for actually making the shooter move - remember, left or right only, not up or down - working perfectly, no changes needed
            function moveShooter(e) {                                                                               //(e) for "event". This is assigning control based on keycodes, assigned to the keys on a keyboard
                squares[currentShooterIndex].classList.remove('shooter')                                            //this starts by clearing the board of the shooter by removing the class name on the shooter's location index (202, above), otherwise the shooter would always 
                                                                                                                    //return to the originally defined variable (currentShooterIndex)
                switch(e.keyCode) {                                                                                 //making a case for key code 37 - aka left arrow key on the keyboard - https://asawicki.info/nosense/doc/devices/keyboard/key_codes.html
                    case 37:                                                                                        //for left arrow key
                        if(currentShooterIndex % width !==0) currentShooterIndex -=1                                //if shooter's index is divisible by the width (15, as our box sizes are 15) and leaves a remainder (ie, if index is 30, it won't give any remainders, indicating
                        break                                                                                       //you're on the leftmost side of the grid) then shooter can move left.
                    case 39:
                        if(currentShooterIndex % width < width -1) currentShooterIndex +=1                          //similar to case 37, but in this case we're looking at whether the number left over is less than 14 - ie, if index is 150, divided by 15 that gives us 
                                                                                                                    //10, you can keep going right. Anything less than 209 will allow you to move, anything more will mean you're at the rightmost part of the box
                    break
                }
                squares[currentShooterIndex].classList.add('shooter')                                               //this adds the class "shooter" to the shooter's new location on the grid once the movement calculation has been done
            }
            document.addEventListener('keydown', moveShooter)                                                       //this now means the script is "listening" for relevant keys to be pressed, and using that "event" to run the "moveShooter" function

            //now we need to establish how the invaders move from one side of the grid to the other, then move down, etc - this doesn't quite work as expected - movement area doesn't decrease, as if it's still counting the full array and not the "invaders"
                                                                                                                    //is it not updating because we're setting the total width of the array at the start and its not updating?
            function moveInvaders() {                                                                               //this function will control movement of the enemy units
                let leftEdge = alienInvaders[0] % width == 0                                                        //determining our left edge and right edge using similar logic, using the alienInvaders array
                let rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1                         //trickier as it needs to be applied to the first item in the array for checking if you're on the left edge, and apply that logic to the last invader in our array
                                                                                                                    //to check if we're on the right edge. If we don't do this, the invaders will just carry on off the screen
                //const rightMost = alienInvaders[alienInvaders.length-1];
                
                if((leftEdge && direction === -1) || (rightEdge && direction === 1)){                               //if we're on the left edge, and our direction is -1 (right) if on the right edge, direction is 1 (left) 
                                                                                                                    //we're at the right edge and the direction is currently +1, we want to get the directional value of 15
                    direction = width              //moves 15 across                                                //width is 15 as above - means movement is a whole row ("on average?" the hell does that mean?)
                } else if (direction === width){                                                                    //if the direction is already 15, logic is continued same as above
                    if (leftEdge) direction = 1                                                                     // if at the left edge, direction is 1
                    else direction = -1                                                                             // if not at the left edge, carry on by keeping the direction as -1 
                }
                for (let i = 0; i <= alienInvaders.length -1; i++) {                                                //similar to our password generator, i being less than or equal to the total length of the alienInvaders item -1, means i increases by one - loop
                    squares[alienInvaders[i]].classList.remove('invader')                                           //removes the invaders from the line they're currently in
                }
                for (let i = 0; i <= alienInvaders.length -1; i++) {                                                //adds the direction value, moving them along 
                    alienInvaders[i] += direction   
                }
                for (let i = 0; i <= alienInvaders.length -1; i++) {                                                //adds the invaders to the next line of "squares"
                    if (!alienInvadersTakenDown.includes(i)){                                                       //linked to the array created below, which stores all the dead invaders
                        squares[alienInvaders[i]].classList.add('invader')                                          //ensures aliens are re-added 
                    }
                    
                }

                                                                                                                    //adding logic for a game over state
                if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
                    
                    squares[currentShooterIndex].classList.add('boom')
                    clearInterval(invaderId)
                    d2.style.display = 'block';
                    d1.style.display = 'none';
                                                                                                                    // Show and enable the start button - swap to entirely new button in order to facilitate the resetgame function?
                    restartButton.style.display = 'block';
                    restartButton.disabled = false;
                        restartButton.addEventListener('click', resetGame)                                          // resets the game state using the resetgame function
                            alienInvadersTakenDown = []                                                                                                                                 
                                vicMessage.innerText = 'Dang, that one flew right into you'   
                                vicMessage.style.display = 'block'     
                }

                for (let i = 0; i <= alienInvaders.length -1; i++) {                                                //setting up so if any of the invaders are in the last 15 squares of the grid, the game is over - could set this up so it's if an invader comes into contact?
                    if(alienInvaders[i] > (squares.length - (width-1))) {                                           // the 'game over' squares at the bottom on the screen 
                            clearInterval(invaderId)
                            d2.style.display = 'block';
                            d1.style.display = 'none';
                                                                                                                    // Show and enable the start button
                        restartButton.style.display = 'block';
                        restartButton.disabled = false;
                            restartButton.addEventListener('click', resetGame)
                                alienInvadersTakenDown = []
                                    vicMessage.innerText = 'Ouch, looks like they got through'
                                    vicMessage.style.display = 'block'     
                    }
                }     
                
                                                                                                                    //adding logic for a win state
                if(alienInvadersTakenDown.length === alienInvaders.length) {                                        // win state is simple - if the "taken down" array is the same as the length of the alieninvaders array itself, then you win
                    clearInterval(invaderId)
                        d3.style.display = 'block';
                        d1.style.display = 'none';
                        d2.style.display = 'none';
                                                                                                                    // Show and enable the start button
                    restartButton.innerText = 'Continue?'
                    restartButton.style.display = 'block';
                    restartButton.disabled = false;
                        restartButton.addEventListener('click', resetGame)
                            alienInvadersTakenDown = []
                                vicMessage.innerText = 'Congrats! You cleared this wave. Continue?'
                                vicMessage.style.display = 'block'     
                }

            }
            invaderId = setInterval(moveInvaders, 50)                                                             // consider an if statement for increasing speed - if invaderstakendown < 5, 10, 15, etc. 

            //adding shooting functionality through another e (event)
            function shoot(e) {
                let laserId
                let currentLaserIndex = currentShooterIndex                                                     //ensure the laser always starts from the shooter's location
            //moving the laser from the shooter to the invaders
                function moveLaser() {
                    squares[currentLaserIndex].classList.remove('laser')                                        //similar to before, moving the laser by removing it from it's current square, adding 1 to its directional value, and then adding the laser back based on the new square value
                    currentLaserIndex -= width
                    squares[currentLaserIndex].classList.add('laser')
                    if(squares[currentLaserIndex].classList.contains('invader')) {                              //if the laser square contains an invader, we do 3 things: remove the laser, remove the invader and add a "boom"
                        squares[currentLaserIndex].classList.remove('laser')
                        squares[currentLaserIndex].classList.remove('invader')
                        squares[currentLaserIndex].classList.add('boom')

                        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 100)
                        clearInterval(laserId)

                        const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)                         //creating a new array that'll essentially hold all of the invaders we've destroyed
                        alienInvadersTakenDown.push(alienTakenDown)                                             //push moves the destroyed invader to the "TakenDown" array
                        result++                                                                                //for each invader destroyed, result goes up by 1
                        resultDisplay.textContent = result                                                      //displays result value
                    }

                    if(currentLaserIndex < width) {                                                             //clears the laser if it's in the first 15 squares (top of the box)
                        clearInterval(laserId)
                        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)               //how quickly the laser is cleared from the top screen
                    }                                                                      
                } 

        //        document.addEventListener('keyup', e => {                                                       //assigning another keyCode event, corresponding to key 32 (spacebar)
        //            if (e.keyCode === 32) {
        //                laserId = setInterval(moveLaser, 100)
        //            }
        //        })                                                                                              //amusingly, this didn't work - deprecated keyCode seems to be the issue - use a switch case statement like we do for movement instead
                switch(e.keyCode) {
                    case 32:
                        laserId = setInterval(moveLaser, 100)
                        break
                }
            }
            document.addEventListener('keydown', shoot)                                                           //This was 'keyup' (registering when key was released rather than pressed) but it didn't quite feel right - keydown does allow spam of the button though

            function resetGame() {                                                                                    //trying to assign a reset functionality, so when start game is clicked again after a win, relevant components are removed, then reset or re-added
                // Remove all invaders, shooter, and boom                                                             //appears bugged however, some invaders do not get removed when destroyed when the game state is reset
                restartButton.style.display = 'none';                                                                 // disables and hides the reset button so we don't encounter the same issues we had with start
                restartButton.disabled = true;
                    squares.forEach(square => {
                        square.classList.remove('invader');                        
                        square.classList.remove('shooter');
                        square.classList.remove('boom');
                    });
                
                    // Reset the alienInvaders, currentShooterIndex, and alienInvadersTakenDown
                    alienInvaders = [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                        15,16,17,18,19,20,21,22,23,24,
                        30,31,32,33,34,35,36,37,38,39
                    ];
                    currentShooterIndex = 202;
                    
                
                    // Add the invaders and shooter back to the grid
                    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));
                    squares[currentShooterIndex].classList.add('shooter');

                    
                                                                                                                        //adding logic for a game over state
                    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
                        squares[currentShooterIndex].classList.add('boom')
                        clearInterval(invaderId)

                                                                                                                        // Show and enable the start button - swap to entirely new button in order to facilitate the resetgame function?
                        restartButton.style.display = 'block';
                        restartButton.disabled = false;
                            restartButton.addEventListener('click', resetGame)                                            // resets the game state using the resetgame function
                                alienInvadersTakenDown = []
                    }

                    for (let i = 0; i <= alienInvaders.length -1; i++) {                                                //setting up so if any of the invaders are in the last 15 squares of the grid, the game is over - could set this up so it's if an invader comes into contact?
                        if(alienInvaders[i] > (squares.length - (width-1))) {
                            clearInterval(invaderId)
                                                                                                                        // Show and enable the start button
                            restartButton.style.display = 'block';
                            restartButton.disabled = false;
                                restartButton.addEventListener('click', resetGame)
                                    alienInvadersTakenDown = []
                        }
                    }     
                    
                                                                                                                        //adding logic for a win state
                    if(alienInvadersTakenDown.length === alienInvaders.length) {
                        clearInterval(invaderId)
                                                                                                                        // Show and enable the start button
                        restartButton.style.display = 'block';
                        restartButton.disabled = false;
                            restartButton.addEventListener('click', resetGame)
                                alienInvadersTakenDown = []
                    }
                    invaderId = setInterval(moveInvaders, 800)                                                          // Needs to be added back in here or the invaders don't start moving again once added back to the board. Speed adjusted down 
                }         
}
