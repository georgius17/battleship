const ShipFactory = (i) => {

    const ships = [
        {name: "carrier", length: 5, YIndex: "A1", XIndex: "A1" },
        {name: "battleship", length: 4, YIndex: "A3", XIndex: "B1" },
        {name: "cruiser", length: 3, YIndex: "A5", XIndex: "C1" },
        {name: "submarine", length: 3, YIndex: "A7", XIndex: "D1" },
        {name: "destroyer", length: 2, YIndex: "A9", XIndex: "E1" }
    ]
        // carrier: 5,
        // battleship: 4,
        // cruiser: 3,
        // submarine: 3,
        // destroyer: 2
    
    let ship = {
        name: ships[i].name,
        length: ships[i].length,
        placed: false,
        sunk: false,
        hit: 0,
        firstIndex: ships[i].YIndex,
        orientation: "Y",
        id: i
    }

    const hitShip = () => {
        ship.hit = ship.hit + 1; 
        sunkShip()
    }

    const sunkShip = () => {
        if (ship.hit === ship.length){
            ship.sunk = true;
        }
    }

    const flipShip = () => {
        ship.orientation = ship.orientation === "X" ? "Y" : "X";
        //ship.firstIndex = ship.orientation === "X" ? ships[n].XIndex : ships[n].YIndex; 
    }

    return {
        ship,
        flipShip,
        hitShip
    }
}


export default ShipFactory;