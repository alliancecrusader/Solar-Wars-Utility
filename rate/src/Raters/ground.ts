import { vehicle_cost, param_type } from '../modules/types';

export type groundRateInput = {
    length: number,
    armor: "none" | "light" | "medium" | "heavy",
    protection: "none" | "soft" | "hard" | "both",
    heavy: number,
    medium: number,
    light: number,
    rocket: number,
    shield: boolean,
    systems: number
}

const params: param_type[] = [
    {id: "length", label: "Length", type: "number", default: 10},
    {id: "armor", label: "Armor", type: "select", options: ["none", "light", "medium", "heavy"], default: "none"},
    {id: "protection", label: "Protection", type: "select", options: ["none", "soft", "hard", "both"], default: "none"},
    {id: "heavy", label: "Heavy Weapons", type: "number", default: 0},
    {id: "medium", label: "Medium Weapons", type: "number", default: 0},
    {id: "light", label: "Light Weapons", type: "number", default: 0},
    {id: "rocket", label: "Rocket Weapons", type: "number", default: 0},
    {id: "shield", label: "Shield", type: "select", options: ["true", "false"], default: "false"},
    {id: "systems", label: "Systems", type: "number", default: 0}
]

const armorCosts = { //Costs are seemingly inverted
    heavy: {ER: 24, CM: 90, EL: 30, CS: 40},
    medium: {ER: 26, CM: 50, EL: 20, CS: 30},
    light: {ER: 40, CM: 30, EL: 12.5, CS: 20},
    none: {ER: 100, CM: 20, EL: 10, CS: 10}
}

const protectionCosts = { //Not inverted
    both: {ER: 0.3, CM: 20, EL: 25},
    hard: {ER: 0.15, CM: 10, EL: 10},
    soft: {ER: 0.1, CM: 5, EL: 15},
    none: {ER: 0, CM: 0, EL: 0}
}

const er = (values: groundRateInput) => {
    const {length, armor, protection, heavy, medium, light, rocket, systems, shield} = values;

    const weaponSystemCost = 
        (heavy > 0) ? 7 :
        (medium > 0) ? 3 : 0;

    const lengthCostER = length**2 / (armorCosts[armor].ER - weaponSystemCost);

    const heavyCostER = heavy*0.9;
    const mediumCostER = medium*0.3;
    const lightCostER = light*0.03;
    const rocketCostER = rocket*0.08;
    const shieldCostER = shield ? 1 : 0;

    const systemCostER = 1 + systems*0.1 + protectionCosts[protection].ER;

    return Math.ceil(systemCostER*(lengthCostER + heavyCostER + mediumCostER + lightCostER + rocketCostER + shieldCostER)*100)/100;
}

const cm = (values: groundRateInput) => {
    const {length, armor, protection, heavy, medium, light, rocket, shield, systems} = values;

    const lengthCostCM = length**2 / 8.5 + armorCosts[armor].CM + protectionCosts[protection].CM;
    
    const heavyCostCM = heavy*10;
    const mediumCostCM = medium*2;
    const lightCostCM = light*0.3;
    const rocketCostCM = rocket;
	const shieldCostCM = shield ? 5 : 0;

    const systemCostCM = systems + 1;

    return Math.ceil(systemCostCM*(lengthCostCM + heavyCostCM + mediumCostCM + lightCostCM + rocketCostCM + shieldCostCM)*20)/100;
}

const el = (values: groundRateInput) => {
    const {length, armor, protection, heavy, medium, light, rocket, shield, systems} = values;

    const lengthCostEL = 3*(length**2 / 85 + armorCosts[armor].EL + protectionCosts[protection].EL);
    
    const heavyCostEL = heavy*6;
    const mediumCostEL = medium*10;
    const lightCostEL = light*0.2;
    const rocketCostEL = rocket*0.2;

    const systemCostEL = systems*1.5 + 1;
	
	const finalEL = shield ? systemCostEL*(lengthCostEL + heavyCostEL + mediumCostEL + lightCostEL + rocketCostEL)*1.1 + 30 : systemCostEL*(lengthCostEL + heavyCostEL + mediumCostEL + lightCostEL + rocketCostEL)
    return Math.ceil(finalEL*20)/100;
}

const cs = (values: groundRateInput, costCM: number, costEL: number) => {
    const {armor, heavy, medium, light, rocket, systems} = values;
    
    const CSCostID = 
        (heavy > 0 || rocket > 0) ? 4 :
        (medium > 0) ? 3 :
        (light > 0) ? 2 : 1;
    
    const lengthCostCS =
        (CSCostID === 4 || armorCosts[armor].CS === 4) ? 50 :
        (CSCostID === 3 || armorCosts[armor].CS === 3) ? 30 :
        (CSCostID === 2 || armorCosts[armor].CS === 2) ? 15 : 10;

    const systemCostCS = systems*2.5;

    return Math.ceil((lengthCostCS + systemCostCS + 0.1*(costCM + costEL))*20)/100;
}

const rate = (values: groundRateInput): vehicle_cost => {
    const costCM = cm(values);
    const costEL = el(values);
    const costCS = cs(values, costCM, costEL);

    return {
        er: Math.ceil(er(values)*1000000),
        cm: Math.ceil(costCM),
        cs: Math.ceil(costCS),
        el: Math.ceil(costEL),
        cs_upkeep: Math.ceil(costCS/6)
    }
} 

export default {
    rate: rate,
    params: params
}