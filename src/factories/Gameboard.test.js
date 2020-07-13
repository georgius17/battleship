import Gameboard from './Gameboard';
import ShipFactory from './ShipFactory';

test ("gameboard checks dupplicate attack", () => {
    const gameboard = Gameboard();

    expect(gameboard.duplicateAttackHandler(5)).toEqual(true);

    gameboard.attackHandler(5);

    expect(gameboard.duplicateAttackHandler(5)).toEqual(false);

});


test ("gameboard does not allow put the new boat on already taken item or outside of the grid", () => {
    const gameboard = Gameboard();

    expect(gameboard.freeIndexController(0, 4, 5, "X")).toEqual(false);
    expect(gameboard.freeIndexController(0, 4, 5, "Y")).toEqual(false);
    expect(gameboard.freeIndexController(0, 0, 5, "Y")).toEqual(true);

    let ship1 = ShipFactory(1);
    ship1.ship.firstIndex = 0;
    gameboard.placeShips(ship1);

    expect(gameboard.freeIndexController(0, 0, 5, "Y")).toEqual(false);

});


test ("AI attack handler always attack on new random grid item when there is no sunk ship or hitted item", () => {
    const gameboard = Gameboard();

    let enemyShips = [ShipFactory(0), ShipFactory(1)]
    
    gameboard.attackHandler(0);
    gameboard.attackHandler(5);
    gameboard.attackHandler(10);
    gameboard.attackHandler(15);
    for (let i=0; i < 30; i++){
        expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(0);
        expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(5);
        expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(10);
        expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(15);
    }
    
});

test ("AI attack handler always attack on surrounding ID next to one damaged (hitted) ship item, does not attack on sunk boats", () => {
    const gameboard = Gameboard();

    let enemyShips = []
    for (let i=0; i < 2; i++){
        let ship = ShipFactory(i);
        ship.ship.firstIndex = i+9;
        ship.ship.orientation = "Y";
        enemyShips.push(ship);
        gameboard.placeShips(ship);
    }

    gameboard.attackHandler(9);

    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(19);

    enemyShips[0].ship.sunk = true;

    expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(19);

    gameboard.attackHandler(10);

    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(20);

    enemyShips[1].ship.sunk = true;

    expect(gameboard.aiAttackHandler(enemyShips)).not.toBe(20);

});

test ("AI attack handler always continue in attacking damaged boat in predictable direction - when there are unless two hitted parts of boat", () => {
    const gameboard = Gameboard();
    
    let enemyShips = []
    for (let i=0; i < 2; i++){
        let ship = ShipFactory(i);
        ship.ship.firstIndex = i+9;
        ship.ship.orientation = "Y";
        enemyShips.push(ship);
        gameboard.placeShips(ship);
    }

    gameboard.attackHandler(9);
    gameboard.attackHandler(19);
    
    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(29);
    gameboard.attackHandler(29);
    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(39);

    enemyShips[0].ship.sunk = true;
    gameboard.attackHandler(10);
    gameboard.attackHandler(20);

    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(30);
    gameboard.attackHandler(30);
    expect(gameboard.aiAttackHandler(enemyShips)).toEqual(40);
})