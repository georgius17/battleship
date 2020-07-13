import React, {useState } from 'react';
import classes from './Ship.module.css';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../modules/Constants';

const Ship = props => {
   // console.log(props.ship.ship.length)
    const shipArray = [];

    const [shipPart, setShipPart] = useState(null)

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.SHIP_ITEM,
            id: shipPart
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    })


    // const inputClasses = [classes.InputElement];

    // if (props.invalid && props.shouldValidate && props.touched ){
    //     inputClasses.push(classes.Invalid);
    // }

    //className={[classes.shipBody, classes[props.ship.ship.orientation]].join(' ')}

    if (props.ship){
        for (let i=0; i<props.ship.ship.length; i++){
            shipArray.push({id: props.ship.ship.name[2]+i})
        //shipArray.push({id: props.ship+i})
        }
    } else return null
     
    const ship = shipArray.map(item=>{
        //console.log(item.id)
        return <div 
        onMouseEnter={()=>setShipPart(item.id)} 
        onMouseLeave={()=> setShipPart(null)}
        className={ shipPart === item.id ? classes.shipPartHovered : classes.shipPart  } 
        key={item.id} ></div>
    })

    return (
       <div 
            className={[classes.shipBody, classes[props.ship.ship.orientation]].join(' ')}
            ref={drag} >
           {ship}
       </div>
    )
}

export default Ship;