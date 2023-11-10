"use strict";
exports.__esModule = true;

var util_1 = require("./util");
var SPECIAL = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon'];
var Move = (function () {
    function Move(gen, name, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        name = options.name || name;
        this.originalName = name;
        var data = (0, util_1.extend)(true, { name: name }, gen.moves.get((0, util_1.toID)(name)), options.overrides);
        this.hits = 1;
        if (options.useZ && ((_a = data.zMove) === null || _a === void 0 ? void 0 : _a.basePower)) {
            var zMoveName = getZMoveName(data.name, data.type, options.item);
            var zMove = gen.moves.get((0, util_1.toID)(zMoveName));
            data = (0, util_1.extend)(true, {}, zMove, {
                name: zMoveName,
                basePower: zMove.basePower === 1 ? data.zMove.basePower : zMove.basePower,
                category: data.category
            });
        }
        else {
            if (data.multihit) {
                if (typeof data.multihit === 'number') {
                    this.hits = data.multihit;
                }
                else if (options.hits) {
                    this.hits = options.hits;
                }
                else {
                    this.hits = (options.ability === 'Skill Link' || options.item === 'Grip Claw')
                        ? data.multihit[1]
                        : data.multihit[0] + 1;
                }
            }
            this.timesUsedWithMetronome = options.timesUsedWithMetronome;
        }
        this.gen = gen;
        this.name = data.name;
        this.ability = options.ability;
        this.item = options.item;
        this.useZ = options.useZ;
        this.useMax = options.useMax;
        this.overrides = options.overrides;
        this.species = options.species;
        this.bp = data.basePower;
        var typelessDamage = (gen.num >= 2 && data.id === 'struggle') ||
            (gen.num <= 4 && ['futuresight', 'doomdesire'].includes(data.id));
        this.type = typelessDamage ? '???' : data.type;
        this.category = data.category ||
            (gen.num < 4 ? (SPECIAL.includes(data.type) ? 'Special' : 'Physical') : 'Status');
        var stat = this.category === 'Special' ? 'spa' : 'atk';
        if (((_b = data.self) === null || _b === void 0 ? void 0 : _b.boosts) && data.self.boosts[stat] && data.self.boosts[stat] < 0) {
            this.dropsStats = Math.abs(data.self.boosts[stat]);
        }
        this.timesUsed = (this.dropsStats && options.timesUsed) || 1;
        this.secondaries = data.secondaries;
        this.target = data.target || 'any';
        this.recoil = data.recoil;
        this.hasCrashDamage = !!data.hasCrashDamage;
        this.mindBlownRecoil = !!data.mindBlownRecoil;
        this.struggleRecoil = !!data.struggleRecoil;
        this.isCrit = !!options.isCrit || !!data.willCrit ||
            gen.num === 1 && ['crabhammer', 'razorleaf', 'slash', 'karate chop'].includes(data.id);
        this.drain = data.drain;
        this.flags = data.flags;
        this.priority = data.priority || 0;
        this.ignoreDefensive = !!data.ignoreDefensive;
        this.overrideOffensiveStat = data.overrideOffensiveStat;
        this.overrideDefensiveStat = data.overrideDefensiveStat;
        this.overrideOffensivePokemon = data.overrideOffensivePokemon;
        this.overrideDefensivePokemon = data.overrideDefensivePokemon;
        this.breaksProtect = !!data.breaksProtect;
        this.isZ = !!data.isZ;
        this.isMax = !!data.isMax;
        if (!this.bp) {
            if (['return', 'frustration', 'pikapapow', 'veeveevolley'].includes(data.id)) {
                this.bp = 102;
            }
        }
    }
    Move.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.includes(this.name);
    };
    Move.prototype.hasType = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        return types.includes(this.type);
    };
    Move.prototype.clone = function () {
        return new Move(this.gen, this.originalName, {
            ability: this.ability,
            item: this.item,
            species: this.species,
            useZ: this.useZ,
            useMax: this.useMax,
            isCrit: this.isCrit,
            hits: this.hits,
            timesUsed: this.timesUsed,
            timesUsedWithMetronome: this.timesUsedWithMetronome,
            overrides: this.overrides
        });
    };
    return Move;
}());
exports.Move = Move;
function getZMoveName(moveName, moveType, item) {
    item = item || '';
    if (moveName.includes('Hidden Power'))
        return 'Breakneck Blitz';
    if (moveName === 'Clanging Scales' && item === 'Kommonium Z')
        return 'Clangorous Soulblaze';
    if (moveName === 'Darkest Lariat' && item === 'Incinium Z')
        return 'Malicious Moonsault';
    if (moveName === 'Giga Impact' && item === 'Snorlium Z')
        return 'Pulverizing Pancake';
    if (moveName === 'Moongeist Beam' && item === 'Lunalium Z')
        return 'Menacing Moonraze Maelstrom';
    if (moveName === 'Photon Geyser' && item === 'Ultranecrozium Z') {
        return 'Light That Burns the Sky';
    }
    if (moveName === 'Play Rough' && item === 'Mimikium Z')
        return 'Let\'s Snuggle Forever';
    if (moveName === 'Psychic' && item === 'Mewnium Z')
        return 'Genesis Supernova';
    if (moveName === 'Sparkling Aria' && item === 'Primarium Z')
        return 'Oceanic Operetta';
    if (moveName === 'Spectral Thief' && item === 'Marshadium Z') {
        return 'Soul-Stealing 7-Star Strike';
    }
    if (moveName === 'Spirit Shackle' && item === 'Decidium Z')
        return 'Sinister Arrow Raid';
    if (moveName === 'Stone Edge' && item === 'Lycanium Z')
        return 'Splintered Stormshards';
    if (moveName === 'Sunsteel Strike' && item === 'Solganium Z')
        return 'Searing Sunraze Smash';
    if (moveName === 'Volt Tackle' && item === 'Pikanium Z')
        return 'Catastropika';
    if (moveName === 'Nature\'s Madness' && item === 'Tapunium Z')
        return 'Guardian of Alola';
    if (moveName === 'Thunderbolt') {
        if (item === 'Aloraichium Z')
            return 'Stoked Sparksurfer';
        if (item === 'Pikashunium Z')
            return '10,000,000 Volt Thunderbolt';
    }
    return ZMOVES_TYPING[moveType];
}
exports.getZMoveName = getZMoveName;
var ZMOVES_TYPING = {
    Bug: 'Savage Spin-Out',
    Dark: 'Black Hole Eclipse',
    Dragon: 'Devastating Drake',
    Electric: 'Gigavolt Havoc',
    Fairy: 'Twinkle Tackle',
    Fighting: 'All-Out Pummeling',
    Fire: 'Inferno Overdrive',
    Flying: 'Supersonic Skystrike',
    Ghost: 'Never-Ending Nightmare',
    Grass: 'Bloom Doom',
    Ground: 'Tectonic Rage',
    Ice: 'Subzero Slammer',
    Normal: 'Breakneck Blitz',
    Poison: 'Acid Downpour',
    Psychic: 'Shattered Psyche',
    Rock: 'Continental Crush',
    Steel: 'Corkscrew Crash',
    Water: 'Hydro Vortex'
};
//# sourceMappingURL=move.js.map