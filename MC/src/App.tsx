import { createRoot } from 'react-dom/client'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useGraph, useLoader } from '@react-three/fiber'
import { Billboard, CameraControls, Environment, Html, OrbitControls,Text } from '@react-three/drei'
import coordinatesData from './cords.json'

import { ObjectLoader } from 'three'

import * as THREE from 'three';
import './App.css'
import CustomOrbitControls from './customOrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from 'three/examples/jsm/Addons.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import Login from './Login'
import LoginComponent from './Login'
import { Outlet, useLocation } from 'react-router-dom';
import { cameraFar, cameraPosition, min, mul } from 'three/examples/jsm/nodes/Nodes.js'
import e from 'express'
import { isAbsolute } from 'path'
import { Stats } from '@react-three/drei'
import { get } from 'http'
import CraftingPlace from './Components/CraftingPlace'



function GLTFModel(props : any) {


  const modelRef = useRef();

  const gltf = useLoader(GLTFLoader, 'Rock.glb');
  

  gltf.scene.scale.set(0.1, 0.1, 0.1);
  

  const clones = useMemo(() => gltf.scene.clone(true), [gltf]);
  
  clones.position.set(props.position[0], props.position[1], props.position[2]);
  //console.log(clones.position)

  //change color of the model
  clones.traverse((child) => {
    if (child.isMesh) {
      let color;
      if (props.type === 'ground1') {
        color = 'brown';
      } else if (props.type === 'Copper') {
        color = 'brown';
      } else if (props.type === 'Iron') {
        color = 'grey';
      } else if (props.type === 'Aluminium') {
        color = 'purple';
      } else if (props.type === 'Gold') {
        color = 'orange';
      }


      // Create a new material instance for each mesh
      const newMaterial = child.material.clone();
      newMaterial.color.set(color);
      child.material = newMaterial;
    }
  });
  
 

  return (
    
      
       <group>
        
          <primitive ref={modelRef} object={clones} />
        </group>
    
  )

}

function GLTFModel_Ship(props : any) {
  const modelRef = useRef();

  const gltf = useLoader(GLTFLoader, 'Space/Cargo Depot.glb');

  
  //const gltf2 = useLoader(GLTFLoader, 'Space/SpaceShip.glb');

  const [openCrafting, setOpenCrafting] = useState(false);
  

  const [hover, setHover] = useState(false);

  function handlePointerOver(event){
    gltf.scene.scale.set(1, 1, 1);
    console.log("Hover");
    setHover(true);
  }

  function handlePointerOut(event){
    console.log("Hover out");
    gltf.scene.scale.set(0.85, 0.85, 0.85);
    setHover(false);
  }

  function handleClick(event){
    console.log("Clicked");
    setOpenCrafting(true);
  }


  return (
    
    
      <mesh  onPointerOver={(event) => handlePointerOver(event)}
             onPointerOut={(event) => handlePointerOut(event)}
             onClick={(event) => handleClick(event)}
             > 
             
        {/* <Html position={[gltf.scene.position.x-0.2,gltf.scene.position.y+1.45,gltf.scene.position.z-0.2]}>
          <div className='text'>
            <h3>Main Base</h3>
          </div>
        </Html> */}
        
        <primitive ref={modelRef} object={gltf.scene}
      
        />

       {openCrafting && <CraftingPlace setMaxNumberOfDrills={props.setMaxNumberOfDrills} maxNumberOfDrills={props.maxNumberOfDrills} setOpenCrafting={setOpenCrafting} cameraRef={props.cameraRef} data={[]} />}

      </mesh>
    
  
)

}

//Maybe Delete
function GLTFModel_Arrow(props : any) {

  const arrow_ref = useRef();

  const gltf = useLoader(GLTFLoader, 'MISC/arrow.glb');

  gltf.scene.scale.set(11, 11, 0.1);

  return (
    
    
    <group position={props.position}>
      <mesh>
          <primitive object={gltf.scene} />
      </mesh>
      
    </group>
  

)

}

function GLTFModel_Buildings(props : any) {


  const modelRef = useRef();

  const gltf = useLoader(GLTFLoader, 'Space/Drill.glb');

  const [show, setShow] = useState(true);


  setTimeout(() => {
    setShow(false);
  },props.drillSpeed*1000);
  
  
  //console.log(gltf)
  gltf.scene.scale.set(0.4, 0.4, 0.4);

  //console.log(props.type);
  


  const clones = useMemo(() => gltf.scene.clone(true), [gltf]);

  
  
  clones.position.set(props.position[0], props.position[1], props.position[2]);
  //console.log(clones.position)

  //change color of the model
  clones.traverse((child) => {
    if (child.isMesh) {
      let color;
      if (props.type === 'ground1' || props.type === 'ground2') {
        color = 'brown';
      } else if (props.type === 'Copper') {
        color = 'brown';
      } else if (props.type === 'Iron') {
        color = 'grey';
      } else if (props.type === 'Aluminium') {
        color = 'purple';
      } else if (props.type === 'Gold') {
        color = 'orange';
      }


      // Create a new material instance for each mesh
      const newMaterial = child.material.clone();
      newMaterial.color.set(color);
      child.material = newMaterial;
    }
  });

  //delete the model
  var element = document.querySelector('.loading-bar-drill');

  if(element){
    element.style.setProperty('--animation-duration-drill', props.drillSpeed + 's');
  }
 

  useEffect(() => {
    console.log("Drill speed: " + props.drillSpeed);
    var element = document.querySelector('.loading-bar-drill');

  if(element){
    element.style.setProperty('--animation-duration-drill', props.drillSpeed + 's');
  }

  },[]);
  
 

  return (
    
      show &&(
        <group >
          <Html position={[clones.position.x-0.8,clones.position.y+1.45,clones.position.z-0.2]}>
            <div className='text'>
              <h1>Drill</h1>
              <div className='game-ui-drill'>
                <div id="loading-bar-drill" className="loading-bar-drill"></div>
              </div>
              
            </div>
            
          </Html>
          <primitive ref={modelRef} object={clones} />
        </group>
      )
    
  )

}

function getRockType(chance : number){
  let randomizer = Math.random()*10000;

  if(randomizer < 3*chance){
    return 'Gold';
  }else if(randomizer < 10*chance && randomizer > 3*chance){
    return 'Aluminium';
  }else if(randomizer < 30*chance && randomizer > 10*chance){
    return 'Iron';
  }else if(randomizer < 100*chance && randomizer > 30*chance){
    return 'Copper';
  }else{
    return Math.random()*100 > 50 ? 'Ground1' : 'Ground2';
  }
}


function Box(props : any) {

  const perLevelMoney = {
    1: 1,
    2: 2,
    3: 5,
    4: 10,
    5: 20,
    6: 45,
    7: 100,
    8: 225,
    9: 500,
    10: 1500
  }

  const perLevelGroundColor = {
    1: ['#c1440e' , '#e77d11'],
    2: ['#275a95' , '#184682'],
    3: ['#1c1026' , '#c6bbb9'],
    4: ['#4c1e3c' , '#21242b'],
    5: ['#e6e4dc' , '#635c5a'],
    6: ['#44444b' , '#a99491'],
    7: ['#c9bd96' , '#babc71'],
    8: ['#728c52' , '#845c42'],
    9: ['#add528' , '#3a8183'],
    10: ['#039f9b' , '#e090ad']

    
  }



  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [mined, setMined] = useState(false)
  //const [firstRender, setFirstRender] = useState(false);
  
  if(props.position[0] == 5 && props.position[2] == -5){
    var firstRender = true;
    setTimeout(() => {
      setMined(true);
    },1);
  }

  
  const goldTypeValue = {
    
    'Copper': 2 * props.moneyMultiplier * perLevelMoney[props.level],
    'Iron': 3 * props.moneyMultiplier * perLevelMoney[props.level],
    'Aluminium': 4 * props.moneyMultiplier * perLevelMoney[props.level],
    'Gold': 5 * props.moneyMultiplier * perLevelMoney[props.level]
  }
  
  function handleClick(){
    console.log("Number of drills: " + props.numberOfDrills);
    console.log(props.type)
    if(props.openShop == false && props.type !== 'Ground1' && props.type !== 'Ground2'){
    console.log(props.drillSpeed*1000);
    if(props.numberOfDrills >= 0 && props.numberOfDrills < props.maxNumberOfDrills){
      setActive(!active);
      props.setNumberOfDrills(props.numberOfDrills + 1);
      
      console.log("Number of drills: " + props.numberOfDrills);
      setTimeout(() => {  
        
        setMined(true);
        let newGold = props.gold + goldTypeValue[props.type];
        newGold.toString();
        let newGold_int = parseInt(newGold);
        console.log("New Gold: " + newGold);
        props.setGold(newGold_int);
        console.log("Gold: " + props.gold);

        //add items in inventory
        props.addItemToInventory({name: props.type});
        //console.log(props.Items);
        
        
        props.setNumberOfDrills(0);
        console.log("Number of drills: " + props.numberOfDrills);
      }, props.drillSpeed*1000); 
    }
  }else{
    console.log("Shop is open");
  }
    
  }

  //get randomValue between 0 and 100

  const [toRender, setToRender] = useState(true);
  

  //DE DAT UNCOMMENT LA ASTA

  // useFrame(() => {
  //   //distance from cameraPos to mesh
    
  //   let distance = Math.sqrt(Math.pow(props.cameraPos.current.x - meshRef.current.position.x,2) + Math.pow(props.cameraPos.current.z - meshRef.current.position.z,2));
  //   if(meshRef.current.visible = distance < 10){
  //     setToRender(true);
  //   }else{
  //     setToRender(false);
  //   }
  // });
 
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <>
    <mesh
      {...props}
      ref={meshRef}
      scale-y={active ? 1 : 1}
      onClick={(event) => {handleClick(); }}
      
      
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 0.01, 1]} />
      <meshStandardMaterial color={hovered ? 'green' : ( props.type =='Ground1' ? perLevelGroundColor[props.level][0] : perLevelGroundColor[props.level][1])} />
      
    </mesh>
    {(((props.type !== 'Ground1' && props.type !== 'Ground2') && toRender && !mined && active) || firstRender) && <GLTFModel_Buildings drillSpeed={props.drillSpeed} position={props.position} />}
    {(props.type !== 'Ground1' && props.type !== 'Ground2') && toRender && !mined && <GLTFModel position={props.position} type={props.type} />}

    </>
  )
}


function MyCamerControls(props : any){

  let movingUp = false;
  let movingDown = false;
  let movingLeft = false;
  let movingRight = false;
  
  function handleKeyDown(event){
    console.log(event.key);
    if(event.key === 'w'){
      movingUp = true;
    }
    if(event.key === 's'){
      movingDown = true;
    }
    if(event.key === 'a'){
      movingLeft = true;
    }
    if(event.key === 'd'){
      movingRight = true;
    }
    
  }

  function handleKeyRelease(event){
    if(event.key === 'w'){
      movingUp = false;
    }
    if(event.key === 's'){
      movingDown = false;
    }
    if(event.key === 'a'){
      movingLeft = false;
    }
    if(event.key === 'd'){
      movingRight = false;
    }
  }



  

  useFrame(() => {

    document.addEventListener('keyup',handleKeyRelease);
    document.addEventListener('keydown',handleKeyDown);
    
    //console.log(movingUp + " " + movingDown + " " + movingLeft + " " + movingRight)

    if(movingUp){
      props.cameraPosition.current.z -= 0.03;
    }
    if(movingDown){
      props.cameraPosition.current.z += 0.03;
    }
    if(movingLeft){
      props.cameraPosition.current.x -= 0.03;
    }
    if(movingRight){
      props.cameraPosition.current.x += 0.03;
    }
  
   props.cameraRef.current.setLookAt(
     props.cameraPosition.current.x,
     props.cameraPosition.current.y + 4,
     props.cameraPosition.current.z + 2,
     props.cameraPosition.current.x,
     props.cameraPosition.current.y,
     props.cameraPosition.current.z,
     true
   );
  });


  
  return (
    <>
    <CameraControls ref={props.cameraRef} >
          
          
    </CameraControls>
    </>
  )
}



const App = () => {

  const Items = [
    {
      name: 'Copper',
      amount: 0
    },
    {
      name: 'Iron',
      amount: 0
    },
    {
      name: 'Aluminium',
      amount: 0
    },
    {
      name: 'Gold',
      amount: 0
    }
  ];

  function addItemToInventory(item){
    //add inventory in local storage
    
    let items = JSON.parse(localStorage.getItem('inventory'));
    let index = items.findIndex(x => x.name === item.name);
    items[index].amount += 1;
    localStorage.setItem('inventory',JSON.stringify(items));
    console.log(items);

    let breakSecond = false;

    for(let j = 0; j < inventoryItems.length; j++){
      for(let i = 0; i < inventoryItems[i].length; i++){
        if(inventoryItems[i][j].name === item.name){
          inventoryItems[i][j].amount += 1;
          breakSecond = true;
          break;
        }else if(inventoryItems[i][j].name === ''){
          inventoryItems[i][j].amount = items[index].amount;
          inventoryItems[i][j].name = items[index].name;
          
          console.log("Item added");
          breakSecond = true;
          break;
        }
      }
      if(breakSecond){
        break;
      }
    }
    console.log(inventoryItems);

  }
  const initialInventoryItems = Array.from({ length: 7 }, () =>
    Array.from({ length: 4 }, () => ({
      name: '',
      amount: 0
    }))
  );

  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  const [level, setLevel] = useState(1);

  const [levelUpgradeCost, setLevelUpgradeCost] = useState(1000);

  const [levelUpgradeCostMultiplier, setLevelUpgradeCostMultiplier] = useState(0.8);

  const maxLevel = 10;

  function getLevelFromLocalStorage(){
    const levelStorage = localStorage.getItem('level');
    console.log("Level: " + levelStorage)
    if(levelStorage){
      setLevel(parseInt(levelStorage));
    }
    return levelStorage;
  }

  function setLevelToLocalStorage(level : number){
    localStorage.setItem('level',level.toString());
  }

  function nextLevel(){
    let matrix = generateInitialMatrix();
    setInitialMatrixInLocalStorage(matrix);

    setLevelUpgradeCost(levelUpgradeCost*Math.exp(levelUpgradeCostMultiplier));
    setLevelUpgradeCostMultiplier(levelUpgradeCostMultiplier + 0.1);
    console.log("Next level");
    let newLevel = level + 1;
    setLevel(newLevel);
    setLevelToLocalStorage(newLevel);
  }

  function resetLevel(){
    setLevelUpgradeCost(1000*levelUpgradeCostMultiplier);
    console.log("Reset level");
    setLevelUpgradeCostMultiplier(1);
    setLevel(1);
    setLevelToLocalStorage(1);
  }

  const [showText, setShowText] = useState(false);

  const cameraRef = useRef();

  const arrowRef = useRef();

  const cameraPosition = useRef({ x: 0, y: 0, z: 0 });

  const [barProgress, setBarProgress] = useState(0);

  const [gold, setGold] = useState<number>(10000);

  const [map, setMap] = useState(false);

  const [maxNumberOfDrills , setMaxNumberOfDrills] = useState(1);


  //this should be saved in localStorage and maybe in database (database weak chances)

  const [initialMatrix, setInitialMatrix] = useState([[]]);

  function setInitialMatrixInLocalStorage(matrix : any){
    localStorage.setItem('matrix',JSON.stringify(matrix));
    setInitialMatrix(matrix);
  }

  function setInitialMatrixFromLocalStorage(){
    const matrixStorage = localStorage.getItem('matrix');
    if(matrixStorage){
      setInitialMatrix(JSON.parse(matrixStorage));
    }
  }

  function getInitialMatrixFromLocalStorage(){
    const matrixStorage = localStorage.getItem('matrix');
    
    if(matrixStorage){
      return true;
    }else{
      return false;
    }
  }

  const [inventory, setInventory] = useState(false);

  const [numberOfDrills, setNumberOfDrills] = useState(0);

  const [safeZone, setSafeZone] = useState(false);  

  const [alive, setAlive] = useState(true);

  const [upgradeMenu, setUpgradeMenu] = useState(false);

  const [drillSpeed, setDrillSpeed] = useState(10);

  const [moneyMultiplier, setMoneyMultiplier] = useState(1);

  const [multiplier_D , setMultiplier_D] = useState(0.1);

  const [multiplier_M , setMultiplier_M] = useState(0.1);

  const [multiplier_O , setMultiplier_O] = useState(0.1);

  const [Oxygen, setOxygen] = useState(6000);

  function upgradeOxygenTank(){
    if(gold > 100*Math.exp(multiplier_O*1.2)){
      let newMultiplier = Math.exp(multiplier_O);
      setMultiplier_O(multiplier_O + 0.1);
      setOxygen(Oxygen + 2000);
      setGold(gold - 100*Math.exp(multiplier_O*1.2));
    }else{
      console.log("Not enough gold");
    }
  }

  function setDrillSpeedFunction(){
    if(gold > 100*Math.exp(multiplier_D*1.2)){
    let newMultiplier = Math.exp(multiplier_D);
    setMultiplier_D(multiplier_D + 0.1);  
    console.log(drillSpeed);
    if(drillSpeed - newMultiplier < 0){
      console.log("Max level reached");
    }else{
    setDrillSpeed(drillSpeed - newMultiplier);
    }
    setGold(gold - 100*Math.exp(multiplier_D*1.2));
  }else{
    console.log("Not enough gold");
  }
    
  }

  function GoldFunction(){
    if(gold > 100*Math.exp(multiplier_M*1.2)){
    let newMultiplier = Math.exp(multiplier_M);
    setMultiplier_M(multiplier_M + 0.1);  
    setMoneyMultiplier(moneyMultiplier + newMultiplier);
    let brb = (gold - 100*Math.exp(multiplier_M*1.2)).toString();
    setGold(parseInt(brb));
    }else{
      console.log("Not enough gold");
    }
    
  }

  let movingUp = false;
  let movingDown = false;
  let movingLeft = false;
  let movingRight = false;



// Event listener for 'keydown' event


// Function to reset the loading bar
  function enterSafeZone(animationDuration){
      const loadingBar = document.getElementById('loading-bar');
      
     
      // Reset the width of the loading bar to 100%
      loadingBar.style.width = '100%';
  
      // Set the animation duration
      loadingBar.style.animationDuration = animationDuration + 'ms';
  
      // Trigger reflow to reset the animation
      void loadingBar.offsetWidth;
  
      // Restart the animation by adding/removing the animation class
      loadingBar.classList.remove('loading-bar');
      void loadingBar.offsetWidth; // Force reflow
      loadingBar.classList.add('safe-area');
    }
  
    // Function to reset the loading bar
    function resetLoadingBar(animationDuration) {

      const loadingBar = document.getElementById('loading-bar');
      const loadingProgress = document.getElementById('loading-progress');
      
      // Reset the width of the loading bar to 100%

      loadingBar.style.width = '100%';
  
      // Set the animation duration
      loadingBar.style.animationDuration = animationDuration + 'ms';
  
      // Trigger reflow to reset the animation
      void loadingBar.offsetWidth;
  
      // Restart the animation by adding/removing the animation class
      loadingBar.classList.remove('loading-bar');
      void loadingBar.offsetWidth; // Force reflow
      loadingBar.classList.add('loading-bar');
    }
 

const handleKeyPress = (event) => {




  let currentAliveTime = getAliveTime();
  setInterval(() => {
    let asdf = getAliveTime();
    currentAliveTime = asdf;
    //console.log(currentAliveTime);
    if(parseInt(currentAliveTime) > 95){
      setAlive(false);
      console.log("You have died");
    }
  },100);

  const myArr = document.getElementById('arrow');
  setInterval(() => {
    let direction = "";
    if(cameraPosition.current.x > cameraPosition.current.z && cameraPosition.current.z > 0){
      direction = "stanga";
    }else if(cameraPosition.current.x < cameraPosition.current.z && cameraPosition.current.z > 0){
      direction = "dreapta";}
      else if(cameraPosition.current.x > cameraPosition.current.z && cameraPosition.current.z < 0){
        direction = "sus";}
      else if(cameraPosition.current.x < cameraPosition.current.z && cameraPosition.current.z < 0){
        direction = "jos";
      }
    
    

    if(direction === "stanga"){
      myArr.classList.remove('arrow-left');
      myArr.classList.remove('arrow-right');
      myArr.classList.remove('arrow-up');
      myArr.classList.remove('arrow-down');
      myArr.classList.add('arrow-left');
    }
    if(direction === "dreapta"){
      myArr.classList.remove('arrow-left');
      myArr.classList.remove('arrow-right');
      myArr.classList.remove('arrow-up');
      myArr.classList.remove('arrow-down');
      myArr.classList.add('arrow-up');
    }
    if(direction === "sus"){
      myArr.classList.remove('arrow-left');
      myArr.classList.remove('arrow-right');
      myArr.classList.remove('arrow-up');
      myArr.classList.remove('arrow-down');
      myArr.classList.add('arrow-down');
    }
    if(direction === "jos"){
      myArr.classList.remove('arrow-left');
      myArr.classList.remove('arrow-right');
      myArr.classList.remove('arrow-up');
      myArr.classList.remove('arrow-down');
      myArr.classList.add('arrow-right');
    }
      
      
    
  },100);
  

  // Set the corresponding flag based on the pressed key
  if (event.key === 'w') {
    movingUp = true;
  } 
  if (event.key === 's') {
    movingDown = true;
  } 
  if (event.key === 'a') {
    movingLeft = true;
  }  
  if (event.key === 'd') {
    movingRight = true;
  }
 


  // // Handle diagonal movement
  // if ((movingUp || movingDown) && (movingLeft || movingRight)) {
  //   const diagonalSpeed = 0.1 / Math.sqrt(2); // Adjust diagonal speed as needed

  //   // Adjust the camera position based on the current movement direction
  //   if (movingUp && movingLeft) {
  //     cameraPosition.current.x -= diagonalSpeed;
  //     cameraPosition.current.z -= diagonalSpeed;
  //   } else if (movingUp && movingRight) {
  //     cameraPosition.current.x += diagonalSpeed;
  //     cameraPosition.current.z -= diagonalSpeed;
  //   } else if (movingDown && movingLeft) {
  //     cameraPosition.current.x -= diagonalSpeed;
  //     cameraPosition.current.z += diagonalSpeed;
  //   } else if (movingDown && movingRight) {
  //     cameraPosition.current.x += diagonalSpeed;
  //     cameraPosition.current.z += diagonalSpeed;
  //   }
  // }

  // Update the camera position based on the current movement direction
  let deltaX = 0;
  let deltaZ = 0;

  const diagonalSpeed = 0.1 / Math.sqrt(2); // Adjust diagonal speed as needed

  // if(movingUp && movingLeft){
  //   deltaX -= diagonalSpeed;
  //   deltaZ -= diagonalSpeed;
  //   cameraPosition.current.x += deltaX;
  //   cameraPosition.current.z += deltaZ;
  // }else if(movingUp && movingRight){
  //   deltaX += diagonalSpeed;
  //   deltaZ -= diagonalSpeed;
  //   cameraPosition.current.x += deltaX;
  //   cameraPosition.current.z += deltaZ;
  // }else if(movingDown && movingLeft){
  //   deltaX -= diagonalSpeed;
  //   deltaZ += diagonalSpeed;
  //   cameraPosition.current.x += deltaX;
  //   cameraPosition.current.z += deltaZ;
  // } else if(movingDown && movingRight){
  //   deltaX += diagonalSpeed;
  //   deltaZ += diagonalSpeed;
  //   cameraPosition.current.x += deltaX;
  //   cameraPosition.current.z += deltaZ;
  // } else if(movingUp){
  //   deltaZ -= 0.1;
  //   cameraPosition.current.z += deltaZ;
  // } else if(movingDown){
  //   deltaZ += 0.1;
  //   cameraPosition.current.z += deltaZ;
  // }
  // else if(movingLeft){
  //   deltaX -= 0.1;
  //   cameraPosition.current.x += deltaX;
  // } else if(movingRight){
  //   deltaX += 0.1;
  //   cameraPosition.current.x += deltaX;
  // }

  //console.log(movingDown + " " + movingUp + " " + movingLeft + " " + movingRight)

  // if (movingUp) {
  //   deltaZ -= 0.1;
  //   cameraPosition.current.z += deltaZ;
  // }
  // if (movingDown) {
  //   deltaZ += 0.1;
  //   cameraPosition.current.z += deltaZ;
  // }
  // if (movingLeft) {
  //   deltaX -= 0.1;
  //   cameraPosition.current.x += deltaX;
  // }
  // if (movingRight) {
  //   deltaX += 0.1;
  //   cameraPosition.current.x += deltaX;
  // }

  // cameraPosition.current.x += deltaX;
  // cameraPosition.current.z += deltaZ;

  

  // check if camera position is near the ship
  if(cameraPosition.current.x < 5 && cameraPosition.current.x > -5 && cameraPosition.current.z < 5 && cameraPosition.current.z > -5){
    setSafeZone(true);
    enterSafeZone(Oxygen);
    
  }else{

    if(safeZone == true){
      setSafeZone(false);
      resetLoadingBar(Oxygen);
  }

  }


  // cameraRef.current.setLookAt(
  //   cameraPosition.current.x,
  //   cameraPosition.current.y + 4,
  //   cameraPosition.current.z + 2,
  //   cameraPosition.current.x,
  //   cameraPosition.current.y,
  //   cameraPosition.current.z,
  //   true
  // );

  
  if (event.key === 'r') {
    
  }
};

const handleKeyRelease = (event) => {
  // Clear the corresponding flag when the key is released
  if (event.key === 'w') {
    movingUp = false;
  } else if (event.key === 's') {
    movingDown = false;
  } else if (event.key === 'a') {
    movingLeft = false;
  } else if (event.key === 'd') {
    movingRight = false;
  }
};

function initializeCameraPosition(){
  console.log("Camera initialized")
  cameraRef.current.setLookAt(
    0,
    4,
    2,
    0,
    0,
    0,
    true
  );
}



 function getAliveTime(){
  
  const loadingBar = document.getElementById('loading-bar');
  const loadingProgress = document.getElementById('loading-progress');
  const currentWidth = loadingBar.clientWidth;
  const totalWidth = loadingBar.parentElement.clientWidth;
  const percent = ((totalWidth - currentWidth) / totalWidth) * 100;
  //loadingProgress.textContent = `Progress: ${percent.toFixed(2)}%`;
  let percentValue = percent.toFixed(2);
  
  if(percentValue != 100){
  return percentValue;
  }else{
    return 0;
  }
  
 };


 const matrix_size = 20;
 const generateInitialMatrix = () => {
    const matrix = [];
    for (let i = -matrix_size; i < matrix_size; i++) {
      const row = [];
      for (let j = -matrix_size; j < matrix_size; j++) {
        if(i == 5 && j == -5){
          row.push({
            position: [i, 0, j],
            key: `${i}-${j}`,
            type: 'Copper',
            
          });
        }else{
        row.push({
          position: [i, 0, j],
          key: `${i}-${j}`,
          type: getRockType(Math.abs(i)+Math.abs(j)), // Assuming getRockType() is defined somewhere
          
        });
      }
      }
      matrix.push(row);
    }
    return matrix;
  };

  // Get the initial matrix
useEffect(() => {

  setLevelToLocalStorage(parseInt(getLevelFromLocalStorage()));

  getLevelFromLocalStorage();

  if(localStorage.getItem('inventory') == null){
    localStorage.setItem('inventory',JSON.stringify(Items));
  }

  //Add items in inventory from local storage

  let items = JSON.parse(localStorage.getItem('inventory'));
    

    let breakSecond = false;
    for(let k = 0; k < items.length; k++){
    for(let j = 0; j < inventoryItems.length; j++){
      for(let i = 0; i < inventoryItems[i].length; i++){
       if(inventoryItems[i][j].name === ''){
          inventoryItems[i][j].amount = items[k].amount;
          inventoryItems[i][j].name = items[k].name;
          
          console.log("Item added");
          breakSecond = true;
          break;
        }
      }
      break;
    }
   
    
  }

  // //setLevelToLocalStorage(1);

  // if(getLevelFromLocalStorage() == null){
  //   console.log("hewi")

  // var initialMatrix = generateInitialMatrix();
  // setInitialMatrix(initialMatrix);
  // setInitialMatrixInLocalStorage(initialMatrix);

  // }else {
  //   //delete the initial matrix
  //   //localStorage.removeItem('matrix');
  //   console.log("else")
  //   getInitialMatrixFromLocalStorage();
  //   console.log(initialMatrix);
  // }

  var initialMatrix = generateInitialMatrix();
  //initializeCameraPosition();
  setTimeout(() => {
    setMap(true);
    if(getInitialMatrixFromLocalStorage() == null){
    setInitialMatrixInLocalStorage(initialMatrix);
    }else{
      console.log("else")
      setInitialMatrixFromLocalStorage();
    }
    
  },3000);
  
  
},[map]); 



  return (

    (alive && map) ? (
    <div className='screen'>
      


      <Canvas
        camera={{ position: [cameraPosition.current.x, cameraPosition.current.y+3, cameraPosition.current.z], fov: 60 }}
        onKeyDown={handleKeyPress}
        onKeyUp={handleKeyRelease}
        tabIndex={0}
        className='canvas'
        
      >
        <Stats />
        <MyCamerControls cameraPosition={cameraPosition} cameraRef={cameraRef} movingUp={movingUp} movingDown={movingDown} movingLeft={movingLeft} movingRight={movingRight} />

        <Html position={[cameraRef.current]}>
        <div className='game-ui'>
        <div id="loading-bar" className="loading-bar"></div>
        
        </div>
          <div className='text'>
            <div className='gold'>GOLD {parseInt(gold)}</div>
            
            
            <div id='arrow' className="arrow-left"></div>
            <button className='upgrade-button' onClick={() => setUpgradeMenu(true)}>Upgrade</button>
            <button className='inventory-button' onClick={() => setInventory(true)}>Inventory</button>
          </div>

          {upgradeMenu && (
            
            <div className='upgrade-menu'>
              <div className='upgrade-menu-content'>
                <h1>Upgrade Menu</h1>
                <div className='upgrade-menu-content'>
                  <div className='upgrade-menu-content-item'>
                    <h2>Drill Speed</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt(100*Math.exp(multiplier_D*1.2))}</h3>
                    </div>
                    <button onClick={setDrillSpeedFunction} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>
                  <div className='upgrade-menu-content-item'>
                    <h2>Oxygen</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt((100*Math.exp(multiplier_O*1.2)))}</h3>
                    </div>
                    <button onClick={upgradeOxygenTank} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>
                  <div className='upgrade-menu-content-item'>
                    <h2>Drill extract Quality</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt(100*Math.exp(multiplier_M*1.2))}</h3>
                    </div>
                    <button onClick={GoldFunction} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>
                 
                 {
                    level < maxLevel ? (
                  <div className='upgrade-menu-content-item'>
                    <h2>Next Level</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt(levelUpgradeCost.toString())}</h3>
                    </div>
                    <button onClick={nextLevel} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>
                    ) : (
                      <div className='upgrade-menu-content-item'>
                        <h2>Max Level Reached</h2>
                      </div>
                    )
                 }

                  <div className='upgrade-menu-content-item'>
                    <h2>Reset Level</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt(levelUpgradeCost.toString())}</h3>
                    </div>
                    <button onClick={resetLevel} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>

                  <div className='upgrade-menu-content-item'>
                    <h2>Drills Owned : {maxNumberOfDrills}</h2>
                    <div className='upgrade-menu-content-item-cost'>
                      <h3>Cost: {parseInt(levelUpgradeCost.toString())}</h3>
                    </div>
                    <button onClick={resetLevel} className='upgrade-menu-content-item-button'>Upgrade</button>
                  </div>

                 

                </div>
              </div>
              <button className='upgrade-menu-close' onClick={() => setUpgradeMenu(false)}>Close</button>
            </div>
          )}

          {inventory && (
            <div className='inventory'>
              <div className='inventory-content'>
                  {inventoryItems.map((row, rowIndex) => (
                    <div key={rowIndex} className='inventory-row'>
                      {row.map((item, itemIndex) => (
                        <div key={itemIndex} className='inventory-item'>
                          {true && (
                            <div className='inventory-item-content'>
                              {item.name && (
                              <div className='inventory-cell'>
                                <img src={`./Icons/${item.name}.png`} alt={item.name} />
                                <h3 className='invenotry-ammount'>{item.amount}</h3>
                              </div>
                              )
                              }
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))  
                  }
                  
                
              </div>
              <button className='inventory-close' onClick={() => setInventory(false)}>Close</button>
            </div>
          )}
           
          
          
        </Html>
        
        

        <ambientLight intensity={0.4} />
        <spotLight position={[0, 200, 0]} angle={0.15} penumbra={1} decay={0} intensity={1.2} />
        <pointLight position={[0, 50, 0]} decay={0} intensity={0.5} />
        
          {initialMatrix && initialMatrix.map((row, rowIndex) => (
            <group key={rowIndex}>
              {row.map((boxProps) => (
                <Box key={boxProps.key} maxNumberOfDrills={maxNumberOfDrills} addItemToInventory={addItemToInventory} Items={Items} level={level} drillSpeed={drillSpeed} {...boxProps} cameraPos={cameraPosition} openShop={upgradeMenu} moneyMultiplier={moneyMultiplier} gold={gold} setGold={setGold} setNumberOfDrills={setNumberOfDrills} numberOfDrills={numberOfDrills}/>
              ))}
            </group>
          ))}

          <GLTFModel_Ship  maxNumberOfDrills={maxNumberOfDrills} setMaxNumberOfDrills={setMaxNumberOfDrills} cameraRef={cameraRef} position={[0,0,0]} />
          
          
    
      </Canvas>
    </div> ) : (
      <div className='dead-screen'>U died</div>
    )
  );
};

export default App;