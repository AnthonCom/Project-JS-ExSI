// GOOD LORD MAKE SURE YOU'RE SPELLING THINGS CORRECTLY 
// Initial Template built with guidance, DOM content entered before learning was done, but post instruction week 5 understanding is now better.

document.addEventListener('DOMContentLoaded', () => {                                                       // all our js is going within this DOM event listener
    const squares = document.querySelectorAll('.grid div')                                                  // identifying all classes and ids we've built using query selectors. As there's more than one element that is considered a div within .grid, 
                                                                                                            // we need to make sure we're using the query selector "all" (querySelectorAll) for the squares
    const resultDisplay = document.querySelector('#result')                                                 // note use of # not . for picking out ID names, instead of class name
    let width = 15
    let pdcLoc = 202                                                                                        // starting point for the "PDC"
    let currentTorpLoc = 0                                                                                  // starting point for the "torps" - This also controls their position in general- changing this value 
    let torpsDestroyed = []                                                                                 // creating an empty array for the torps that get shot, resolving for 0 (leaving blank) right now
    let result = 0
    let direction = 1
    let torpId                                                                                              // initially left blank
    
    // we need to define enemy units
    // start by laying them out how we want them to appear in the squares array

    const torpArray = [                                                                                     // we skip 10-14 and 25-29 because we need a 5 "unit" gap for the torps to move
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,                                                                       // is this modifiable on the fly perhaps? If left as is the movement squares won't adjust as unit count decreases
        15,16,17,18,19,20,21,22,23,24, 
        30,31,32,33,34,35,36,37,38,39 
    ]

// we can "draw" them by adding a class name 
    torpArray.forEach( torp => squares[currentTorpLoc + torp].classList.add('torp'))                        // choosing to call each item in the "torpArray" array "torp". These get passed through our squares with any current index value that applies to them
                                                                                                            // a .classList of "torp" is then added to that square
// we can do the same for the "pdc"
    squares[pdcLoc].classList.add('pdc')

// for actually making the pdc move - remember, left or right only, not up or down
    function movePdc(e) {                                                                                   //(e) for "event". This is assigning control based on keycodes, assigned to the keys on a keyboard
        squares[pdcLoc].classList.remove('pdc')                                                             //this starts by clearing the board of the PDC by removing the class name on the PDC's location index (202, above), otherwise the PDC would always 
                                                                                                            //return to the originally defined variable (pdcLoc)
        switch(e.keyCode) {                                                                                 //making a case for key code 37 - aka left arrow key on the keyboard - https://asawicki.info/nosense/doc/devices/keyboard/key_codes.html
            case 37:                                                                                        //for left arrow key
                if(pdcLoc % width !==0) pdcLoc -=1                                                          //if PDC's index is divisible by the width (15, as our box sizes are 15) and leaves a remainder (ie, if index is 30, it won't give any remainders, indicating
                break                                                                                       //you're on the leftmost side of the grid) then PDC can move left.
            case 39:
                if(pdcLoc % width < width -1) pdcLoc +=1                                                    //similar to case 37, but in this case we're looking at whether the number left over is less than 14 - ie, if index is 150, divided by 15 that gives us 
                                                                                                            //10, you can keep going right. Anything less than 209 will allow you to move, anything more will mean you're at the rightmost part of the box
            break
        }
        squares[pdcLoc].classList.add('pdc')                                                                //this adds the class "pdc" to the PDC's new location on the grid once the movement calculation has been done
    }
    document.addEventListener('keydown', movePdc)                                                           //this now means the script is "listening" for relevant keys to be pressed, and using that "event" to run the "movePdc" function

    //now we need to establish how the torps move from one side of the grid to the other, then move down, etc
    function movetorps() {                                                                                  //this function will control movement of the enemy units
        const leftEdge = torpArray[0] % width === 0                                                         //determining our left edge and right edge using similar logic, using the torpArray array
        const rightEdge = torpArray[torpArray.length -1] % width === width -1                               //trickier as it needs to be applied to the first item in the array for checking if you're on the left edge, and apply that logic to the last torp in our array
                                                                                                            //to check if we're on the right edge. If we don't do this, the torps will just carry on off the screen
        if((leftEdge && direction === -1) || (rightEdge && direction === 1)){                               //if we're on the left edge, and our direction is -1(using -1 because if the torp was to go back one index in a row, it basically appears to be going left) or 
                                                                                                            //we're at the right edge and the direction is currently +1, we want to get the directional value of 15
            direction = width                                                                               //width is 15 as above - means movement is a whole row 
        } else if (direction === width){                                                                    //if the direction is already 15, logic is continued same as above
            if (leftEdge) direction = 1                                                                     // if at the left edge, direction is 1
            else direction = -1                                                                             // if not at the left edge, carry on by keeping the direction as -1 
        }
        for (let i = 0; i <= torpArray.length -1; i++) {                                                    //similar to our password generator, i being less than or equal to the total length of the torpArray item -1, means i increases by one
            squares[torpArray[i]].classList.remove('torp')                                                  //removes the torps from the line they're currently in
        }
        for (let i = 0; i <= torpArray.length -1; i++) {                                                    //adds the direction value, moving them along 
            torpArray[i] += direction   
        }
        for (let i = 0; i <= torpArray.length -1; i++) {                                                    //adds the torps to the next line of "squares"
            if (!torpsDestroyed.includes(i)){                                                               //linked to the array created below, which stores all the dead torps
                squares[torpArray[i]].classList.add('torp')                                                 //ensures aliens are re-added to the array for destroyed units when shot
            }
            
        }

        //adding logic for a game over state
        if(squares[pdcLoc].classList.contains('torp', 'pdc')) {
            resultDisplay.textContent = 'Game Over'
            squares[pdcLoc].classList.add('boom')
            clearInterval(torpId)
        }

        for (let i = 0; i <= torpArray.length -1; i++) {                                                    //setting up so if any of the torps are in the last 15 squares of the grid, the game is over - could set this up so it's if an torp comes into contact?
            if(torpArray[i] > (squares.length - (width-1))) {                                      
                resultDisplay.textContent = 'Game Over'                                                     // set up a trigger here so that you can potentially have a splash image for this as well, also a retry button
                clearInterval(torpId)                                                                       //
            }   
        }     
        
        //adding logic for a win state
        if(torpsDestroyed.length === torpArray.length) {
            resultDisplay.textContent = 'You Win!'
            clearInterval(torpId)
        }

    }
    torpId = setInterval(movetorps, 500)

    //adding shooting functionality through another e (event)
    function shoot(e) {
        let pdcBurst
        let pdcBurstLoc = pdcLoc
    //moving the burst from the pdc to the torps
        function burstMove() {
            squares[pdcBurstLoc].classList.remove('burst')                                            //similar to before, moving the burst by removing it from it's current square, adding 1 to its directional value, and then adding the burst back based on the new square value
            pdcBurstLoc -= width
            squares[pdcBurstLoc].classList.add('burst')
            if(squares[pdcBurstLoc].classList.contains('torp')) {                                     //if the burst square contains an torp, we do 3 things: remove the burst, remove the torp and add a "boom"
                squares[pdcBurstLoc].classList.remove('burst')
                squares[pdcBurstLoc].classList.remove('torp')
                squares[pdcBurstLoc].classList.add('boom')

                setTimeout(() => squares[pdcBurstLoc].classList.remove('boom'), 250)
                clearInterval(pdcBurst)

                const torpDestroyed = torpArray.indexOf(pdcBurstLoc)                                  //creating a new array that'll essentially hold all of the torps we've destroyed
                torpsDestroyed.push(torpDestroyed)                                                          //push moves the destroyed torp to the "TakenDown" array
                result++
                resultDisplay.textContent = result
            }

            if(pdcBurstLoc < width) {                                                                 //clears the burst if it's in the first 15 squares (top of the box)
                clearInterval(pdcBurst)
                setTimeout(() => squares[pdcBurstLoc].classList.remove('burst'), 100)
            }                                                                      
        } 

//        document.addEventListener('keyup', e => {                                                         //assigning another keyCode event, corresponding to key 32 (spacebar)
//            if (e.keyCode === 32) {
//                pdcBurst = setInterval(burstMove, 100)
//            }
//        })                                                                                                //amusingly, this didn't work - deprecated keyCode seems to be the issue - use a switch case statement instead
        switch(e.keyCode) {
            case 32:
                pdcBurst = setInterval(burstMove, 100)
                break
        }
    }
    document.addEventListener('keyup', shoot)



})  