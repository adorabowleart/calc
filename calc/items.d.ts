import { Generation, TypeName, StatID } from './data/interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatID;
};
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Water" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Water" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 40 | 20 | 50 | 110 | 90 | 60 | 130 | 80 | 85 | 100 | 70 | 95 | 10 | 30;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Water" | "Fire" | "Ice" | undefined;
export declare function getMultiAttack(item: string): TypeName | undefined;
