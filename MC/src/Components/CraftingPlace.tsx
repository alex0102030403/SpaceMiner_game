import { Html } from '@react-three/drei';
import React from 'react';
import './CraftingPlace.css';


// CraftingPlace component

function CraftingPlace(props: any){

    function handleClose(){
        props.setOpenCrafting(false);
    }

    const craftingRecipies = {
        rocket:{
            name: 'Rocket',
            ingredients: ['Iron', 'Copper', 'Aluminium'],
            ammount: [2, 1, 3],
            img: 'rocket.png'
        },
        sword:{
            name: 'Sword',
            ingredients: ['Iron', 'Copper'],
            ammount: [2, 1],    
            img: 'sword.png'
        },
        pickaxe:{
            name: 'Drill',
            ingredients: ['Iron', 'Copper'],
            ammount: [3, 2],
            img: 'pickaxe.png'
        },
    }

    const craftingRecipiesArray = Object.values(craftingRecipies);

    function handleClick(name: string){
        console.log('Crafted');
        //get items from local storage
        let items = JSON.parse(localStorage.getItem('items') || '[]');
        //get recipie

        props.setMaxNumberOfDrills(props.maxNumberOfDrills + 1);
    }
    

    return (
        <>
        <Html position={props.cameraRef} >
            <div className='main-container'>
                
                {
                    craftingRecipiesArray.map((recipie, index) => {
                        return (
                            <div key={index} className='recipie-container'>
                                <h2 className='title-recipie'>{recipie.name}</h2>
                                
                                <ul className='inside-recipies'>
                                    
                                    {
                                        recipie.ingredients.map((ingredient, index) => {

                                            return <>
                                             <div  className='li-elements' key={index}>
                                                <img className='ingredient-image' src={`./Icons/${ingredient}.png`} alt={ingredient}/>
                                                <p className='ingredient-ammount'>{recipie.ammount[index]}</p>
                                                
                                            </div>
                                            
                                            </>
                                        })
                                        
                                    }
                                    <button onClick={handleClick(recipie.name)}>Craft</button>
                                </ul>
                            </div>
                        );
                    })
                }

                <button className='close-button' onClick={handleClose}>Close</button>
            </div>
            
        </Html>
        </>
        
        
    );
};

export default CraftingPlace;