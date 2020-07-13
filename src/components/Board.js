import React, { useState } from 'react';
import classes from './Board.module.css';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../modules/Constants';

const Board = props => {

    const [gridTarget, setGridTarget] = useState(null)
    

    const[{isOver}, drop] = useDrop({
        accept: ItemTypes.SHIP_ITEM,
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: props.type === "grid"
        }),
        drop: (item, monitor, component) =>props.type==="grid" ? props.dropped(item, gridTarget) : null
    })
    

    const grid = props.grid.map(gridItem => {
        //console.log(gridItem.ship)
        if (props.type === "grid") {
           return (
                <div ref={drop} 
                    onDrop={()=>setGridTarget(gridItem.index)} 
                    className={ gridItem.sunk ? classes.gridItemSunkShip : gridItem.hit ? [classes.gridHittedItem, classes[gridItem.ship]].join(' ') : gridItem.ship ? classes.gridItemShip : classes.gridItem } 
                    key={gridItem.index} 
                    > 
                </div>
            ) 
        } else if (props.type === "computer") {
            return (
                <div 
                    className={ gridItem.sunk ? classes.gridItemSunkShip : gridItem.hit ? [classes.gridHittedItem, classes[gridItem.ship]].join(' ') : classes.gridInvisibleItem } 
                    key={gridItem.index}
                    onClick={()=>props.clicked(gridItem.index)} 
                    > 
                </div>
            ) 
        }    
    })
        //console.log(props.type)
    return (
        <div ref={drop} className={ classes.gridContainer} >
            {grid}
        </div>
    )
}

export default Board;