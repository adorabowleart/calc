"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;

var util_1 = require("../util");
var stats_1 = require("../stats");
var EV_ITEMS = [
    'Macho Brace',
    'Power Anklet',
    'Power Band',
    'Power Belt',
    'Power Bracer',
    'Power Lens',
    'Power Weight',
];
function isGrounded(pokemon, field) {
    return (field.isGravity ||
        (field.hasTerrain('Deep-Earth') && pokemon.hasAbility('Magnet Pull', 'Contrary', 'Oblivious', 'Unaware')) ||
        pokemon.hasItem('Iron Ball') ||
        (!pokemon.hasType('Flying') && !pokemon.hasAbility('Levitate') && !pokemon.hasItem('Air Balloon')) ||
        (pokemon.hasItem('Probopass Crest') && pokemon.name === 'Probopass'));
}
exports.isGrounded = isGrounded;
function getModifiedStat(stat, mod, gen) {
    if (gen && gen.num < 3) {
        if (mod >= 0) {
            var pastGenBoostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
            stat = Math.floor(stat * pastGenBoostTable[mod]);
        }
        else {
            var numerators = [100, 66, 50, 40, 33, 28, 25];
            stat = Math.floor((stat * numerators[-mod]) / 100);
        }
        return Math.min(999, Math.max(1, stat));
    }
    var numerator = 0;
    var denominator = 1;
    var modernGenBoostTable = [
        [2, 8],
        [2, 7],
        [2, 6],
        [2, 5],
        [2, 4],
        [2, 3],
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
        [7, 2],
        [8, 2],
    ];
    stat = OF16(stat * modernGenBoostTable[6 + mod][numerator]);
    stat = Math.floor(stat / modernGenBoostTable[6 + mod][denominator]);
    return stat;
}
exports.getModifiedStat = getModifiedStat;
function computeFinalStats(gen, attacker, defender, field) {
    var e_1, _a, e_2, _b;
    var stats = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        stats[_i - 4] = arguments[_i];
    }
    var sides = [[attacker, field.attackerSide], [defender, field.defenderSide]];
    try {
        for (var sides_1 = __values(sides), sides_1_1 = sides_1.next(); !sides_1_1.done; sides_1_1 = sides_1.next()) {
            var _c = __read(sides_1_1.value, 2), pokemon = _c[0], side = _c[1];
            try {
                for (var stats_2 = (e_2 = void 0, __values(stats)), stats_2_1 = stats_2.next(); !stats_2_1.done; stats_2_1 = stats_2.next()) {
                    var stat = stats_2_1.value;
                    if (stat === 'spe') {
                        pokemon.stats.spe = getFinalSpeed(gen, pokemon, field, side);
                    }
                    else {
                        pokemon.stats[stat] = getModifiedStat(pokemon.rawStats[stat], pokemon.boosts[stat], gen);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (stats_2_1 && !stats_2_1.done && (_b = stats_2["return"])) _b.call(stats_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sides_1_1 && !sides_1_1.done && (_a = sides_1["return"])) _a.call(sides_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.computeFinalStats = computeFinalStats;
function getFinalSpeed(gen, pokemon, field, side) {
    var weather = field.weather || '';
    var terrain = field.terrain;
    var speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);
    var speedMods = [];
    if (side.isTailwind)
        speedMods.push(8192);
    if ((pokemon.hasAbility('Unburden') && pokemon.abilityOn) ||
        (pokemon.hasAbility('Chlorophyll') && (weather.includes('Sun')) || field.hasTerrain('Flower-Garden-4', 'Flower-Garden-5')) ||
        (pokemon.hasAbility('Sand Rush') && (weather === 'Sand' || field.hasTerrain('Desert', 'Ashen-Beach'))) ||
        (pokemon.hasAbility('Swift Swim') && (weather.includes('Rain') || field.hasTerrain('Murkwater', 'Water', 'Underwater'))) ||
        (pokemon.hasAbility('Slush Rush') && (['Hail', 'Snow'].includes(weather) || field.hasTerrain('Snowy-Mountain', 'Icy', 'Frozen'))) ||
        (pokemon.hasAbility('Surge Surfer') && field.hasTerrain('Electric', 'Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2', 'Water', 'Underwater', 'Murkwater'))) {
        speedMods.push(8192);
    }
    else if ((pokemon.hasAbility('Quick Feet') && (pokemon.status || field.hasTerrain('Electric'))) ||
        (pokemon.hasAbility('Steadfast') && field.hasTerrain('Electric'))) {
        speedMods.push(6144);
    }
    else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
        if (field.hasTerrain('Deep-Earth')) {
            speedMods.push(1024);
        }
        else {
            speedMods.push(2048);
        }
    }
    else if (isQPActive(pokemon, field) && getQPBoostedStat(pokemon, gen) === 'spe') {
        speedMods.push(6144);
    }
    if (pokemon.hasItem('Choice Scarf')) {
        speedMods.push(6144);
    }
    else if (pokemon.hasItem.apply(pokemon, __spreadArray(['Iron Ball'], __read(EV_ITEMS), false))) {
        speedMods.push(2048);
    }
    else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
        speedMods.push(8192);
    }
    switch (field.terrain) {
        case 'City':
            if (pokemon.hasAbility('Rattled', 'Pickup')) {
                speedMods.push(6144);
            }
            break;
        case 'Colosseum':
            if (pokemon.hasAbility('Emergency Exit') && pokemon.curHP() <= pokemon.maxHP() / 2) {
                speedMods.push(8192);
            }
            break;
        case 'Concert-LH':
            if (pokemon.hasAbility('Run Away', 'Emergency Exit')) {
                speedMods.push(6144);
            }
            break;
        case 'Concert-H':
        case 'Concert-SH':
            if (pokemon.hasAbility('Run Away', 'Emergency Exit')) {
                speedMods.push(6144);
            }
            else if (pokemon.hasAbility('Rattled')) {
                speedMods.push(8192);
            }
            break;
        case 'Deep-Earth':
            if (pokemon.hasItem('Magnet')) {
                speedMods.push(3072);
            }
            else if (pokemon.hasItem('Float Stone')) {
                speedMods.push(4915);
            }
            if (pokemon.hasAbility('Light Metal')) {
                speedMods.push(6144);
            }
            else if (pokemon.hasAbility('Heavy Metal')) {
                speedMods.push(2703);
            }
            break;
        case 'Dimensional':
        case 'Haunted':
        case 'Back-Alley':
            if (pokemon.hasAbility('Rattled')) {
                speedMods.push(6144);
            }
            break;
        case 'Factory':
            if (pokemon.hasAbility('Light Metal')) {
                speedMods.push(6144);
            }
            else if (pokemon.hasAbility('Heavy Metal')) {
                speedMods.push(2703);
            }
            break;
        case 'Murkwater':
        case 'Water':
            if (!pokemon.hasType('Water') && isGrounded(pokemon, field) && !pokemon.hasAbility('Swift Swim', 'Surge Surfer')) {
                speedMods.push(3072);
            }
            break;
        case 'New-World':
            if (isGrounded(pokemon, field)) {
                speedMods.push(3072);
            }
            break;
        case 'Psychic':
            if (pokemon.hasAbility('Telepathy')) {
                speedMods.push(8192);
            }
            break;
        case 'Sky':
            if (pokemon.hasAbility('Levitate')) {
                speedMods.push(6144);
            }
            break;
        case 'Swamp':
            if (pokemon.hasAbility('Rattled')) {
                speedMods.push(6144);
            }
            break;
        case 'Underwater':
            if (!pokemon.hasType('Water') && !pokemon.hasAbility('Swift Swim', 'Steelworker')) {
                speedMods.push(2048);
            }
            break;
        default:
            break;
    }
    if ((field.hasWeather('Shadow Sky') || field.hasTerrain('Dark-Crystal')) && pokemon.hasAbility('Shadow Dance')) {
        speedMods.push(6144);
    }
    switch (pokemon.item) {
        case 'Seviper Crest':
            if (pokemon.named('Seviper')) {
                speedMods.push(6144);
            }
            break;
        case 'Skuntank Crest':
            if (pokemon.named('Skuntank')) {
                speedMods.push(4915);
            }
            break;
        case 'Ariados Crest':
            if (pokemon.named('Ariados')) {
                speedMods.push(6144);
            }
            break;
        case 'Thievul Crest':
            if (pokemon.named('Thievul')) {
                speedMods.push(6144);
            }
            break;
        case 'Empoleon Crest':
            if (pokemon.named('Empoleon') && (field.hasWeather('Hail') || field.hasTerrain('Icy', 'Snowy-Mountain', 'Frozen'))) {
                speedMods.push(8192);
            }
            break;
    }
    speed = OF32(pokeRound((speed * chainMods(speedMods, 410, 131172)) / 4096));
    if (pokemon.hasStatus('par') && !pokemon.hasAbility('Quick Feet')) {
        speed = Math.floor(OF32(speed * (gen.num < 7 ? 25 : 50)) / 100);
    }
    speed = Math.min(gen.num <= 2 ? 999 : 10000, speed);
    return Math.max(0, speed);
}
exports.getFinalSpeed = getFinalSpeed;
function getMoveEffectiveness(gen, move, type, isGhostRevealed, isGravity, isRingTarget) {
    if ((isRingTarget || isGhostRevealed) && type === 'Ghost' && move.hasType('Normal', 'Fighting')) {
        return 1;
    }
    else if ((isRingTarget || isGravity) && type === 'Flying' && move.hasType('Ground')) {
        return 1;
    }
    else if (move.named('Freeze-Dry') && type === 'Water') {
        return 2;
    }
    else if (move.named('Flying Press')) {
        return (gen.types.get('fighting').effectiveness[type] *
            gen.types.get('flying').effectiveness[type]);
    }
    else {
        return gen.types.get((0, util_1.toID)(move.type)).effectiveness[type];
    }
}
exports.getMoveEffectiveness = getMoveEffectiveness;
function checkAirLock(pokemon, field) {
    if (pokemon.hasAbility('Air Lock', 'Cloud Nine') || field.hasTerrain('Underwater') ||
        (field.hasTerrain('Starlight') && !field.hasWeather('Strong Winds')) ||
        field.hasTerrain('Dimensional') && !field.hasWeather('Shadow Sky')) {
        field.weather = undefined;
    }
}
exports.checkAirLock = checkAirLock;
function checkTypeChanger(pokemon, field, move) {
    if (pokemon.hasAbility('Forecast') && pokemon.named('Castform')) {
        switch (field.weather) {
            case 'Sun':
            case 'Harsh Sunshine':
                pokemon.types = ['Fire'];
                break;
            case 'Rain':
            case 'Heavy Rain':
                pokemon.types = ['Water'];
                break;
            case 'Hail':
            case 'Snow':
                pokemon.types = ['Ice'];
                break;
            default:
                pokemon.types = ['Normal'];
        }
    }
    else if (pokemon.hasAbility('Mimicry') && pokemon.named('Stunfisk-Galar')) {
        switch (field.terrain) {
            case 'Glitch':
                pokemon.types = ['???'];
                break;
            case 'Forest':
                pokemon.types = ['Bug'];
                break;
            case 'Dimensional':
            case 'Starlight':
                pokemon.types = ['Dark'];
                break;
            case 'Dragon-Den':
            case 'Rainbow':
                pokemon.types = ['Dragon'];
                break;
            case 'Electric':
            case 'Short-Circuit-0.5':
            case 'Short-Circuit-0.8':
            case 'Short-Circuit-1.2':
            case 'Short-Circuit-1.5':
            case 'Short-Circuit-2':
                pokemon.types = ['Electric'];
                break;
            case 'Bewitched':
            case 'Fairy-Tale':
            case 'Misty':
                pokemon.types = ['Fairy'];
                break;
            case 'Infernal':
            case 'Volcanic':
            case 'Volcanic-Top':
                pokemon.types = ['Fire'];
                break;
            case 'Sky':
                pokemon.types = ['Flying'];
                break;
            case 'Haunted':
                pokemon.types = ['Ghost'];
                break;
            case 'Flower-Garden-1':
            case 'Flower-Garden-2':
            case 'Flower-Garden-3':
            case 'Flower-Garden-4':
            case 'Flower-Garden-5':
            case 'Grassy':
                pokemon.types = ['Grass'];
                break;
            case 'Ashen-Beach':
            case 'Deep-Earth':
            case 'Desert':
                pokemon.types = ['Ground'];
                break;
            case 'Frozen':
            case 'Icy':
            case 'Snowy-Mountain':
                pokemon.types = ['Ice'];
                break;
            case 'Blessed':
            case 'Big-Top':
            case 'City':
            case 'Concert-NH':
            case 'Concert-LH':
            case 'Concert-H':
            case 'Concert-SH':
            case 'Inverse':
                pokemon.types = ['Normal'];
                break;
            case 'Corrosive':
            case 'Corrosive-Mist':
            case 'Corrupted':
            case 'Murkwater':
            case 'Wasteland':
                pokemon.types = ['Poison'];
                break;
            case 'Chess':
                pokemon.types = ['Psychic'];
                break;
            case 'Cave':
            case 'Rocky':
            case 'Mountain':
                pokemon.types = ['Rock'];
                break;
            case 'Back-Alley':
            case 'Colosseum':
            case 'Factory':
            case 'Mirror':
                pokemon.types = ['Steel'];
                break;
            case 'Swamp':
            case 'Underwater':
            case 'Water':
                pokemon.types = ['Water'];
                break;
            default:
                pokemon.types = ['Ground', 'Steel'];
                break;
        }
    }
    else if (pokemon.hasAbility('RKS System')) {
        if (field.hasTerrain('Glitch')) {
            pokemon.types = ['???'];
        }
        else if (field.hasTerrain('Blessed')) {
            pokemon.types = ['Dark'];
        }
    }
    else if (pokemon.named('Gothitelle') && pokemon.hasItem('Gothitelle Crest')) {
        if (move.hasType('Dark')) {
            pokemon.types = ['Dark'];
        }
        else if (move.hasType('Psychic')) {
            pokemon.types = ['Psychic'];
        }
    }
}
exports.checkTypeChanger = checkTypeChanger;
function checkItem(pokemon, magicRoomActive) {
    if (pokemon.gen.num === 4 && pokemon.hasItem('Iron Ball'))
        return;
    if (pokemon.hasAbility('Klutz') && !EV_ITEMS.includes(pokemon.item) ||
        magicRoomActive) {
        pokemon.item = '';
    }
}
exports.checkItem = checkItem;
function checkWonderRoom(pokemon, wonderRoomActive) {
    var _a;
    if (wonderRoomActive) {
        _a = __read([pokemon.rawStats.spd, pokemon.rawStats.def], 2), pokemon.rawStats.def = _a[0], pokemon.rawStats.spd = _a[1];
    }
}
exports.checkWonderRoom = checkWonderRoom;
function checkIntimidate(gen, source, target) {
    var blocked = target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body') ||
        (gen.num >= 8 && target.hasAbility('Inner Focus', 'Own Tempo', 'Oblivious', 'Scrappy')) ||
        target.hasItem('Clear Amulet');
    if (source.hasAbility('Intimidate') && source.abilityOn && !blocked) {
        if (target.hasAbility('Contrary', 'Defiant', 'Guard Dog')) {
            target.boosts.atk = Math.min(6, target.boosts.atk + 1);
        }
        else if (target.hasAbility('Simple')) {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 2);
        }
        else {
            target.boosts.atk = Math.max(-6, target.boosts.atk - 1);
        }
        if (target.hasAbility('Competitive')) {
            target.boosts.spa = Math.min(6, target.boosts.spa + 2);
        }
    }
}
exports.checkIntimidate = checkIntimidate;
function checkDownload(source, target, field, wonderRoomActive) {
    var _a;
    if (source.hasAbility('Download')) {
        var def = target.stats.def;
        var spd = target.stats.spd;
        if (wonderRoomActive)
            _a = __read([spd, def], 2), def = _a[0], spd = _a[1];
        if (field.hasTerrain('Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2', 'Glitch')) {
            source.boosts.spa = Math.min(6, source.boosts.spa + 1);
            source.boosts.atk = Math.min(6, source.boosts.atk + 1);
        }
        else if (field.hasTerrain('Factory', 'Back-Alley', 'City')) {
            if (spd <= def) {
                source.boosts.spa = Math.min(6, source.boosts.spa + 2);
            }
            else {
                source.boosts.atk = Math.min(6, source.boosts.atk + 2);
            }
        }
        else {
            if (spd <= def) {
                source.boosts.spa = Math.min(6, source.boosts.spa + 1);
            }
            else {
                source.boosts.atk = Math.min(6, source.boosts.atk + 1);
            }
        }
    }
}
exports.checkDownload = checkDownload;
function checkStatSwap(source, target) {
    var _a, _b, _c, _d, _e, _f, _g;
    switch (source.item) {
        case 'Magcargo Crest':
            if (source.named('Magcargo')) {
                var magSpe = target.stats.spe;
                var magDef = target.stats.def;
                _a = __read([magSpe, magDef], 2), magDef = _a[0], magSpe = _a[1];
                source.stats.spe = magSpe;
                source.stats.def = magDef;
            }
            break;
        case 'Infernape Crest':
            if (source.named('Infernape')) {
                var infAtk = target.stats.atk;
                var infDef = target.stats.def;
                var infSpe = target.stats.spe;
                _b = __read([infSpe, infAtk], 2), infAtk = _b[0], infSpe = _b[1];
                _c = __read([infSpe, infDef], 2), infDef = _c[0], infSpe = _c[1];
                source.stats.def = infDef;
                _d = __read([infSpe, infAtk], 2), infAtk = _d[0], infSpe = _d[1];
                source.stats.atk = infAtk;
                var infSpa = target.stats.spa;
                var infSpd = target.stats.spd;
                _e = __read([infSpe, infSpa], 2), infSpa = _e[0], infSpe = _e[1];
                _f = __read([infSpe, infSpd], 2), infSpd = _f[0], infSpe = _f[1];
                source.stats.spd = infSpd;
                _g = __read([infSpe, infSpa], 2), infSpa = _g[0], infSpe = _g[1];
                source.stats.spa = infSpa;
            }
            break;
    }
}
exports.checkStatSwap = checkStatSwap;
function checkIntrepidSword(source, gen, field) {
    if (source.hasAbility('Intrepid Sword') && gen.num < 9) {
        source.boosts.atk = Math.min(6, source.boosts.atk + 1);
    }
    else if (source.hasAbility('Intrepid Sword') && gen.num < 9 && field.hasTerrain('Fairy-Tale')) {
        source.boosts.atk = Math.min(6, source.boosts.atk + 2);
    }
}
exports.checkIntrepidSword = checkIntrepidSword;
function checkDauntlessShield(source, gen, field) {
    if (source.hasAbility('Dauntless Shield') && gen.num < 9) {
        source.boosts.def = Math.min(6, source.boosts.def + 1);
    }
    else if (source.hasAbility('Dauntless Shield') && gen.num < 9 && field.hasTerrain('Fairy-Tale')) {
        source.boosts.def = Math.min(6, source.boosts.def + 2);
    }
}
exports.checkDauntlessShield = checkDauntlessShield;
function checkEmbody(source, gen) {
    if (gen.num < 9)
        return;
    switch (source.ability) {
        case 'Embody Aspect (Cornerstone)':
            source.boosts.def = Math.min(6, source.boosts.def + 1);
            break;
        case 'Embody Aspect (Hearthflame)':
            source.boosts.atk = Math.min(6, source.boosts.atk + 1);
            break;
        case 'Embody Aspect (Teal)':
            source.boosts.spe = Math.min(6, source.boosts.spe + 1);
            break;
        case 'Embody Aspect (Wellspring)':
            source.boosts.spd = Math.min(6, source.boosts.spd + 1);
            break;
    }
}
exports.checkEmbody = checkEmbody;
function checkInfiltrator(pokemon, affectedSide) {
    if (pokemon.hasAbility('Infiltrator')) {
        affectedSide.isReflect = false;
        affectedSide.isLightScreen = false;
        affectedSide.isAuroraVeil = false;
    }
}
exports.checkInfiltrator = checkInfiltrator;
function checkSeedBoost(pokemon, field) {
    if (!pokemon.item)
        return;
    if (field.terrain && pokemon.item.includes('Seed')) {
        switch (pokemon.item) {
            case 'Elemental Seed':
                switch (field.terrain) {
                    case 'Corrosive-Mist':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Dragon-Den':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Electric':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Frozen':
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 2)
                            : Math.min(6, pokemon.boosts.spe + 2);
                        break;
                    case 'Grassy':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Icy':
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 2)
                            : Math.min(6, pokemon.boosts.spe + 2);
                        break;
                    case 'Infernal':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 2)
                            : Math.min(6, pokemon.boosts.atk + 2);
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 2)
                            : Math.min(6, pokemon.boosts.spa + 2);
                        break;
                    case 'Misty':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Murkwater':
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 1)
                            : Math.min(6, pokemon.boosts.spe + 1);
                        break;
                    case 'Sky':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd + 1)
                            : Math.min(6, pokemon.boosts.spd - 1);
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def + 1)
                            : Math.min(6, pokemon.boosts.def - 1);
                        break;
                    case 'Underwater':
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 1)
                            : Math.min(6, pokemon.boosts.spe + 1);
                        break;
                    case 'Water':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    default:
                        break;
                }
                break;
            case 'Magical Seed':
                switch (field.terrain) {
                    case 'Bewitched':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Blessed':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Crystal':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Dark-Crystal':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Dimensional':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Haunted':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Inverse':
                        pokemon.types = ['Normal'];
                        break;
                    case 'New-World':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 1)
                            : Math.min(6, pokemon.boosts.spe + 1);
                        break;
                    case 'Psychic':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Rainbow':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Starlight':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    default:
                        break;
                }
                break;
            case 'Synthetic Seed':
                switch (field.terrain) {
                    case 'Back-Alley':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        break;
                    case 'Big-Top':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        break;
                    case 'Chess':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'City':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        break;
                    case 'Colosseum':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 2)
                            : Math.min(6, pokemon.boosts.atk + 2);
                        break;
                    case 'Corrupted':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 2)
                            : Math.min(6, pokemon.boosts.def + 2);
                        break;
                    case 'Concert-NH':
                    case 'Concert-LH':
                    case 'Concert-H':
                    case 'Concert-SH':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Factory':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Flower-Garden-1':
                    case 'Flower-Garden-2':
                    case 'Flower-Garden-3':
                    case 'Flower-Garden-4':
                    case 'Flower-Garden-5':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Glitch':
                        pokemon.types = ['???'];
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Short-Circuit-0.5':
                    case 'Short-Circuit-0.8':
                    case 'Short-Circuit-1.2':
                    case 'Short-Circuit-1.5':
                    case 'Short-Circuit-2':
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    default:
                        break;
                }
                break;
            case 'Telluric Seed':
                switch (field.terrain) {
                    case 'Cave':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Deep-Earth':
                        pokemon.weightkg *= 1.5;
                        break;
                    case 'Desert':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        pokemon.boosts.spe = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spe - 1)
                            : Math.min(6, pokemon.boosts.spe + 1);
                        break;
                    case 'Mountain':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        break;
                    case 'Rocky':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spd - 1)
                            : Math.min(6, pokemon.boosts.spd + 1);
                        break;
                    case 'Snowy-Mountain':
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                    case 'Swamp':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Volcanic':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Volcanic-Top':
                        pokemon.boosts.def = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.def - 1)
                            : Math.min(6, pokemon.boosts.def + 1);
                        break;
                    case 'Wasteland':
                        pokemon.boosts.atk = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.atk - 1)
                            : Math.min(6, pokemon.boosts.atk + 1);
                        pokemon.boosts.spa = pokemon.hasAbility('Contrary')
                            ? Math.max(-6, pokemon.boosts.spa - 1)
                            : Math.min(6, pokemon.boosts.spa + 1);
                        break;
                }
                break;
            default:
                break;
                ;
        }
    }
}
exports.checkSeedBoost = checkSeedBoost;
function checkMultihitBoost(gen, attacker, defender, move, field, desc, usedWhiteHerb) {
    if (usedWhiteHerb === void 0) { usedWhiteHerb = false; }
    if (move.named('Gyro Ball', 'Electro Ball') && defender.hasAbility('Gooey', 'Tangling Hair')) {
        if (attacker.hasItem('White Herb') && !usedWhiteHerb) {
            desc.attackerItem = attacker.item;
            usedWhiteHerb = true;
        }
        else {
            attacker.boosts.spe = Math.max(attacker.boosts.spe - 1, -6);
            attacker.stats.spe = getFinalSpeed(gen, attacker, field, field.attackerSide);
            desc.defenderAbility = defender.ability;
        }
    }
    else if (move.named('Power-Up Punch')) {
        attacker.boosts.atk = Math.min(attacker.boosts.atk + 1, 6);
        attacker.stats.atk = getModifiedStat(attacker.rawStats.atk, attacker.boosts.atk, gen);
    }
    if (defender.hasAbility('Stamina')) {
        if (attacker.hasAbility('Unaware')) {
            desc.attackerAbility = attacker.ability;
        }
        else {
            defender.boosts.def = Math.min(defender.boosts.def + 1, 6);
            defender.stats.def = getModifiedStat(defender.rawStats.def, defender.boosts.def, gen);
            desc.defenderAbility = defender.ability;
        }
    }
    else if (defender.hasAbility('Weak Armor')) {
        if (attacker.hasAbility('Unaware')) {
            desc.attackerAbility = attacker.ability;
        }
        else {
            if (defender.hasItem('White Herb') && !usedWhiteHerb) {
                desc.defenderItem = defender.item;
                usedWhiteHerb = true;
            }
            else {
                defender.boosts.def = Math.max(defender.boosts.def - 1, -6);
                defender.stats.def = getModifiedStat(defender.rawStats.def, defender.boosts.def, gen);
            }
        }
        defender.boosts.spe = Math.min(defender.boosts.spe + 2, 6);
        defender.stats.spe = getFinalSpeed(gen, defender, field, field.defenderSide);
        desc.defenderAbility = defender.ability;
    }
    var simple = attacker.hasAbility('Simple') ? 2 : 1;
    if (move.dropsStats) {
        if (attacker.hasAbility('Unaware')) {
            desc.attackerAbility = attacker.ability;
        }
        else {
            var stat = move.category === 'Special' ? 'spa' : 'atk';
            var boosts = attacker.boosts[stat];
            if (attacker.hasAbility('Contrary')) {
                boosts = Math.min(6, boosts + move.dropsStats);
                desc.attackerAbility = attacker.ability;
            }
            else {
                boosts = Math.max(-6, boosts - move.dropsStats * simple);
                if (simple > 1)
                    desc.attackerAbility = attacker.ability;
            }
            if (attacker.hasItem('White Herb') && attacker.boosts[stat] < 0 && !usedWhiteHerb) {
                boosts += move.dropsStats * simple;
                desc.attackerItem = attacker.item;
                usedWhiteHerb = true;
            }
            attacker.boosts[stat] = boosts;
            attacker.stats[stat] = getModifiedStat(attacker.rawStats[stat], defender.boosts[stat], gen);
        }
    }
    return usedWhiteHerb;
}
exports.checkMultihitBoost = checkMultihitBoost;
function chainMods(mods, lowerBound, upperBound) {
    var e_3, _a;
    var M = 4096;
    try {
        for (var mods_1 = __values(mods), mods_1_1 = mods_1.next(); !mods_1_1.done; mods_1_1 = mods_1.next()) {
            var mod = mods_1_1.value;
            if (mod !== 4096) {
                M = (M * mod + 2048) >> 12;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (mods_1_1 && !mods_1_1.done && (_a = mods_1["return"])) _a.call(mods_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return Math.max(Math.min(M, upperBound), lowerBound);
}
exports.chainMods = chainMods;
function getBaseDamage(level, basePower, attack, defense) {
    return Math.floor(OF32(Math.floor(OF32(OF32(Math.floor((2 * level) / 5 + 2) * basePower) * attack) / defense) / 50 + 2));
}
exports.getBaseDamage = getBaseDamage;
function getQPBoostedStat(pokemon, gen) {
    var e_4, _a;
    if (pokemon.boostedStat && pokemon.boostedStat !== 'auto') {
        return pokemon.boostedStat;
    }
    var bestStat = 'atk';
    try {
        for (var _b = __values(['def', 'spa', 'spd', 'spe']), _c = _b.next(); !_c.done; _c = _b.next()) {
            var stat = _c.value;
            if (getModifiedStat(pokemon.rawStats[stat], pokemon.boosts[stat], gen) >
                getModifiedStat(pokemon.rawStats[bestStat], pokemon.boosts[bestStat], gen)) {
                bestStat = stat;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return bestStat;
}
exports.getQPBoostedStat = getQPBoostedStat;
function isQPActive(pokemon, field) {
    if (!pokemon.boostedStat) {
        return false;
    }
    var weather = field.weather || '';
    var terrain = field.terrain;
    return ((pokemon.hasAbility('Protosynthesis') &&
        (weather.includes('Sun') || pokemon.hasItem('Booster Energy'))) ||
        (pokemon.hasAbility('Quark Drive') &&
            (terrain === 'Electric' || pokemon.hasItem('Booster Energy'))) ||
        (pokemon.boostedStat !== 'auto'));
}
exports.isQPActive = isQPActive;
function getFinalDamage(baseAmount, i, effectiveness, isBurned, stabMod, finalMod, protect) {
    var damageAmount = Math.floor(OF32(baseAmount * (85 + i)) / 100);
    if (stabMod !== 4096)
        damageAmount = OF32(damageAmount * stabMod) / 4096;
    damageAmount = Math.floor(OF32(pokeRound(damageAmount) * effectiveness));
    if (isBurned)
        damageAmount = Math.floor(damageAmount / 2);
    if (protect)
        damageAmount = pokeRound(OF32(damageAmount * 1024) / 4096);
    return OF16(pokeRound(Math.max(1, OF32(damageAmount * finalMod) / 4096)));
}
exports.getFinalDamage = getFinalDamage;
function getShellSideArmCategory(source, target) {
    var physicalDamage = source.stats.atk / target.stats.def;
    var specialDamage = source.stats.spa / target.stats.spd;
    return physicalDamage > specialDamage ? 'Physical' : 'Special';
}
exports.getShellSideArmCategory = getShellSideArmCategory;
function getWeightFactor(pokemon, field) {
    return (pokemon.hasAbility('Heavy Metal') && field.hasTerrain('Deep-Earth')) ? 4
        : (pokemon.hasAbility('Heavy Metal') || field.hasTerrain('Deep-Earth')) ? 2
            : (pokemon.hasAbility('Light Metal') || pokemon.hasItem('Float Stone')) ? 0.5 : 1;
}
exports.getWeightFactor = getWeightFactor;
function countBoosts(gen, boosts) {
    var e_5, _a;
    var sum = 0;
    var STATS = gen.num === 1
        ? ['atk', 'def', 'spa', 'spe']
        : ['atk', 'def', 'spa', 'spd', 'spe'];
    try {
        for (var STATS_1 = __values(STATS), STATS_1_1 = STATS_1.next(); !STATS_1_1.done; STATS_1_1 = STATS_1.next()) {
            var stat = STATS_1_1.value;
            var boost = boosts[stat];
            if (boost && boost > 0)
                sum += boost;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (STATS_1_1 && !STATS_1_1.done && (_a = STATS_1["return"])) _a.call(STATS_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return sum;
}
exports.countBoosts = countBoosts;
function getEVDescriptionText(gen, pokemon, stat, natureName) {
    var nature = gen.natures.get((0, util_1.toID)(natureName));
    return (pokemon.evs[stat] +
        (nature.plus === nature.minus ? ''
            : nature.plus === stat ? '+'
                : nature.minus === stat ? '-'
                    : '') + ' ' +
        stats_1.Stats.displayStat(stat));
}
exports.getEVDescriptionText = getEVDescriptionText;
function handleFixedDamageMoves(attacker, move, field) {
    if (move.named('Seismic Toss')) {
        return field.hasTerrain('Deep-Earth') ? attacker.level * 1.5 : attacker.level;
    }
    else if (move.named('Night Shade')) {
        return field.hasTerrain('Haunted') ? attacker.level * 1.5 : attacker.level;
    }
    else if (move.named('Dragon Rage')) {
        return field.hasTerrain('Dimensional') ? 140 : 40;
    }
    else if (move.named('Sonic Boom')) {
        return field.hasTerrain('Rainbow') ? 140 : 20;
    }
    return 0;
}
exports.handleFixedDamageMoves = handleFixedDamageMoves;
function pokeRound(num) {
    return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}
exports.pokeRound = pokeRound;
function OF16(n) {
    return n > 65535 ? n % 65536 : n;
}
exports.OF16 = OF16;
function OF32(n) {
    return n > 4294967295 ? n % 4294967296 : n;
}
exports.OF32 = OF32;
//# sourceMappingURL=util.js.map