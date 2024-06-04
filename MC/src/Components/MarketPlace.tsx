import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import './Marketplace.css';
import PriceChart from './PriceChart';

interface Item {
  name: string;
  value: number;
  priceHistory: number[];
  lowerBound: number;
  upperBound: number;
}

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

  const oresValue = {
    0: 50,
    1: 100,
    2: 150,
    3: 200
  }

  


  const getInitialItems = (level: number): Item[] => {
    
    const multiplier = parseInt(perLevelMoney[level]) || 1; // Default to 1 if level is not defined
    
    return [
        { name: 'Copper', value: 50 * multiplier, priceHistory: [], lowerBound: oresValue[0] / 3 * multiplier, upperBound: oresValue[0] * 5 * multiplier },
        { name: 'Iron', value: 100 * multiplier, priceHistory: [], lowerBound: oresValue[1] / 3 * multiplier, upperBound: oresValue[1] * 5 * multiplier },
        { name: 'Aluminium', value: 150 * multiplier, priceHistory: [], lowerBound: oresValue[2] / 3 * multiplier, upperBound: oresValue[2] * 5 * multiplier },
        { name: 'Gold', value: 200 * multiplier, priceHistory: [], lowerBound: oresValue[3] / 3 * multiplier, upperBound: oresValue[3] * 5 * multiplier },
    ];
};







const getWeatherFactor = () => {
  const weather = ['sunny', 'cloudy', 'rainy'];
  const weatherFactor = {
    sunny: 1.05,
    cloudy: 0.95,
    rainy: 0.9,
  };
  const currentWeather = weather[Math.floor(Math.random() * weather.length)];
  return weatherFactor[currentWeather];
};

const getTimeOfDayFactor = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 1.05; // Morning
  if (hour >= 12 && hour < 18) return 1.1; // Afternoon
  if (hour >= 18 && hour < 24) return 0.95; // Evening
  return 0.9; // Night
};

const getCorrectionFactor = (value: number, lowerBound: number, upperBound: number) => {
  if (value > upperBound * 0.8) {
    return 0.85; // If the value is close to the upper bound, it tends to decrease
  }
  if (value < lowerBound * 1.1) {
    return 1.05; // If the value is close to the lower bound, it tends to increase
  }
  return 1.0; // No correction needed if within safe range
};

let level = localStorage.getItem('level');




const Marketplace: React.FC = ( props:any ) => {

let initialItems = getInitialItems(parseInt(level));
console.log("Level: " + level); 

  const [items, setItems] = useState<Item[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [timeRange, setTimeRange] = useState('minutes');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        let newlevel = localStorage.getItem('level');
        if(newlevel !== level){
        level = newlevel;
        setItems(getInitialItems(parseInt(level)));
        console.log(items[0].upperBound);
        }
    }, 1000); // Update every 10 seconds

    return () => clearInterval(interval);
}, []);

  useEffect(() => {

    

    const interval = setInterval(() => {
      const weatherFactor = getWeatherFactor();
      const timeOfDayFactor = getTimeOfDayFactor();



      setItems(items =>
        items.map(item => {

            
            
          const spikeFactor = Math.random() > 0.998 ? 1.25 : 1; // 5% chance of a spike
          const negativeSpikeFactor = Math.random() > 0.998 ? 0.5 : 1; // 5% chance of a negative spike

          const smallPositiveSpikeFactor = Math.random() > 0.99 ? 1.1 : 1; // 1% chance of a small positive spike
          const smallNegativeSpikeFactor = Math.random() > 0.99 ? 0.9 : 1; // 1% chance of a small negative spike

        // if(spikeFactor === 1.5){
        //     alert('Spike in the market!' + {item});
        // }

          const sinFactor = Math.sin(cycle / 10);
          const correctionFactor = getCorrectionFactor(item.value, item.lowerBound, item.upperBound);
          const randomFactor = 0.99 + Math.random() * 0.02; // Small random fluctuation
          const newValue = parseFloat(
            (
              item.value *
              (1 + sinFactor * 0.01) * // Smoother sinusoidal fluctuation
              spikeFactor *
              negativeSpikeFactor *
              smallPositiveSpikeFactor *
              smallNegativeSpikeFactor *
              correctionFactor *
              randomFactor
            ).toFixed(2)
          );

          const boundedValue = Math.max(item.lowerBound, Math.min(newValue, item.upperBound));

          return {
            ...item,
            value: boundedValue,
            priceHistory: [...item.priceHistory.slice(-59), boundedValue], // Keep the last 60 prices
          };
        })
      );
      setCycle(cycle => cycle + 1);
    }, 2000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [cycle,level]);

  const sellItem = (itemName: string, itemValue: number) => {


    let items = JSON.parse(localStorage.getItem('inventory'));
    let myItemname = itemName+"_Ingot";
    console.log(items);
    let check = false;
    for(let i = 0; i < items.length; i++){
        if(items[i].name === myItemname && items[i].amount > 0){
            items[i].amount -= 1;
            props.setGold(props.gold + itemValue);
            localStorage.setItem('inventory', JSON.stringify(items));
            alert(`Sold ${itemName}!`);
            check = true;
        }
    }

    if(check === false){
        alert(`You don't have any ${itemName} to sell!`);
    }

    
  };

  const viewPriceChart = (item: Item) => {
    setSelectedItem(item);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(event.target.value);
  };

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Html>
        <div id="marketplace-container">
          <div className="marketplace">
            {items.map((item, index) => (
              <div key={index} className="card">
                <img src={`./Icons/${item.name}_Ingot.png`} alt={item.name} className="item-image" />
                <h3>{item.name}</h3>
                <p>Value: ${item.value}</p>
                <button onClick={() => sellItem(item.name,item.value)}>Sell</button>
                <button onClick={() => viewPriceChart(item)}>View Price Chart</button>
              </div>
            ))}
          </div>
        </div>
        {selectedItem && (
          <div className="price-chart-modal">
            <div className="price-chart-container">
              <button onClick={() => setSelectedItem(null)}>Close</button>
              <select onChange={handleTimeRangeChange} value={timeRange}>
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
              <PriceChart itemName={selectedItem.name} priceHistory={selectedItem.priceHistory} timeRange={timeRange} />
            </div>
          </div>
        )}
      </Html>
    </Canvas>
  );
};

export default Marketplace;
