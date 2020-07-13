const Gameboard = (type) => {

    let grid = [];
    let i = 0;
    let shipsInfo = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
    }

    for (let x = 65; x < 75; x++ ) {
        for (let y = 1; y < 11; y++){
            let gridItem = {
                index: i,
                coordinates: String.fromCharCode(x) + y,
                hit: false,
                ship: false,
                sunk: false
            }
            grid.push(gridItem);
            i++;
        }
    }

    const duplicateAttackHandler = (index) => {
        if (grid[index].hit){
            return false;
        } else {
            return true;
        }
    }

    //For player purpose -> computer checks and marks sunk items via aiAttackHandler
    const checkSunkedShips = (enemyShips) => {
        enemyShips.forEach(ship => {
            if (ship.ship.sunk){
                let firstIndex = ship.ship.firstIndex;
                let n = ship.ship.orientation === "X" ? 1 : 10;
                for (let i=0; i<ship.ship.length; i++){
                    grid[firstIndex].sunk = true;
                    firstIndex = firstIndex + n;
                }
            }
        })
    }


    const aiAttackHandler = (enemyShips) => {
        //console.log('AI ATTACK HANDLER')
        
        //First find out which ships are already sunk, save their IDs and mark the grid
        let sunkShipsIds = [];

        enemyShips.forEach(ship => {
            if (ship.ship.sunk){
                let firstIndex = ship.ship.firstIndex;
                let n = ship.ship.orientation === "X" ? 1 : 10;
                for (let i=0; i<ship.ship.length; i++){
                    sunkShipsIds.push(firstIndex);
                    grid[firstIndex].sunk = true;
                    firstIndex = firstIndex + n;
                }
            }
        })
        //console.log(sunkedShipsIds)

        let unknownShips = true;
        let surroundingIndex = null;
        let damagedBoat = null;
        let priority = "Y";
        
        //Find grid item ID which contains a ship, is hitted, but is not present in sunkedShipsIds 
        for (let item of grid){
            //console.log(item)
            if (item.hit && item.ship && !sunkShipsIds.includes(grid.indexOf(item))){
               
                unknownShips = false;
                //Found grid item with unsunked boat
                let boatIndex = grid.indexOf(item)
                //console.log(boatIndex)

                    if (boatIndex > 9){
                        if (grid[boatIndex-10].ship && grid[boatIndex-10].hit){
                            priority = "Y";
                            let tryUp = boatIndex-10;
                            while (tryUp > 0){
                                console.log(tryUp)
                                if (grid[tryUp].hit === false){
                                    damagedBoat = tryUp;
                                    break
                                } 
                                if (grid[tryUp].hit && !grid[tryUp].ship) break;

                                tryUp = tryUp -10;
                            }
                        } else if (!grid[boatIndex-10].hit && priority === "Y" ){
                            surroundingIndex = boatIndex - 10;
                        }
                    }

                    if (boatIndex < 90 ){
                        if (grid[boatIndex+10].ship && grid[boatIndex+10].hit){
                            priority = "Y"
                            let tryDown = boatIndex + 10;
                            while (tryDown<100){
                                console.log(tryDown)
                                if (grid[tryDown].hit === false){
                                    damagedBoat = tryDown;
                                    break
                                }
                                if (grid[tryDown].hit && !grid[tryDown].ship) break;

                                tryDown = tryDown + 10;

                            }
                        } else if (!grid[boatIndex+10].hit && priority === "Y" ){
                            surroundingIndex = boatIndex + 10;
                        }
                    }

                    if (surroundingIndex === null) priority="X";

                    if (boatIndex%10 < 9){
                        if (grid[boatIndex+1].ship && grid[boatIndex+1].hit){
                            priority = "X";
                            let tryRight = boatIndex + 1;
                            while (tryRight%10 < 10 && tryRight%10 > 0){
                                console.log(tryRight)
                                if (grid[tryRight].hit === false){
                                    damagedBoat = tryRight;
                                    break;
                                } 
                                if (grid[tryRight].hit && !grid[tryRight].ship) break;
                                tryRight = tryRight +1;
                                
                            }
                        } else if (!grid[boatIndex+1].hit && priority === "X" ){
                            surroundingIndex = boatIndex + 1;
                        }
                    }
                    
                    if (boatIndex%10 > 0){
                        if (grid[boatIndex-1].ship && grid[boatIndex-1].hit){
                            priority = "X";
                            let tryLeft = boatIndex -1;
                            while (tryLeft%10 !== -1 ){
                                console.log(tryLeft)
                                if (grid[tryLeft].hit === false){
                                    damagedBoat = tryLeft;
                                    break
                                } 
                                if (grid[tryLeft].hit && !grid[tryLeft].ship) break;
                                tryLeft = tryLeft -1;
                                
                            }
                        } else if (!grid[boatIndex-1].hit && priority === "X"){
                            surroundingIndex = boatIndex - 1;
                        }
                    }
                
            break   
            }
        }
        //console.log(damagedBoat);
        //console.log(surroundingIndex);
        if (damagedBoat !== null) {
            return damagedBoat
        } else if (damagedBoat === null && surroundingIndex !== null){
            return surroundingIndex
        } else if (unknownShips || (damagedBoat=== null && surroundingIndex === null)){
            let randomTarget = Math.floor(Math.random()*100);
            while (grid[randomTarget].hit){
                randomTarget = Math.floor(Math.random()*100);
            }
            //console.log(randomTarget)
            return randomTarget
        }
        
    }

    const attackHandler = (index) => {
        grid[index].hit = true;

        if (grid[index].ship){
            for (let ship in shipsInfo){
                if (shipsInfo[ship].includes(index)){
                return ship
                }
            }   
        } else return false;
        
    }

    const getGrid = () => grid;

    const placeShips = (ship) => {

        //orientation horizontal or vertical
        let n = ship.ship.orientation === "X" ? 1 : 10;    
        let firstGridIndex = ship.ship.firstIndex;

        //mark the grid IDs which contains the boat 
        for (let i=0; i<ship.ship.length; i++){
            grid[firstGridIndex].ship = true;
            shipsInfo[ship.ship.id].push(firstGridIndex)
            firstGridIndex = firstGridIndex+n;
            }
    }


    const freeIndexController = (gridIndex, shipIndex , shipLen, orientation) => {

        let gridIdConv = orientation === "X" ? gridIndex % 10 : Math.floor(gridIndex / 10);
                                                    
        if (shipIndex <= gridIdConv && gridIdConv <= (10-shipLen+shipIndex)){
                
            let n = orientation === "X" ? 1 : 10;
            let index = gridIndex-(shipIndex * n);
            for (let i=0; i < shipLen; i++ ){
                if (grid[index].ship === true){
                    return false
                }
            //console.log(grid[index])
            index = index + n;
            }
            return true;

            } else {
                return false;
            }
    }

    


    return {
        getGrid,
        placeShips,
        freeIndexController,
        duplicateAttackHandler,
        aiAttackHandler,
        attackHandler,
        checkSunkedShips
    }
}

export default Gameboard;