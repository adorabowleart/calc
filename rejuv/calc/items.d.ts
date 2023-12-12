import { Generation, TypeName } from './data/interface';
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Water" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Water" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 100 | 10 | 40 | 20 | 80 | 60 | 50 | 130 | 85 | 110 | 95 | 90 | 70 | 30;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Water" | "Fire" | "Ice" | undefined;
export declare function getMultiAttack(item: string): TypeName | undefined;
