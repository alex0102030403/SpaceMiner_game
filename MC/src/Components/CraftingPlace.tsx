import { Html } from '@react-three/drei';
import React from 'react';
import './CraftingPlace.css';


// CraftingPlace component

function CraftingPlace(props: any){

    function handleClose(){
        props.setOpenCrafting(false);
    }

    const craftingRecipies = {
        gold:{
            name: 'Gold',
            ingredients: ['Gold'],
            ammount: [10],
            img: 'rocket.png',
            result: 'Gold_Ingot'
        },
        iron:{
            name: 'Iron',
            ingredients: ['Iron'],
            ammount: [10],    
            img: 'sword.png',
            result: 'Iron_Ingot'
        },
        copper:{
            name: 'Copper',
            ingredients: ['Copper'],
            ammount: [10],
            img: 'pickaxe.png',
            result: 'Copper_Ingot'
        },
        aluminium:{
            name: 'Aluminiu',
            ingredients: ['Aluminium'],
            ammount: [10],
            img: 'pickaxe.png',
            result: 'Aluminium_Ingot'
        },

    }

    const craftingRecipiesArray = Object.values(craftingRecipies);

    function handleClick(name: string): React.MouseEventHandler<HTMLButtonElement> {
        return (event) => {
            //console.log('Crafted');
            //get items from local storage
            let items = JSON.parse(localStorage.getItem('inventory'));
            console.log(items);
    
            //remove ingredients
            let recipie;

            for (let i = 0; i < craftingRecipiesArray.length; i++){
                if(craftingRecipiesArray[i].name === name){
                    recipie = craftingRecipiesArray[i];
                }
            }

            console.log(recipie);
            
            for(let i = 0;i < items.length; i++){
                if(items[i].name === recipie.name){
                    if(items[i].amount >= recipie.ammount[0]){
                        items[i].amount -= recipie.ammount[0];
                        props.addItemToInventory({name: recipie.result, amount: 1})
                    }else{
                        alert('You do not have enough materials');
                    }
                    
                }
            }



    
            //update items
            
            //get recipie
    
            props.setMaxNumberOfDrills(props.maxNumberOfDrills + 1);
        }
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
                                    <button className='smelt-button' onClick={handleClick(recipie.name)}>Smelt</button>
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