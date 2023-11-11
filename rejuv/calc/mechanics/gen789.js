"use strict";
exports.__esModule = true;

var util_1 = require("../util");
var items_1 = require("../items");
var result_1 = require("../result");
var util_2 = require("./util");
function calculateSMSSSV(gen, attacker, defender, move, field) {
    (0, util_2.checkAirLock)(attacker, field);
    (0, util_2.checkAirLock)(defender, field);
    (0, util_2.checkTypeChanger)(attacker, field);
    (0, util_2.checkTypeChanger)(defender, field);
    (0, util_2.checkItem)(attacker, field.isMagicRoom);
    (0, util_2.checkItem)(defender, field.isMagicRoom);
    (0, util_2.checkWonderRoom)(attacker, field.isWonderRoom);
    (0, util_2.checkWonderRoom)(defender, field.isWonderRoom);
    (0, util_2.checkSeedBoost)(attacker, field);
    (0, util_2.checkSeedBoost)(defender, field);
    (0, util_2.checkDauntlessShield)(attacker, gen, field);
    (0, util_2.checkDauntlessShield)(defender, gen, field);
    (0, util_2.checkEmbody)(attacker, gen);
    (0, util_2.checkEmbody)(defender, gen);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'def', 'spd', 'spe');
    (0, util_2.checkIntimidate)(gen, attacker, defender);
    (0, util_2.checkIntimidate)(gen, defender, attacker);
    (0, util_2.checkDownload)(attacker, defender, field, field.isWonderRoom);
    (0, util_2.checkDownload)(defender, attacker, field, field.isWonderRoom);
    (0, util_2.checkIntrepidSword)(attacker, gen, field);
    (0, util_2.checkIntrepidSword)(defender, gen, field);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, 'atk', 'spa');
    (0, util_2.checkInfiltrator)(attacker, field.defenderSide);
    (0, util_2.checkInfiltrator)(defender, field.attackerSide);
    var desc = {
        attackerName: attacker.name,
        attackerTera: attacker.teraType,
        moveName: move.name,
        defenderName: defender.name,
        defenderTera: defender.teraType,
        isDefenderDynamaxed: defender.isDynamaxed,
        isWonderRoom: field.isWonderRoom
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status' && !move.named('Nature Power')) {
        return result;
    }
    var breaksProtect = move.breaksProtect || move.isZ || attacker.isDynamaxed ||
        (attacker.hasAbility('Unseen Fist') && move.flags.contact);
    if (field.defenderSide.isProtected && !breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    var defenderIgnoresAbility = defender.hasAbility('Full Metal Body', 'Neutralizing Gas', 'Prism Armor', 'Shadow Shield');
    var attackerIgnoresAbility = attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze', 'Propeller Tail');
    var moveIgnoresAbility = move.named('G-Max Drum Solo', 'G-Max Fire Ball', 'G-Max Hydrosnipe', 'Light That Burns the Sky', 'Menacing Moonraze Maelstrom', 'Moongeist Beam', 'Photon Geyser', 'Searing Sunraze Smash', 'Sunsteel Strike');
    if (!defenderIgnoresAbility && !defender.hasAbility('Poison Heal') &&
        (attackerIgnoresAbility || moveIgnoresAbility)) {
        if (attackerIgnoresAbility)
            desc.attackerAbility = attacker.ability;
        if (defender.hasItem('Ability Shield')) {
            desc.defenderItem = defender.item;
        }
        else {
            defender.ability = '';
        }
    }
    var isCritical = !defender.hasAbility('Battle Armor', 'Shell Armor') && (move.isCrit || (field.hasTerrain('Corrosive-Mist', 'Murkwater', 'Corrosive', 'Wasteland') && attacker.hasAbility("Merciless")) ||
        (attacker.hasAbility('Merciless') && defender.hasStatus('psn', 'tox')) || (attacker.hasAbility('Merciless') && field.hasTerrain('Chess') && (defender.curHP() <= defender.maxHP() * 0.4))
        || (defender.hasAbility('Rattled', 'Wimp Out') && field.hasTerrain('Colosseum'))) && move.timesUsed === 1;
    var type = move.type;
    if (move.named('Weather Ball')) {
        var holdingUmbrella = attacker.hasItem('Utility Umbrella');
        type =
            field.hasWeather('Sun', 'Harsh Sunshine') && !holdingUmbrella ? 'Fire'
                : field.hasWeather('Rain', 'Heavy Rain') && !holdingUmbrella ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail', 'Snow') ? 'Ice'
                            : field.hasWeather('Strong Winds') ? 'Flying'
                                : field.hasTerrain('Sky') ? 'Flying'
                                    : 'Normal';
        desc.weather = field.weather;
        desc.moveType = type;
    }
    else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
        type = (0, items_1.getItemBoostType)(attacker.item);
    }
    else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
        type = (0, items_1.getTechnoBlast)(attacker.item);
    }
    else if (move.named('Multi-Attack') && attacker.item && attacker.item.includes('Memory')) {
        type = (0, items_1.getMultiAttack)(attacker.item);
    }
    else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
        var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
        type = gift.t;
        desc.moveType = type;
        desc.attackerItem = attacker.item;
    }
    else if (move.named('Nature Power')) {
        type =
            field.hasTerrain('Back-Alley', 'Infernal', 'Dark-Crystal', 'Dimensional', 'Colosseum') ? 'Dark'
                : field.hasTerrain('Dragon-Den', 'New-World') ? 'Dragon'
                    : field.hasTerrain('Electric', 'Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2') ? 'Electric'
                        : field.hasTerrain('Icy', 'Frozen', 'Rainbow', 'Snowy-Mountain') ? 'Ice'
                            : field.hasTerrain('Starlight', 'Bewitched') ? 'Fairy'
                                : field.hasTerrain('Volcanic', 'Volcanic-Top') ? 'Fire'
                                    : field.hasTerrain('Rocky', 'Fairy-Tale') ? 'Fighting'
                                        : field.hasTerrain('Sky', 'Big-Top') ? 'Flying'
                                            : field.hasTerrain('Haunted') ? 'Ghost'
                                                : field.hasTerrain('Grassy', 'Forest', 'Flower-Garden-1', 'Flower-Garden-2', 'Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5') ? 'Grass'
                                                    : field.hasTerrain('Desert') ? 'Ground'
                                                        : field.hasTerrain('City', 'Corrosive-Mist', 'Murkwater', 'Corrupted', 'Corrosive', 'Wasteland') ? 'Poison'
                                                            : field.hasTerrain('Psychic', 'Misty', 'Inverse', 'Ashen-Beach', 'Deep-Earth') ? 'Psychic'
                                                                : field.hasTerrain('Crystal', 'Chess', 'Cave', 'Mountain') ? 'Rock'
                                                                    : field.hasTerrain('Factory', 'Mirror') ? 'Steel'
                                                                        : field.hasTerrain('Water', 'Underwater', 'Swamp') ? 'Water'
                                                                            : 'Normal';
        desc.terrain = field.terrain;
        desc.moveType = type;
    }
    else if (move.named('Terrain Pulse') && (0, util_2.isGrounded)(attacker, field)) {
        type =
            field.hasTerrain('Forest') ? 'Bug'
                : field.hasTerrain('Dark-Crystal', 'Dimensional', 'Starlight') ? 'Dark'
                    : field.hasTerrain('Dragon-Den', 'Rainbow') ? 'Dragon'
                        : field.hasTerrain('Electric', 'Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2') ? 'Electric'
                            : field.hasTerrain('Icy', 'Frozen', 'Snowy-Mountain') ? 'Ice'
                                : field.hasTerrain('Bewitched', 'Misty', 'Fairy-Tale') ? 'Fairy'
                                    : field.hasTerrain('Infernal', 'Volcanic', 'Volcanic-Top') ? 'Fire'
                                        : field.hasTerrain('Big-Top') ? 'Fighting'
                                            : field.hasTerrain('Sky') ? 'Flying'
                                                : field.hasTerrain('Haunted') ? 'Ghost'
                                                    : field.hasTerrain('Grassy', 'Flower-Garden-1', 'Flower-Garden-2', 'Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5') ? 'Grass'
                                                        : field.hasTerrain('Desert', 'Ashen-Beach', 'Deep-Earth') ? 'Ground'
                                                            : field.hasTerrain('Corrosive-Mist', 'Murkwater', 'Corrupted', 'Corrosive', 'Wasteland') ? 'Poison'
                                                                : field.hasTerrain('Psychic', 'Chess') ? 'Psychic'
                                                                    : field.hasTerrain('Cave', 'Mountain', 'Rocky') ? 'Rock'
                                                                        : field.hasTerrain('Back-Alley', 'Factory', 'Mirror', 'Colosseum') ? 'Steel'
                                                                            : field.hasTerrain('Water', 'Underwater', 'Swamp') ? 'Water'
                                                                                : field.hasTerrain('Glitch') ? '???'
                                                                                    : 'Normal';
        desc.terrain = field.terrain;
        desc.moveType = type;
    }
    else if (move.named('Revelation Dance')) {
        if (attacker.teraType) {
            type = attacker.teraType;
        }
        else {
            type = attacker.types[0];
        }
    }
    else if (move.named('Aura Wheel')) {
        if (attacker.named('Morpeko')) {
            type = 'Electric';
        }
        else if (attacker.named('Morpeko-Hangry')) {
            type = 'Dark';
        }
    }
    else if (move.named('Raging Bull')) {
        if (attacker.named('Tauros-Paldea-Combat')) {
            type = 'Fighting';
        }
        else if (attacker.named('Tauros-Paldea-Blaze')) {
            type = 'Fire';
        }
        else if (attacker.named('Tauros-Paldea-Aqua')) {
            type = 'Water';
        }
    }
    else if (move.named('Ivy Cudgel')) {
        if (attacker.name.includes('Ogerpon-Cornerstone')) {
            type = 'Rock';
        }
        else if (attacker.name.includes('Ogerpon-Hearthflame')) {
            type = 'Fire';
        }
        else if (attacker.name.includes('Ogerpon-Wellspring')) {
            type = 'Water';
        }
    }
    var hasAteAbilityTypeChange = false;
    var isAerilate = false;
    var isPixilate = false;
    var isRefrigerate = false;
    var isGalvanize = false;
    var isLiquidVoice = false;
    var isNormalize = false;
    var isGhostRevealed = attacker.hasAbility('Scrappy') || attacker.hasAbility('Mind\'s Eye') ||
        field.defenderSide.isForesight;
    var isRingTarget = defender.hasItem('Ring Target') && !defender.hasAbility('Klutz');
    var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget);
    var type2Effectiveness = defender.types[1]
        ? (0, util_2.getMoveEffectiveness)(gen, move, defender.types[1], isGhostRevealed, field.isGravity, isRingTarget)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    var noTypeChange = move.named('Revelation Dance', 'Judgment', 'Nature Power', 'Techno Blast', 'Multi Attack', 'Natural Gift', 'Weather Ball', 'Terrain Pulse', 'Struggle') || (move.named('Tera Blast') && attacker.teraType);
    if (!move.isZ && !noTypeChange) {
        var normal = move.hasType('Normal');
        if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
            type = 'Flying';
        }
        else if ((isGalvanize = attacker.hasAbility('Galvanize') && normal)) {
            type = 'Electric';
        }
        else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
            type = 'Water';
        }
        else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound) && field.hasTerrain('Icy')) {
            type = 'Ice';
        }
        else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
            type = 'Fairy';
        }
        else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
            type = 'Ice';
        }
        else if ((isNormalize = attacker.hasAbility('Normalize'))) {
            type = 'Normal';
        }
        if (isGalvanize || isPixilate || isRefrigerate || isAerilate || isNormalize) {
            desc.attackerAbility = attacker.ability;
            hasAteAbilityTypeChange = true;
        }
        else if (isLiquidVoice) {
            desc.attackerAbility = attacker.ability;
        }
    }
    if (move.named('Tera Blast') && attacker.teraType) {
        type = attacker.teraType;
    }
    move.type = type;
    if (move.named('Cut', 'Slash', 'Sacred Sword', 'Secret Sword', 'Nature Power') && field.hasTerrain('Fairy-Tale')) {
        move.type = 'Steel';
    }
    if (field.hasTerrain('Glitch') && move.hasType('Fairy')) {
        type = 'Normal';
    }
    move.type = type;
    if (field.hasTerrain('Glitch')) {
        if (move.hasType('Normal', 'Fighting', 'Ghost', 'Poison', 'Bug', 'Flying', 'Ground', 'Rock')) {
            move.category = 'Physical';
        }
        else {
            move.category = 'Special';
        }
    }
    var moveType = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] *
        (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
    var addedType;
    switch (field.terrain) {
        case 'Ashen-Beach':
            move.type = 'Fighting';
            addedType = gen.types.get('Psychic');
            if (move.named('Strength')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Back-Alley':
            addedType = gen.types.get('dark');
            if (move.named('First Impression')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Chess':
            addedType = gen.types.get('rock');
            if (move.named('Psychic', 'Strength', 'Barrage', 'Continental Crush', 'Secret Power', 'Shattered Psyche')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Back-Alley':
            addedType = gen.types.get('normal');
            if (move.named('First Impression')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Corrosive':
            addedType = gen.types.get('poison');
            if (move.named('Smack Down', 'Mud Slap', 'Mud Shot', 'Muddy Water', 'Mud Bomb', 'Whirlpool', 'Thousand Arrows', 'Apple Acid') || move.hasType('Grass')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Corrosive-Mist':
            addedType = gen.types.get('poison');
            if ((move.hasType('Flying') && (move.category === 'Special') || move.named('Bubble', 'Bubble Beam', 'Energy Ball', 'Sparkling Aria', 'Apple Acid'))) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Corrupted':
            addedType = gen.types.get('poison');
            if (move.named('Apple Acid', 'Rock Slide', 'Smack Down', 'Stone Edge', 'Rock Tomb', 'Diamond Storm')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Gunk Shot', 'Sludge Wave', 'Nature Power')) {
                addedType = gen.types.get('rock');
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Dragon-Den':
            addedType = gen.types.get('fire');
            if (move.named('Smack Down', 'Thousand Arrows', 'Earthquake')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Rock Climb', 'Strength')) {
                move.type = 'Rock';
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Electric':
            addedType = gen.types.get('electric');
            if (move.named('Explosion', 'Self Destruct', 'Surf', 'Hydro Vortex', 'Muddy Water', 'Hurricane', 'Smack Down', 'Thousand Arrows')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Fairy-Tale':
            addedType = gen.types.get('dragon');
            if (move.hasType('Fire')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Forest':
            addedType = gen.types.get('grass');
            if (move.named('Cut', 'Slash', 'Air Slash', 'Gale Strike', 'Fury Cutter', 'Air Cutter', 'Psycho Cut', ' Breaking Swipe')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Frozen':
            addedType = gen.types.get('ice');
            if (move.named('Surf', 'Muddy Water', 'Water Pulse', 'Hydro Pump', 'Night Slash', 'Dark Pulse')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Haunted':
            addedType = gen.types.get('ghost');
            if (move.named('Flame Burst', 'Inferno', 'Flame Charge', 'Fire Spin')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Icy':
            addedType = gen.types.get('ice');
            if (move.hasType('Rock')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Infernal':
            addedType = gen.types.get('fire');
            if (move.hasType('Ground', 'Rock', 'Steel')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Spirit Break', 'Aura Sphere', 'Frustration')) {
                addedType = gen.types.get('dark');
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Inverse':
            addedType = gen.types.get('psychic');
            if (move.named('Strength', 'Ancient Power', 'Dragon Pulse', 'Water Pulse')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Murkwater':
            addedType = gen.types.get('poison');
            if (move.hasType('Water') || move.named('Smack Down', 'Apple Acid')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Mud Bomb', 'Mud Shot', 'Mud Slap', 'Thousand Waves', 'Mud Barrage')) {
                move.type = 'Water';
                addedType = gen.types.get('poison');
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Sludge Wave')) {
                addedType = gen.types.get('water');
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'New-World':
            addedType = gen.types.get('fire');
            if (move.named('Doom Desire')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Rocky':
            addedType = gen.types.get('rock');
            if (move.named('Earthquake', 'Magnitude', 'Rock Climb', 'Strength', 'Bulldoze', 'Accelerock')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Sky':
            addedType = gen.types.get('flying');
            if (move.named('Dive', 'Twister')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Short-Circuit-0.5':
        case 'Short-Circuit-0.8':
        case 'Short-Circuit-1.2':
        case 'Short-Circuit-1.5':
        case 'Short-Circuit-2':
            addedType = gen.types.get('electric');
            if ((move.hasType('Steel') && attacker.hasAbility('Steelworker') ||
                move.named('Steel Beam', 'Surf', 'Muddy Water', 'Gyro Ball', 'Magnet Bomb', 'Gear Grind', 'Hydro Vortex'))) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Snowy-Mountain':
            addedType = gen.types.get('ice');
            if (move.hasType('Rock')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Starlight':
            addedType = gen.types.get('fairy');
            if (move.hasType('Dark') || move.named('Solar Blade', 'Solar Beam')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named('Doom Desire')) {
                addedType = gen.types.get('fire');
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Swamp':
            addedType = gen.types.get('water');
            if (move.named('Smack Down', 'Thousand Arrows')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Underwater':
            addedType = gen.types.get('water');
            if (move.hasType('Ground') || move.named('Grav Apple', 'Dragon Darts')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Volcanic':
            addedType = gen.types.get('fire');
            if (move.named('Smack Down', 'Thousand Arrows', 'Rock Slide', 'Smog', 'Clear Smog')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Volcanic-Top':
            addedType = gen.types.get('fire');
            if (move.hasType('Rock') || move.named('Explosion', 'Self-Destruct', 'Magnet Bomb', 'Egg Bomb', 'Dive', 'Seismic Toss', 'Dig', 'Egg Bomb', 'Ominous Wind', 'Silver Wind', 'Razor Wind', 'Icy Wind', 'Gust', 'Twister', 'Precipice Blades', 'Smog', 'Clear Smog', 'Magnet Bomb')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case 'Wasteland':
            addedType = gen.types.get('poison');
            if (move.named('Mud Bomb', 'Mud Slap', 'Mud Shot')) {
                typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] * (defender.types[1] ?
                    addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
    }
    if (field.hasTerrain('Underwater') && move.hasType('Water') && defender.hasType('Water')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Infernal') && move.hasType('Fire') && defender.hasType('Ghost')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Blessed') && move.hasType('Normal') && defender.hasType('Dark', 'Ghost')) {
        if (typeEffectiveness === 0) {
            typeEffectiveness = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] +
                (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
        }
        if (defender.hasType('Ghost')) {
            typeEffectiveness *= 2;
        }
        if (defender.hasType('Dark')) {
            typeEffectiveness *= 2;
        }
    }
    else if (field.hasTerrain('Blessed') && move.named('Spirit Break') && defender.hasType('Ghost')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Fairy-Tale') && move.hasType('Steel') && defender.hasType('Dragon')) {
        typeEffectiveness *= 2;
    }
    else if (field.hasTerrain('Inverse')) {
        typeEffectiveness = 1;
        if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] === 0) {
            typeEffectiveness *= 2;
        }
        else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] === 0.5) {
            typeEffectiveness *= 2;
        }
        else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] === 1) {
            typeEffectiveness *= 1;
        }
        else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] === 2) {
            typeEffectiveness *= 0.5;
        }
        if (defender.types[1] != undefined) {
            if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] === 0) {
                typeEffectiveness *= 2;
            }
            else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] === 0.5) {
                typeEffectiveness *= 2;
            }
            else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] === 1) {
                typeEffectiveness *= 1;
            }
            else if (gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] === 2) {
                typeEffectiveness *= 0.5;
            }
        }
    }
    else if (field.hasTerrain('Haunted') && move.hasType('Ghost') && defender.hasType('Normal')) {
        if (typeEffectiveness === 0) {
            typeEffectiveness = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] +
                (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
        }
        typeEffectiveness *= 1;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Haunted') && move.named('Spirit Break') && defender.hasType('Ghost')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Bewitched')) {
        if (move.hasType('Fairy') && defender.hasType('Steel')) {
            typeEffectiveness *= 4;
        }
        else if (move.hasType('Poison') && defender.hasType('Grass')) {
            typeEffectiveness /= 2;
        }
        else if (move.hasType('Dark') && defender.hasType('Fairy')) {
            typeEffectiveness *= 2;
        }
        else if (move.hasType('Fairy') && defender.hasType('Dark')) {
            typeEffectiveness /= 2;
        }
    }
    else if (field.hasTerrain('Cave') && move.hasType('Ground') && typeEffectiveness === 0) {
        typeEffectiveness = 1;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Flower-Garden-2', 'Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5') && defender.hasType('Grass') && move.named('Cut')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Sky') && move.named('Bonemerang') && defender.hasType('Flying')) {
        if (typeEffectiveness === 0) {
            typeEffectiveness = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] +
                (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
        }
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Sky') && attacker.hasAbility('Long Reach') && defender.hasType('Flying')) {
        typeEffectiveness *= 2;
    }
    else if (field.hasTerrain('Glitch')) {
        if (move.hasType('Bug') && defender.hasType('Poison')) {
            typeEffectiveness *= 4;
        }
        if (move.hasType('Poison') && defender.hasType('Bug')) {
            typeEffectiveness *= 2;
        }
        if (move.hasType('Ice') && defender.hasType('Fire')) {
            typeEffectiveness *= 2;
        }
        if (move.hasType('Dragon')) {
            if (typeEffectiveness === 0) {
                typeEffectiveness = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] +
                    (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
            }
            if (defender.hasType('Steel')) {
                typeEffectiveness *= 2;
            }
            if (defender.hasType('Dragon')) {
                typeEffectiveness /= 2;
            }
        }
        if (move.hasType('Ghost') && defender.hasType('Psychic')) {
            typeEffectiveness = 0;
        }
        if (move.hasType('Dark', 'Ghost') && defender.hasType('Steel')) {
            typeEffectiveness /= 2;
        }
    }
    else if (field.hasTerrain('Desert') && move.hasType('Water') && defender.hasType('Grass', 'Water') && field.hasWeather('Sun', 'Harsh Sunshine')) {
        typeEffectiveness *= 0;
    }
    else if (field.hasTerrain('Glitch') && defender.named('Genesect') && defender.item && defender.item.includes('Drive')) {
        var driveType = (0, items_1.getTechnoBlast)(defender.item);
        if (driveType === 'Electric' && move.hasType('Electric')) {
            typeEffectiveness *= 0;
        }
        else if (driveType === 'Fire' && move.hasType('Fire')) {
            typeEffectiveness *= 0;
        }
        else if (driveType === 'Ice' && move.hasType('Ice')) {
            typeEffectiveness *= 0;
        }
        else if (driveType === 'Water' && move.hasType('Water')) {
            typeEffectiveness *= 0;
        }
    }
    switch (attacker.item) {
        case 'Gothitelle Crest':
            if (attacker.named('Gothitelle')) {
                if (move.hasType('Dark')) {
                    attacker.types = ['Dark'];
                }
                else if (move.hasType('Psychic')) {
                    attacker.types = ['Psychic'];
                }
            }
            break;
        case 'Magcargo Crest':
            if (attacker.named('Magcargo')) {
                attacker.stats.spe = attacker.stats.def;
            }
            break;
        case 'Fearow Crest':
            if (attacker.named('Fearow') && move.named('Drill Peck', 'Drill Run', 'Megahorn')) {
                move.bp *= 1.5;
            }
            break;
        case 'Seviper Crest':
            if (attacker.named('Seviper')) {
                attacker.stats.spe *= 1.5;
            }
            break;
        case 'Dusknoir Crest':
            if (attacker.named('Dusknoir')) {
                if (move.bp <= 60) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Skuntank Crest':
            if (attacker.named('Skuntank')) {
                attacker.stats.spe *= 1.2;
            }
            break;
        case 'Claydol Crest':
            if (attacker.named('Claydol')) {
                attacker.stats.spa = attacker.stats.def;
                if (move.name.includes(' Beam')) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Dedenne Crest':
            if (attacker.named('Dedenne')) {
                attacker.stats.atk = attacker.stats.spe;
            }
            break;
        case 'Feraligatr Crest':
            if (attacker.named('Feraligatr')) {
                if (move.bp > 0) {
                    move.priority += 1;
                }
                if (move.flags.bite) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Ledian Crest':
            if (attacker.named('Ledian') && move.flags.punch) {
                move.bp *= 4;
            }
            break;
        case 'Ariados Crest':
            if (attacker.named('Ariados')) {
                attacker.stats.spe *= 1.5;
                if (defender.hasStatus('psn', 'tox') || defender.boosts['spe'] < 0) {
                    move.isCrit = true;
                }
            }
            break;
        case 'Infernape Crest':
            if (attacker.named('Infernape')) {
                attacker.stats.atk = attacker.stats.def;
            }
            break;
        case 'Empoleon Crest':
            if (attacker.named('Empoleon')) {
                if (move.hasType('Ice')) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Thievul Crest':
            if (attacker.named('Thievul')) {
                attacker.stats.spe *= 1.5;
            }
            break;
        case 'Probopass Crest':
            if (attacker.named('Probopass')) {
                move.bp += 60;
            }
            break;
        case 'Druddigon Crest':
            if (attacker.named('Druddigon')) {
                if (move.hasType('Fire')) {
                    move.bp *= 1.3;
                }
                if (move.hasType('Dragon')) {
                    move.bp *= 1.3;
                }
            }
            break;
        case 'Luxray Crest':
            if (attacker.named('Luxray')) {
                attacker.types = ['Electric', 'Dark'];
            }
            if (move.hasType('Normal')) {
                move.type = 'Electric';
            }
            break;
        case 'Boltund Crest':
            if (attacker.named('Boltund')) {
                if (attacker.stats.spe > defender.stats.spe && move.flags.bite) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Samurott Crest':
            if (attacker.named('Samurott')) {
                attacker.types = ['Water', 'Fighting'];
                if (move.flags.slicing) {
                    move.bp *= 1.5;
                }
            }
            break;
        case 'Reuniclus Crest':
            if (attacker.named('Reuniclus')) {
                if (move.hasType('Fighting')) {
                    attacker.types = ['Fighting'];
                    attacker.stats.atk = attacker.stats.spa;
                }
                else if (move.hasType('Psychic')) {
                    attacker.types = ['Psychic'];
                }
            }
            break;
        case 'Crabominable Crest':
            if (attacker.named('Crabominable') && attacker.stats.spe < defender.stats.spe) {
                move.bp *= 1.5;
            }
            break;
        case 'Simisear Crest':
            if (attacker.named('Simisear')) {
                attacker.types = ['Fire', 'Water'];
                if (move.hasType('Normal')) {
                    move.type = 'Water';
                }
            }
            break;
        case 'Simipour Crest':
            if (attacker.named('Simipour')) {
                attacker.types = ['Water', 'Grass'];
                if (move.hasType('Normal')) {
                    move.type = 'Grass';
                }
            }
            break;
        case 'Simisage Crest':
            if (attacker.named('Simisage')) {
                attacker.types = ['Grass', 'Fire'];
                if (move.hasType('Normal')) {
                    move.type = 'Fire';
                }
            }
            break;
        case 'Cryogonal Crest':
            if (defender.named('Cryogonal')) {
                defender.stats.spd *= 1.2;
                defender.stats.atk += defender.stats.spd * 0.1;
                defender.stats.spa += defender.stats.spd * 0.1;
                defender.stats.def += defender.stats.spd * 0.1;
                defender.stats.spe += defender.stats.spd * 0.1;
            }
            break;
    }
    switch (defender.item) {
        case 'Glaceon Crest':
            if (defender.named('Glaceon') && defender.hasItem('Glaceon Crest') && move.hasType('Rock', 'Fighting')) {
                typeEffectiveness /= 4;
            }
            break;
        case 'Leafeon Crest':
            if (defender.named('Leafeon') && defender.hasItem('Leafeon Crest') && move.hasType('Fire', 'Flying')) {
                typeEffectiveness /= 4;
            }
            break;
        case 'Skuntank Crest':
            if (defender.named('Skuntank')) {
                if (move.hasType('Ground')) {
                    move.bp *= 0;
                }
            }
            break;
        case 'Bastiodon Crest':
            if (defender.named('Bastiodon')) {
                move.recoil = [1, 2];
            }
            break;
        case 'Whiscash Crest':
            if (defender.named('Whiscash')) {
                if (move.hasType('Grass')) {
                    move.bp *= 0;
                }
            }
            break;
        case 'Torterra Crest':
            if (defender.named('Torterra')) {
                if (typeEffectiveness === 4) {
                    typeEffectiveness = 0.25;
                }
                else if (typeEffectiveness === 2) {
                    typeEffectiveness = 0.5;
                }
                else if (typeEffectiveness === 0.5) {
                    typeEffectiveness = 2;
                }
                else if (typeEffectiveness === 0.25) {
                    typeEffectiveness = 4;
                }
            }
            break;
        case 'Infernape Crest':
            if (defender.named('Infernape')) {
                defender.stats.def = defender.stats.atk;
            }
            break;
        case 'Cryogonal Crest':
            if (defender.named('Cryogonal')) {
                defender.stats.spd *= 1.2;
                defender.stats.atk += defender.stats.spd * 0.1;
                defender.stats.spa += defender.stats.spd * 0.1;
                defender.stats.def += defender.stats.spd * 0.1;
                defender.stats.spe += defender.stats.spd * 0.1;
            }
            break;
        case 'Druddigon Crest':
            if (defender.named('Druddigon')) {
                if (move.hasType('Fire')) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case 'Luxray Crest':
            if (defender.named('Luxray')) {
                defender.types = ['Electric', 'Dark'];
            }
            break;
        case 'Samurott Crest':
            if (defender.named('Samurott')) {
                defender.types = ['Water', 'Fighting'];
            }
            break;
        case 'A.Ampharos Crest':
            if (defender.named('Ampharos-Aevian')) {
                if (typeEffectiveness > 0) {
                    move.bp *= 0.7;
                }
            }
            break;
    }
    if ((attacker.hasAbility('Triage') && move.drain) ||
        (attacker.hasAbility('Gale Wings') && move.hasType('Flying') && field.hasTerrain('Volcanic-Top', 'Mountain', 'Snowy-Mountain') && field.hasWeather('Strong Winds')) ||
        (attacker.hasAbility('Gale Wings') && move.hasType('Flying') && field.hasTerrain('Sky')) ||
        (attacker.hasAbility('Gale Wings') && move.hasType('Flying') && attacker.curHP() === attacker.maxHP())) {
        move.priority = 1;
        desc.attackerAbility = attacker.ability;
    }
    if (defender.teraType) {
        typeEffectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.teraType, isGhostRevealed, field.isGravity, isRingTarget);
    }
    if (typeEffectiveness === 0 && move.hasType('Ground') &&
        defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz')) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0 && move.named('Thousand Arrows') || (attacker.hasAbility('Teravolt') && move.hasType('Electric') && field.hasTerrain('Electric'))) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0) {
        return result;
    }
    if ((move.named('Sky Drop') &&
        (defender.hasType('Flying') || defender.weightkg >= 200 || field.isGravity)) ||
        (move.named('Synchronoise') && !defender.hasType(attacker.types[0]) &&
            (!attacker.types[1] || !defender.hasType(attacker.types[1]))) ||
        (move.named('Dream Eater') &&
            (!(defender.hasStatus('slp') || defender.hasAbility('Comatose')))) ||
        (move.named('Steel Roller') && !field.terrain) ||
        (move.named('Poltergeist') && (!defender.item || (0, util_2.isQPActive)(defender, field)))) {
        return result;
    }
    if ((field.hasWeather('Harsh Sunshine') && move.hasType('Water')) ||
        (field.hasWeather('Heavy Rain') && move.hasType('Fire'))) {
        desc.weather = field.weather;
        return result;
    }
    if (field.hasWeather('Strong Winds') && defender.hasType('Flying') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Flying'] > 1) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    else if (field.hasTerrain('Bewitched') && defender.hasType('Fairy') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Fairy'] > 1 && defender.hasAbility('Pastel Veil')) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    else if (field.hasTerrain('Snowy-Mountain') && defender.hasType('Ice') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Ice'] > 1 && defender.hasAbility('Ice Scales')) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    else if (field.hasTerrain('Sky') && move.named('Flying Press') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Flying'] < 1) {
        typeEffectiveness *= 2;
    }
    else if (field.hasTerrain('Dragon-Den') && defender.hasType('Dragon') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Dragon'] > 1 && defender.hasAbility('Multiscale')) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    else if (field.hasTerrain('Flower-Garden-4', 'Flower-Garden-5') && defender.hasType('Grass') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Grass'] > 1) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    if ((defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
        (move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
        (move.hasType('Fire') && defender.hasAbility('Flash Fire', 'Well-Baked Body')) ||
        (move.hasType('Fire') && defender.hasAbility('Magma Armor') && field.hasTerrain('Dragon-Den', 'Infernal')) ||
        (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb')) ||
        (move.hasType('Electric') && defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
        (move.hasType('Ground') && !field.isGravity && !move.named('Thousand Arrows') && !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
        (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
        (move.flags.sound && !move.named('Clangorous Soul') && defender.hasAbility('Soundproof')) ||
        (move.priority > 0 && defender.hasAbility('Queenly Majesty', 'Dazzling', 'Armor Tail')) ||
        (move.hasType('Ground') && defender.hasAbility('Earth Eater')) ||
        (move.flags.wind && defender.hasAbility('Wind Rider')) ||
        (move.priority > 0 && field.hasTerrain('Starlight') && defender.hasAbility('Mirror Armor'))) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    if (move.hasType('Ground') && !move.named('Thousand Arrows') &&
        !field.isGravity && defender.hasItem('Air Balloon')) {
        desc.defenderItem = defender.item;
        return result;
    }
    var weightBasedMove = move.named('Heat Crash', 'Heavy Slam', 'Low Kick', 'Grass Knot');
    if (defender.isDynamaxed && weightBasedMove) {
        return result;
    }
    desc.HPEVs = "".concat(defender.evs.hp, " HP");
    var fixedDamage = (0, util_2.handleFixedDamageMoves)(attacker, move, field);
    if (fixedDamage) {
        if (attacker.hasAbility('Parental Bond')) {
            result.damage = [fixedDamage, fixedDamage];
            desc.attackerAbility = attacker.ability;
        }
        else {
            result.damage = fixedDamage;
        }
        return result;
    }
    if (move.named('Final Gambit')) {
        result.damage = attacker.curHP();
        return result;
    }
    if (move.named('Guardian of Alola')) {
        var zLostHP = Math.floor((defender.curHP() * 3) / 4);
        if (field.defenderSide.isProtected && attacker.item && attacker.item.includes(' Z')) {
            zLostHP = Math.ceil(zLostHP / 4 - 0.5);
        }
        result.damage = zLostHP;
        return result;
    }
    if (move.named('Nature\'s Madness')) {
        var lostHP = 0;
        if (field.hasTerrain('Grassy', 'New-World', 'Forest')) {
            lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.75);
        }
        else if (field.hasTerrain('Blessed')) {
            lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.66);
        }
        else {
            lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.5);
        }
        result.damage = lostHP;
        return result;
    }
    if (move.named('Gravity') && field.hasTerrain('Deep-Earth')) {
        move.target = 'allAdjacent';
        result.damage = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.5);
        return result;
    }
    if (defender.hasStatus('slp') && field.hasTerrain('Concert-H', 'Concert-SH')) {
        var lostHPhyped = 0;
        lostHPhyped = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.25);
        result.damage = lostHPhyped;
        return result;
    }
    if (move.named('Spectral Thief')) {
        var stat = void 0;
        for (stat in defender.boosts) {
            if (defender.boosts[stat] > 0) {
                attacker.boosts[stat] +=
                    attacker.hasAbility('Contrary') ? -defender.boosts[stat] : defender.boosts[stat];
                if (attacker.boosts[stat] > 6)
                    attacker.boosts[stat] = 6;
                if (attacker.boosts[stat] < -6)
                    attacker.boosts[stat] = -6;
                attacker.stats[stat] = (0, util_2.getModifiedStat)(attacker.rawStats[stat], attacker.boosts[stat]);
                defender.boosts[stat] = 0;
                defender.stats[stat] = defender.rawStats[stat];
            }
        }
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower = calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
    if (basePower === 0) {
        return result;
    }
    var attack = calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var attackSource = move.named('Foul Play') ? defender : attacker;
    if (move.named('Photon Geyser', 'Light That Burns The Sky') ||
        (move.named('Tera Blast') && attackSource.teraType)) {
        move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
    }
    var attackStat = move.named('Shell Side Arm') && (0, util_2.getShellSideArmCategory)(attacker, defender) === 'Physical' ? 'atk'
        : move.named('Body Press') ? 'def'
            : field.hasTerrain('Glitch') && move.category === 'Special' && attackSource.stats.spa < attackSource.stats.spd ? 'spd'
                : move.category === 'Special' ? 'spa'
                    : 'atk';
    var defense = calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
        (move.named('Shell Side Arm') && (0, util_2.getShellSideArmCategory)(attacker, defender) === 'Physical');
    var defenseStat = hitsPhysical ? 'def'
        : !hitsPhysical && field.hasTerrain('Glitch') && defender.stats.spa > defender.stats.spd ? 'spa'
            : 'spd';
    var baseDamage = calculateBaseDamageSMSSSV(gen, attacker, defender, basePower, attack, defense, move, field, desc, isCritical);
    var stabMod = 4096;
    if (attacker.hasOriginalType(move.type)) {
        stabMod += 2048;
    }
    else if (attacker.hasAbility('Protean', 'Libero') && !attacker.teraType) {
        stabMod += 2048;
        desc.attackerAbility = attacker.ability;
    }
    var teraType = attacker.teraType;
    if (teraType === move.type) {
        stabMod += 2048;
        desc.attackerTera = teraType;
    }
    if (attacker.hasAbility('Adaptability') && attacker.hasType(move.type)) {
        stabMod += teraType && attacker.hasOriginalType(teraType) ? 1024 : 2048;
        desc.attackerAbility = attacker.ability;
    }
    var applyBurn = attacker.hasStatus('brn') &&
        move.category === 'Physical' &&
        !attacker.hasAbility('Guts') &&
        !move.named('Facade');
    desc.isBurned = applyBurn;
    var finalMods = calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness);
    var protect = false;
    if (field.defenderSide.isProtected &&
        (attacker.isDynamaxed || (move.isZ && attacker.item && attacker.item.includes(' Z')))) {
        protect = true;
        desc.isProtected = true;
    }
    var finalMod = (0, util_2.chainMods)(finalMods, 41, 131072);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    var childDamage;
    if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Parental Bond (Child)';
        (0, util_2.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateSMSSSV(gen, child, defender, move, field).damage;
        desc.attackerAbility = attacker.ability;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        if (field.hasTerrain('Concert-NH')) {
            damage[i] =
                (0, util_2.getFinalDamage)(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
            i = 16;
        }
        damage[i] =
            (0, util_2.getFinalDamage)(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
    }
    if (move.dropsStats && move.timesUsed > 1) {
        var simpleMultiplier = attacker.hasAbility('Simple') ? 2 : 1;
        desc.moveTurns = "over ".concat(move.timesUsed, " turns");
        var hasWhiteHerb = attacker.hasItem('White Herb');
        var usedWhiteHerb = false;
        var dropCount = 0;
        var _loop_1 = function (times) {
            var newAttack = (0, util_2.getModifiedStat)(attack, dropCount);
            var damageMultiplier = 0;
            damage = damage.map(function (affectedAmount) {
                if (times) {
                    var newBaseDamage = (0, util_2.getBaseDamage)(attacker.level, basePower, newAttack, defense);
                    var newFinalDamage = (0, util_2.getFinalDamage)(newBaseDamage, damageMultiplier, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
                    damageMultiplier++;
                    return affectedAmount + newFinalDamage;
                }
                return affectedAmount;
            });
            if (attacker.hasAbility('Contrary')) {
                dropCount = Math.min(6, dropCount + move.dropsStats);
                desc.attackerAbility = attacker.ability;
            }
            else {
                dropCount = Math.max(-6, dropCount - move.dropsStats * simpleMultiplier);
                if (attacker.hasAbility('Simple')) {
                    desc.attackerAbility = attacker.ability;
                }
            }
            if (hasWhiteHerb && attacker.boosts[attackStat] < 0 && !usedWhiteHerb) {
                dropCount += move.dropsStats * simpleMultiplier;
                usedWhiteHerb = true;
                desc.attackerItem = attacker.item;
            }
        };
        for (var times = 0; times < move.timesUsed; times++) {
            _loop_1(times);
        }
    }
    if (move.hits > 1) {
        var defenderDefBoost = 0;
        var _loop_2 = function (times) {
            var newDefense = (0, util_2.getModifiedStat)(defense, defenderDefBoost);
            var damageMultiplier = 0;
            damage = damage.map(function (affectedAmount) {
                if (times) {
                    var newFinalMods = calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, times);
                    var newFinalMod = (0, util_2.chainMods)(newFinalMods, 41, 131072);
                    var newBaseDamage = calculateBaseDamageSMSSSV(gen, attacker, defender, basePower, attack, newDefense, move, field, desc, isCritical);
                    var newFinalDamage = (0, util_2.getFinalDamage)(newBaseDamage, damageMultiplier, typeEffectiveness, applyBurn, stabMod, newFinalMod, protect);
                    damageMultiplier++;
                    return affectedAmount + newFinalDamage;
                }
                return affectedAmount;
            });
            if (hitsPhysical && defender.ability === 'Stamina') {
                defenderDefBoost = Math.min(6, defenderDefBoost + 1);
                desc.defenderAbility = 'Stamina';
            }
            else if (hitsPhysical && defender.ability === 'Weak Armor') {
                defenderDefBoost = Math.max(-6, defenderDefBoost - 1);
                desc.defenderAbility = 'Weak Armor';
            }
        };
        for (var times = 0; times < move.hits; times++) {
            _loop_2(times);
        }
    }
    desc.attackBoost =
        move.named('Foul Play') ? defender.boosts[attackStat] : attacker.boosts[attackStat];
    result.damage = childDamage ? [damage, childDamage] : damage;
    if (field.hasTerrain('Corrosive-Mist') && move.named('Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive', 'Explosion', 'Self-Destruct')) {
        var lostHP_1 = 0;
        if (defender.hasAbility('Flash Fire') || field.defenderSide.isProtected) {
            return result;
        }
        else if (defender.hasAbility('Sturdy') && defender.curHP() == defender.maxHP()) {
            lostHP_1 = defender.maxHP();
            result.damage = lostHP_1 - 1;
            return result;
        }
        else {
            lostHP_1 = defender.maxHP();
            result.damage = lostHP_1;
            return result;
        }
    }
    if (field.hasTerrain('Big-Top') && (move.named('Blaze Kick', 'Body Slam', 'Bounce', 'Brutal Swing', 'Bulldoze', 'Crabhammer', 'Dragon Hammer', 'Dragon Rush', 'Dual Chop', 'Earthquake', 'Giga Impact', 'Heat Crash', 'Heavy Slam', 'High Horsepower', 'Ice Hammer', 'Icicle Crash', 'Iron Tail', 'Magnitude', 'Meteor Mash', 'Pound', 'Sky Drop', 'Smack Down', 'Stomp', 'Stomping Tantrum', 'Strength', 'Wood Hammer') || (move.hasType('Fighting') && move.category == 'Physical'))) {
        if (move.named('Magnitude')) {
            var lostHP4Weak = damage.map(function (num) { return Math.floor(num * 0.5); });
            var lostHP4OK = damage;
            var lostHP4Nice = damage.map(function (num) { return Math.floor(num * 1.5); });
            var lostHP4Pow = damage.map(function (num) { return Math.floor(num * 2); });
            var lostHP4Over = damage.map(function (num) { return Math.floor(num * 3); });
            var lostHP5Weak = damage.map(function (num) { return Math.floor(num * 3 * 0.5); });
            var lostHP5OK = damage.map(function (num) { return Math.floor(num * 3); });
            var lostHP5Nice = damage.map(function (num) { return Math.floor(num * 3 * 1.5); });
            var lostHP5Pow = damage.map(function (num) { return Math.floor(num * 3 * 2); });
            var lostHP5Over = damage.map(function (num) { return Math.floor(num * 3 * 3); });
            var lostHP6Weak = damage.map(function (num) { return Math.floor(num * 5 * 0.5); });
            var lostHP6OK = damage.map(function (num) { return Math.floor(num * 5); });
            var lostHP6Nice = damage.map(function (num) { return Math.floor(num * 5 * 1.5); });
            var lostHP6Pow = damage.map(function (num) { return Math.floor(num * 5 * 2); });
            var lostHP6Over = damage.map(function (num) { return Math.floor(num * 5 * 3); });
            var lostHP7Weak = damage.map(function (num) { return Math.floor(num * 7 * 0.5); });
            var lostHP7OK = damage.map(function (num) { return Math.floor(num * 7); });
            var lostHP7Nice = damage.map(function (num) { return Math.floor(num * 7 * 1.5); });
            var lostHP7Pow = damage.map(function (num) { return Math.floor(num * 7 * 2); });
            var lostHP7Over = damage.map(function (num) { return Math.floor(num * 7 * 3); });
            var lostHP8Weak = damage.map(function (num) { return Math.floor(num * 9 * 0.5); });
            var lostHP8OK = damage.map(function (num) { return Math.floor(num * 9); });
            var lostHP8Nice = damage.map(function (num) { return Math.floor(num * 9 * 1.5); });
            var lostHP8Pow = damage.map(function (num) { return Math.floor(num * 9 * 2); });
            var lostHP8Over = damage.map(function (num) { return Math.floor(num * 9 * 3); });
            var lostHP9Weak = damage.map(function (num) { return Math.floor(num * 11 * 0.5); });
            var lostHP9OK = damage.map(function (num) { return Math.floor(num * 11); });
            var lostHP9Nice = damage.map(function (num) { return Math.floor(num * 11 * 1.5); });
            var lostHP9Pow = damage.map(function (num) { return Math.floor(num * 11 * 2); });
            var lostHP9Over = damage.map(function (num) { return Math.floor(num * 11 * 3); });
            var lostHP10Weak = damage.map(function (num) { return Math.floor(num * 15 * 0.5); });
            var lostHP10OK = damage.map(function (num) { return Math.floor(num * 15); });
            var lostHP10Nice = damage.map(function (num) { return Math.floor(num * 15 * 1.5); });
            var lostHP10Pow = damage.map(function (num) { return Math.floor(num * 15 * 2); });
            var lostHP10Over = damage.map(function (num) { return Math.floor(num * 15 * 3); });
            if (attacker.hasAbility('Guts', 'Sheer Force', 'Huge Power', 'Pure Power')) {
                if (attacker.boosts[attackStat] > 0) {
                    result.damage = lostHP4Over.concat(lostHP5Over, lostHP6Over, lostHP7Over, lostHP8Over, lostHP9Over, lostHP10Over);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == 0) {
                    result.damage = lostHP4Pow.concat(lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow, lostHP4Over, lostHP5Over, lostHP6Over, lostHP7Over, lostHP8Over, lostHP9Over, lostHP10Over);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -1) {
                    result.damage = lostHP4Pow.concat(lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -2) {
                    result.damage = lostHP4Nice.concat(lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice, lostHP4Pow, lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] <= -3 && attacker.boosts[attackStat] >= -5) {
                    result.damage = lostHP4Nice.concat(lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -6) {
                    result.damage = lostHP4OK.concat(lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice);
                    result.damage.sort(function (a, b) { return a - b; });
                }
            }
            else {
                if (attacker.boosts[attackStat] == 0) {
                    result.damage = lostHP4Weak.concat(lostHP5Weak, lostHP6Weak, lostHP7Weak, lostHP8Weak, lostHP9Weak, lostHP10Weak, lostHP4OK, lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice, lostHP4Pow, lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == 1) {
                    result.damage = lostHP4Weak.concat(lostHP5Weak, lostHP6Weak, lostHP7Weak, lostHP8Weak, lostHP9Weak, lostHP10Weak, lostHP4OK, lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice, lostHP4Pow, lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow, lostHP4Over, lostHP5Over, lostHP6Over, lostHP7Over, lostHP8Over, lostHP9Over, lostHP10Over);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] > 1) {
                    result.damage = lostHP4OK.concat(lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice, lostHP4Pow, lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow, lostHP4Over, lostHP5Over, lostHP6Over, lostHP7Over, lostHP8Over, lostHP9Over, lostHP10Over);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -1) {
                    result.damage = lostHP4Weak.concat(lostHP5Weak, lostHP6Weak, lostHP7Weak, lostHP8Weak, lostHP9Weak, lostHP10Weak, lostHP4OK, lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice, lostHP4Pow, lostHP5Pow, lostHP6Pow, lostHP7Pow, lostHP8Pow, lostHP9Pow, lostHP10Pow);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] <= -2 && attacker.boosts[attackStat] >= -5) {
                    result.damage = lostHP4Weak.concat(lostHP5Weak, lostHP6Weak, lostHP7Weak, lostHP8Weak, lostHP9Weak, lostHP10Weak, lostHP4OK, lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK, lostHP4Nice, lostHP5Nice, lostHP6Nice, lostHP7Nice, lostHP8Nice, lostHP9Nice, lostHP10Nice);
                    result.damage.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -6) {
                    result.damage = lostHP4Weak.concat(lostHP5Weak, lostHP6Weak, lostHP7Weak, lostHP8Weak, lostHP9Weak, lostHP10Weak, lostHP4OK, lostHP5OK, lostHP6OK, lostHP7OK, lostHP8OK, lostHP9OK, lostHP10OK);
                    result.damage.sort(function (a, b) { return a - b; });
                }
            }
            return result;
        }
        else {
            var lostHPWeak = damage.map(function (num) { return Math.floor(num * 0.5); });
            var lostHPOK = damage;
            var lostHPNice = damage.map(function (num) { return Math.floor(num * 1.5); });
            var lostHPPow = damage.map(function (num) { return Math.floor(num * 2); });
            var lostHPOver = damage.map(function (num) { return Math.floor(num * 3); });
            if (attacker.hasAbility('Guts', 'Sheer Force', 'Huge Power', 'Pure Power')) {
                if (attacker.boosts[attackStat] > 0) {
                    result.damage = lostHPOver;
                    exports.strikerdmg = lostHPOver;
                }
                else if (attacker.boosts[attackStat] == 0) {
                    result.damage = lostHPPow.concat(lostHPOver);
                    exports.strikerdmg = lostHPPow.concat(lostHPPow, lostHPPow, lostHPPow, lostHPOver, lostHPOver, lostHPOver);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == -1) {
                    result.damage = lostHPPow;
                    exports.strikerdmg = lostHPPow;
                }
                else if (attacker.boosts[attackStat] == -2) {
                    result.damage = lostHPNice.concat(lostHPPow);
                    exports.strikerdmg = lostHPNice.concat(lostHPNice, lostHPNice, lostHPNice, lostHPPow, lostHPPow, lostHPPow);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] <= -3 && attacker.boosts[attackStat] >= -5) {
                    result.damage = lostHPNice;
                    exports.strikerdmg = lostHPNice;
                }
                else if (attacker.boosts[attackStat] == -6) {
                    result.damage = lostHPOK.concat(lostHPNice);
                    exports.strikerdmg = lostHPOK.concat(lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
            }
            else {
                if (attacker.boosts[attackStat] == 0) {
                    result.damage = lostHPWeak.concat(lostHPOK, lostHPNice, lostHPPow);
                    exports.strikerdmg = lostHPWeak.concat(lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPPow);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] == 1) {
                    result.damage = lostHPWeak.concat(lostHPOK, lostHPNice, lostHPPow, lostHPOver);
                    exports.strikerdmg = lostHPWeak.concat(lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice, lostHPNice, lostHPPow, lostHPPow, lostHPOver);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] > 1) {
                    result.damage = lostHPOK.concat(lostHPNice, lostHPPow, lostHPOver);
                    if (attacker.boosts[attackStat] == 2) {
                        exports.strikerdmg = lostHPOK.concat(lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPPow, lostHPOver);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == 3) {
                        exports.strikerdmg = lostHPOK.concat(lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice, lostHPNice, lostHPPow, lostHPPow, lostHPOver, lostHPOver, lostHPOver);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == 4) {
                        exports.strikerdmg = lostHPOK.concat(lostHPOK, lostHPNice, lostHPNice, lostHPPow, lostHPOver, lostHPOver);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == 5) {
                        exports.strikerdmg = lostHPOK.concat(lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice, lostHPNice, lostHPPow, lostHPPow, lostHPOver, lostHPOver, lostHPOver, lostHPOver, lostHPOver);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == 6) {
                        exports.strikerdmg = lostHPOK.concat(lostHPNice, lostHPNice, lostHPPow, lostHPOver, lostHPOver, lostHPOver);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                }
                else if (attacker.boosts[attackStat] == -1) {
                    result.damage = lostHPWeak.concat(lostHPOK, lostHPNice, lostHPPow);
                    exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPWeak, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice, lostHPNice, lostHPPow);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
                else if (attacker.boosts[attackStat] <= -2 && attacker.boosts[attackStat] >= -5) {
                    result.damage = lostHPWeak.concat(lostHPOK, lostHPNice);
                    if (attacker.boosts[attackStat] == -2) {
                        exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == -3) {
                        exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice, lostHPNice);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == -4) {
                        exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice, lostHPNice);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                    else if (attacker.boosts[attackStat] == -5) {
                        exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPWeak, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPOK, lostHPNice);
                        exports.strikerdmg.sort(function (a, b) { return a - b; });
                    }
                }
                else if (attacker.boosts[attackStat] == -6) {
                    result.damage = lostHPWeak.concat(lostHPOK);
                    exports.strikerdmg = lostHPWeak.concat(lostHPWeak, lostHPWeak, lostHPWeak, lostHPOK, lostHPOK, lostHPOK);
                    exports.strikerdmg.sort(function (a, b) { return a - b; });
                }
            }
            return result;
        }
    }
    if (move.named('Magnitude') && !(field.hasTerrain('Concert-NH', 'Concert-SH'))) {
        var lostHP4 = damage;
        var lostHP5 = damage.map(function (num) { return Math.floor(num * 3); });
        var lostHP6 = damage.map(function (num) { return Math.floor(num * 5); });
        var lostHP7 = damage.map(function (num) { return Math.floor(num * 7); });
        var lostHP8 = damage.map(function (num) { return Math.floor(num * 9); });
        var lostHP9 = damage.map(function (num) { return Math.floor(num * 11); });
        var lostHP10 = damage.map(function (num) { return Math.floor(num * 15); });
        result.damage = lostHP4.concat(lostHP5, lostHP6, lostHP7, lostHP8, lostHP9, lostHP10);
        exports.magdmg = lostHP4.concat(lostHP5, lostHP5, lostHP6, lostHP6, lostHP6, lostHP6, lostHP7, lostHP7, lostHP7, lostHP7, lostHP7, lostHP7, lostHP8, lostHP8, lostHP8, lostHP8, lostHP9, lostHP9, lostHP10);
        exports.magdmg.sort(function (a, b) { return a - b; });
        return result;
    }
    return result;
}
exports.calculateSMSSSV = calculateSMSSSV;
function calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc) {
    var _a;
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower;
    switch (move.name) {
        case 'Payback':
            basePower = move.bp * (turnOrder === 'last' || field.hasTerrain('Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Bolt Beak':
        case 'Fishious Rend':
            basePower = move.bp * (turnOrder !== 'last' || field.hasTerrain('Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Pursuit':
            var switching = field.defenderSide.isSwitching === 'out';
            basePower = move.bp * (switching || field.hasTerrain('Concert-SH') ? 2 : 1);
            if (switching)
                desc.isSwitching = 'out';
            desc.moveBP = basePower;
            break;
        case 'Electro Ball':
            var r = Math.floor(attacker.stats.spe / defender.stats.spe);
            basePower = r >= 4 || field.hasTerrain('Concert-SH') ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            if (defender.stats.spe === 0)
                basePower = 40;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
            if (attacker.stats.spe === 0)
                basePower = 1;
            if (field.hasTerrain('Concert-SH')) {
                basePower = 150;
            }
            desc.moveBP = basePower;
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_2.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            if (field.hasTerrain('Concert-SH')) {
                basePower = 180;
            }
            break;
        case 'Low Kick':
        case 'Grass Knot':
        case 'Topsy Turby':
            if (field.hasTerrain('Deep-Earth') && move.named('Topsy Turby')) {
                move.category = 'Special';
                move.type = 'Ground';
            }
            var w = defender.weightkg * (0, util_2.getWeightFactor)(defender, field);
            basePower = w >= 200 || field.hasTerrain('Concert-SH') ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Hex':
            basePower = move.bp * (defender.status || defender.hasAbility('Comatose' || field.hasTerrain('Infernal', 'Concert-SH')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Infernal Parade':
            basePower = move.bp * (defender.status || defender.hasAbility('Comatose') || field.hasTerrain('Haunted', 'Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Barb Barrage':
            basePower = move.bp * ((defender.hasStatus('psn', 'tox') || field.hasTerrain('Corrosive', 'Corrosive-Mist', 'Murkwater', 'Wasteland', 'Concert-SH')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var wr = (attacker.weightkg * (0, util_2.getWeightFactor)(attacker, field)) /
                (defender.weightkg * (0, util_2.getWeightFactor)(defender, field));
            basePower = wr >= 5 || field.hasTerrain('Concert-SH') ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Stored Power':
        case 'Power Trip':
            basePower = field.hasTerrain('Frozen') ? 20 + 40 * (0, util_2.countBoosts)(gen, attacker.boosts) : 20 + 20 * (0, util_2.countBoosts)(gen, attacker.boosts);
            desc.moveBP = basePower;
            break;
        case 'Acrobatics':
            basePower = move.bp * (attacker.hasItem('Flying Gem') ||
                (!attacker.item || (0, util_2.isQPActive)(attacker, field)) || field.hasTerrain('Big-Top', 'Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Assurance':
            basePower = move.bp * ((defender.hasAbility('Parental Bond (Child)') || field.hasTerrain('Concert-SH')) ? 2 : 1);
            break;
        case 'Wake-Up Slap':
            basePower = move.bp * (defender.hasStatus('slp') || defender.hasAbility('Comatose') || field.hasTerrain('Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Smelling Salts':
            basePower = move.bp * ((defender.hasStatus('par') || field.hasTerrain('Concert-SH')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather && (!field.hasWeather('Strong Winds') || field.hasTerrain('Concert-SH') || (field.hasWeather('Strong Winds') && field.hasTerrain('Sky'))) ? 2 : 1);
            if (field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain') &&
                attacker.hasItem('Utility Umbrella'))
                basePower = move.bp;
            desc.moveBP = basePower;
            break;
        case 'Terrain Pulse':
            basePower = move.bp * (((0, util_2.isGrounded)(attacker, field) && field.terrain) || field.hasTerrain('Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Rising Voltage':
            basePower = move.bp * (((0, util_2.isGrounded)(defender, field) && field.hasTerrain('Electric')) || field.hasTerrain('Concert-SH') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Psyblade':
            basePower = move.bp * (field.hasTerrain('Electric') || field.hasTerrain('Concert-SH') ? 1.5 : 1);
            if (field.hasTerrain('Electric')) {
                desc.moveBP = basePower;
                desc.terrain = field.terrain;
            }
            break;
        case 'Fling':
            basePower = (0, items_1.getFlingPower)(attacker.item);
            desc.moveBP = basePower;
            desc.attackerItem = attacker.item;
            break;
        case 'Dragon Energy':
        case 'Eruption':
        case 'Water Spout':
            basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
            if (field.hasTerrain('Concert-SH')) {
                basePower = 150;
            }
            desc.moveBP = basePower;
            break;
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 || field.hasTerrain('Concert-SH') ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Natural Gift':
            if ((_a = attacker.item) === null || _a === void 0 ? void 0 : _a.includes('Berry')) {
                var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
                basePower = gift.p;
                desc.attackerItem = attacker.item;
                desc.moveBP = move.bp;
            }
            else {
                basePower = move.bp;
            }
            break;
        case 'Nature Power':
            move.category = 'Special';
            move.secondaries = true;
            switch (field.terrain) {
                case 'Ashen-Beach':
                    move.category = 'Status';
                    basePower = 0;
                    desc.moveName = 'Meditate';
                    break;
                case 'Bewitched':
                    basePower = 80;
                    desc.moveName = 'Dazzling Gleam';
                    break;
                case 'Big-Top':
                    move.category = 'Physical';
                    basePower = 110;
                    desc.moveName = 'Acrobatics';
                    break;
                case 'Blessed':
                    basePower = 100;
                    desc.moveName = 'Judgment';
                    break;
                case 'Cave':
                    move.category = 'Physical';
                    basePower = 60;
                    desc.moveName = 'Rock Tomb';
                    break;
                case 'Chess':
                    basePower = 60;
                    desc.moveName = 'Ancient Power';
                    break;
                case 'Back-Alley':
                case 'Colosseum':
                    move.category = 'Physical';
                    basePower = 0;
                    desc.moveName = 'Beat Up';
                    break;
                case 'City':
                    basePower = 30;
                    desc.moveName = 'Smog';
                    break;
                case 'Concert-NH':
                case 'Concert-LH':
                case 'Concert-H':
                case 'Concert-SH':
                    basePower = 90;
                    desc.moveName = 'Hyper Voice';
                    break;
                case 'Corrosive':
                    basePower = 40;
                    desc.moveName = 'Acid';
                    break;
                case 'Corrosive-Mist':
                    basePower = 40;
                    desc.moveName = 'Acid Spray';
                    break;
                case 'Corrupted':
                    move.category = 'Physical';
                    basePower = 120;
                    desc.moveName = 'Gunk Shot';
                    break;
                case 'Crystal':
                    basePower = 80;
                    desc.moveName = 'Power Gem';
                    break;
                case 'Dark-Crystal':
                case 'Dimensional':
                    basePower = 80;
                    desc.moveName = 'Dark Pulse';
                    break;
                case 'Deep-Earth':
                    move.category = 'Status';
                    basePower = 0;
                    desc.moveName = 'Gravity';
                    break;
                case 'Desert':
                    basePower = 35;
                    desc.moveName = 'Sand Tomb';
                    break;
                case 'Dragon-Den':
                    basePower = 85;
                    desc.moveName = 'Dragon Pulse';
                    break;
                case 'Electric':
                    basePower = 90;
                    desc.moveName = 'Thunderbolt';
                    break;
                case 'Factory':
                    move.category = 'Physical';
                    basePower = 100;
                    desc.moveName = 'Gear Grind';
                    break;
                case 'Fairy-Tale':
                    basePower = 85;
                    desc.moveName = 'Secret Sword';
                    break;
                case 'Flower-Garden-1':
                case 'Flower-Garden-2':
                case 'Flower-Garden-3':
                case 'Flower-Garden-4':
                    move.category = 'Status';
                    basePower = 0;
                    desc.moveName = 'Growth';
                    break;
                case 'Flower-Garden-5':
                    move.category = 'Physical';
                    basePower = 90;
                    desc.moveName = 'Petal Blizzard';
                    break;
                case 'Forest':
                    move.category = 'Physical';
                    basePower = 120;
                    move.recoil = [1, 3];
                    desc.moveName = 'Wood Hammer';
                    break;
                case 'Frozen':
                    basePower = 90;
                    desc.moveName = 'Ice Beam';
                    break;
                case 'Glitch':
                    basePower = 0;
                    desc.moveName = 'Metronome';
                    move.category = 'Status';
                    break;
                case 'Grassy':
                    basePower = 90;
                    desc.moveName = 'Energy Ball';
                    break;
                case 'Haunted':
                    move.category = 'Physical';
                    basePower = 90;
                    desc.moveName = 'Phantom Force';
                    break;
                case 'Icy':
                    basePower = 90;
                    desc.moveName = 'Ice Beam';
                    break;
                case 'Infernal':
                    move.category = 'Physical';
                    basePower = Math.min(200, 60 + 20 * (0, util_2.countBoosts)(gen, defender.boosts));
                    desc.moveName = 'Punishment';
                    break;
                case 'Inverse':
                    move.category = 'Status';
                    basePower = 0;
                    desc.moveName = 'Trick Room';
                    break;
                case 'Mirror':
                    basePower = 65;
                    desc.moveName = 'Mirror Shot';
                    break;
                case 'Misty':
                    basePower = 70;
                    desc.moveName = 'Mist Ball';
                    break;
                case 'Mountain':
                    move.category = 'Physical';
                    basePower = 75;
                    desc.moveName = 'Rock Slide';
                    break;
                case 'Murkwater':
                    basePower = 95;
                    desc.moveName = 'Sludge Wave';
                    break;
                case 'New-World':
                    basePower = 100;
                    desc.moveName = 'Spacial Rend';
                    break;
                case 'Rainbow':
                    basePower = 65;
                    desc.moveName = 'Aurora Beam';
                    break;
                case 'Rocky':
                    move.category = 'Physical';
                    basePower = 40;
                    desc.moveName = 'Rock Smash';
                    break;
                case 'Short-Circuit-0.5':
                case 'Short-Circuit-0.8':
                case 'Short-Circuit-1.2':
                case 'Short-Circuit-1.5':
                case 'Short-Circuit-2':
                    basePower = 80;
                    desc.moveName = 'Discharge';
                    move.target = 'allAdjacent';
                    break;
                case 'Sky':
                    move.category = 'Physical';
                    basePower = 140;
                    desc.moveName = 'Sky Attack';
                    break;
                case 'Snowy-Mountain':
                    move.category = 'Physical';
                    basePower = 60;
                    desc.moveName = 'Avalanche';
                    break;
                case 'Starlight':
                    basePower = 95;
                    desc.moveName = 'Moonblast';
                    break;
                case 'Swamp':
                    basePower = 90;
                    desc.moveName = 'Muddy Water';
                    break;
                case 'Psychic':
                    basePower = 90;
                    desc.moveName = 'Psychic';
                    break;
                case 'Underwater':
                    basePower = 60;
                    desc.moveName = 'Water Pulse';
                    break;
                case 'Volcanic':
                    basePower = 90;
                    desc.moveName = 'Flamethrower';
                    break;
                case 'Volcanic-Top':
                    basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
                    desc.moveName = 'Eruption';
                    break;
                case 'Water':
                    basePower = 35;
                    desc.moveName = 'Whirlpool';
                    break;
                case 'Wasteland':
                    move.category = 'Physical';
                    basePower = 120;
                    desc.moveName = 'Gunk Shot';
                    break;
                default:
                    basePower = 80;
                    desc.moveName = 'Tri Attack';
            }
            break;
        case 'Water Shuriken':
            basePower = attacker.named('Greninja-Ash') && attacker.hasAbility('Battle Bond') ? 20 : 15;
            desc.moveBP = basePower;
            break;
        case 'Triple Axel':
            basePower = move.hits === 2 ? 30 : move.hits === 3 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Triple Kick':
            basePower = move.hits === 2 ? 15 : move.hits === 3 ? 30 : 10;
            desc.moveBP = basePower;
            break;
        case 'Crush Grip':
        case 'Wring Out':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
            if (field.hasTerrain('Concert-SH')) {
                basePower = 120;
            }
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    switch (field.terrain) {
        case 'Ashen-Beach':
            if (move.named('Mud Slap', 'Mud Shot', 'Mud Bomb', 'Sand Tomb')) {
                basePower *= 2;
            }
            else if (move.named('Surf', 'Muddy Water', 'Thousand Waves', "Land's Wrath", 'Strength', 'Clangorous Soulblaze', 'Scorching Sand', 'Mud Barrage', 'Sandsear Storm', 'Brine', 'Razor Shell', 'Shell Side Arm', 'Shell Trap', 'Crabhammer', 'Smelling Salts') || move.name.includes('Hidden Power ')) {
                basePower *= 1.5;
            }
            else if (move.named('Zen Headbutt', 'Stored Power', 'Aura Sphere', 'Focus Blast', 'Focus Punch')) {
                basePower *= 1.3;
            }
            else if (move.named('Psychic')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Back-Alley':
            if (move.hasType('Dark') && move.category === 'Physical') {
                basePower *= 1.5;
            }
            if (move.hasType('Poison')) {
                basePower *= 1.3;
            }
            if (move.hasType('Bug')) {
                basePower *= 1.3;
            }
            if (move.hasType('Steel')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fairy')) {
                basePower *= 0.5;
            }
            if (move.named('Air Cutter', 'Air Slash', 'Cross Poison', ' Crush Claw', 'Cut', 'Dragon Claw', 'False Swipe', 'Fury Cutter', 'Fury Swipes', 'Leaf Blade', 'Metal Claw', 'Night Slash', 'Psycho Cut', 'Razor Leaf', 'Razor Wind', 'Scratch', 'Secret Sword', 'Shadow Claw', 'Slash', 'X-Scissor')) {
                basePower *= 1.5;
            }
            if (move.named('Drill Run', 'Drill Peck', 'Megahorn')) {
                basePower *= 1.5;
            }
            if (move.named('Nature Power', 'Steamroller', 'Smog', 'Beat Up', 'Pay Day', 'Infestation	', 'Spectral Thief', 'First Impression', 'Techno Blast', 'Shadow Sneak')) {
                basePower *= 1.5;
            }
            if (move.named('Uproar', 'Hyper Voice', 'Boomburst', 'Echoed Voice')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Bewitched':
            if (move.hasType('Fairy')) {
                basePower *= 1.5;
            }
            if (move.hasType('Grass')) {
                basePower *= 1.5;
            }
            if (move.hasType('Dark')) {
                basePower *= 1.3;
            }
            if (move.named('Hex', 'Mystical Fire', 'Spirit Break')) {
                basePower *= 1.5;
            }
            else if (move.named('Ice Beam', 'Hyper Beam', 'Signal Beam', 'Aurora Beam', 'Charge Beam', 'Psybeam', 'Flash Cannon', 'Mirror Beam', 'Magical Leaf', 'Bubble Beam')) {
                basePower *= 1.4;
            }
            else if (move.named('Dark Pulse', 'Night Daze', 'Moonblast')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Big-Top':
            if (move.named('Payday')) {
                basePower *= 2;
            }
            if (move.flags.sound || move.named('Nature Power', 'Fiery Dance', 'Fire Lash', 'First Impresion', 'Fly', 'Petal Dance', 'Power Whip', 'Revelation Dance', 'Vine Whip', 'Drum Beating', 'Acrobatics')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Blessed':
            if (move.hasType('Fairy')) {
                basePower *= 1.5;
            }
            if (move.hasType('Normal') && move.category === 'Special') {
                basePower *= 1.5;
            }
            if (move.hasType('Dragon')) {
                basePower *= 1.2;
            }
            if (move.hasType('Psychic')) {
                basePower *= 1.2;
            }
            if (move.hasType('Ghost')) {
                basePower *= 0.5;
            }
            if (move.hasType('Dark') && move.category == 'Special') {
                basePower *= 0.5;
            }
            if (move.named('Nature Power', 'Mystical Fire', 'Magical Leaf', ' Judgment', 'Sacred Fire', 'Ancient Power', 'Sacred Sword', 'Return', 'Extreme Speed')) {
                basePower *= 1.5;
            }
            else if (move.named('Phantom Force', 'Spectral Scream', 'Shadow Force', 'Ominous Wind', 'Psystrike', ' Aeroblast', 'Light that Burns the Sky', 'Origin Pulse', 'Precipice Blade', 'Dragon Ascent', 'Doom Desire', 'Mist Ball', 'Luster Purge', 'Meanacing Moonraze Maelstrom', 'Psycho Boost', 'Spacial Rend', 'Roar of Time', 'Crush Grip', 'Secret Sword', 'Relic Song', 'Searing Sunraze Smash', 'Hyperspace Hole', "Land's Wrath", 'Moongeist Beam', 'Sunsteel Strike', 'Prismatic Laser', 'Diamond Storm', 'Fleur Cannon', 'Multipulse', 'Genesis Supernova', 'Behemoth Blade', 'Behemoth Bash', 'Eternabeam', 'Dynamax Cannon')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Cave':
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying') && !move.flags.contact) {
                basePower *= 0.5;
            }
            if (move.named('Nature Power', 'Rock Tomb')) {
                basePower *= 1.5;
            }
            else if (move.named('Power Gem', 'Diamond Storm', 'Acid Downpour', 'Sludge Wave', 'Blizzard', 'Subzero Slammer', 'Draco Meteor', 'Devastating Drake')) {
                basePower *= 1.3;
            }
            else if (move.named('Sky Drop')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Chess':
            if (move.named('Barrage')) {
                basePower *= 2;
            }
            else if (move.named('Nature Power', 'Psychic', 'Strength', 'Rock Throw', 'Ancient Power', 'Continental Crush', 'Fake Out', 'Feint', 'Feint Attack', 'First Impression', 'Sucker Punch', 'Shadow Sneak', 'Smart Strike', 'Secret Power', 'Shattered Psyche')) {
                basePower *= 1.5;
            }
            if (move.named('Nature Power', 'Psychic', 'Strength', 'Ancient Power', 'Continental Crush', 'Barrage', 'Secret Power', 'Shattered Psyche') &&
                attacker.hasAbility('Klutz')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'City':
            if (move.hasType('Normal') && move.category === 'Physical') {
                basePower *= 1.5;
            }
            if (move.hasType('Poison')) {
                basePower *= 1.3;
            }
            if (move.hasType('Steel')) {
                basePower *= 1.3;
            }
            if (move.hasType('Bug')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fairy')) {
                basePower *= 0.7;
            }
            if (move.named('Nature Power', 'Steamroller', 'Smog', 'Beat Up', 'Pay Day', 'First Impression', 'Techno Blast')) {
                basePower *= 1.5;
            }
            else if (move.named('Thief', 'Covet', 'Pursuit')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Colosseum':
            if (move.named('Nature Power', 'Fell Stinger', 'Reversal', 'Beat Up', 'Pay Day', 'Pursuit', 'Nature Power')) {
                basePower *= 2;
            }
            if (move.named('Electroweb', 'Vine Whip', 'Smart Strike', 'Smack Down', 'Sacred Sword', 'Secret Sword', 'Psycho Cut', 'Night Slash', 'Submission', 'Bonemerang', 'Bone Rush', ' Bone Club', 'Leaf Blade', 'Payback', 'Punishment', 'Meteor Mash', 'Bullet Punch', 'Clanging Scales', 'Steamroller', 'Brutal Swing', 'Meteor Assault', 'First Impression')) {
                basePower *= 1.5;
            }
            else if (move.named('Wood Hammer', 'Dragon Hammer', 'Power Whip', 'Spirit Shackle', 'Drill Run', 'Drill Peck', 'Ice Hammer', 'Icicle Spear', 'Anchor Shot', 'Crabhammer', 'Shadow Bone', 'Fire Lash', 'Sucker Punch', 'Throat Chop', 'Storm Throw')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Concert-NH':
            if (move.named('Magnitude')) {
                move.bp = 10;
            }
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.named('Rage', 'Frustration', 'Thrash', 'Outrage', 'Stomping Tantrum', 'Acid', 'Acid Spray', 'Drum Beating', 'Fake Out', 'Rollout', 'Dirst Impression', 'Dragon Tail', 'Circle Throw', 'Apple Acid')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Concert-LH':
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.named('Rage', 'Frustration', 'Thrash', 'Outrage', 'Stomping Tantrum', 'Acid', 'Acid Spray', 'Drum Beating', 'Fake Out', 'Rollout', 'Dirst Impression', 'Dragon Tail', 'Circle Throw', 'Apple Acid')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Concert-H':
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.named('Acid', 'Acid Spray', 'Drum Beating', 'Fake Out', 'Rollout', 'Dirst Impression', 'Dragon Tail', 'Circle Throw', 'Apple Acid')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Concert-SH':
            if (move.named('Magnitude')) {
                move.bp = 150;
            }
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.named('Acid', 'Acid Spray', 'Drum Beating', 'Fake Out', 'Rollout', 'Dirst Impression', 'Dragon Tail', 'Circle Throw', 'Apple Acid')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Corrosive':
            if (move.named('Nature Power', 'Grass Knot', 'Acid', 'Acid Spray', 'Snap Trap')) {
                basePower *= 2;
            }
            else if (move.named('Smack Down', 'Mud Slap', 'Mud Shot', 'Muddy Water', 'Mud Bomb', 'Whirlpool', 'Thousand Arrows', 'Apple Acid')) {
                basePower *= 1.5;
            }
            else if (move.named('Seed Flare')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Corrosive-Mist':
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.named('Smog', 'Clear Smog', 'Nature Power', 'Acid Spray', 'Bubble', 'Bubble Beam', 'Sparkling Aria', 'Oceanic Operetta', 'Apple Acid')) {
                basePower *= 1.5;
            }
            else if (move.named('Gust', 'Hurricane', 'Razor Wind', 'Twister', 'Supersonic Strike', 'Seed Flare')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Corrupted':
            if (move.hasType('Poison')) {
                basePower *= 1.5;
            }
            if (move.hasType('Grass')) {
                basePower *= 1.2;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.2;
            }
            if (move.hasType('Fairy')) {
                basePower *= 0.5;
            }
            if (move.hasType('Flying') && !move.flags.contact) {
                basePower *= 0.5;
            }
            if (move.named('Seed Flare', 'Apple Acid')) {
                basePower *= 1.5;
            }
            if (move.named('Solar Beam', 'Solar Blade', 'Seed Flare', 'Heat Wave', 'Blast Burn', 'Eruption', 'Lava Plume', 'Inferno Overdrive')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Crystal':
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.hasType('Dragon')) {
                basePower *= 1.5;
            }
            if (move.named('Nature Power', 'Judgment', 'Strength', 'Rock Climb', 'Prismatic Laser', 'Multi-Attack', 'Power Gem', 'Diamond Storm', 'Ancient Power', 'Rock Smash', 'Rock Tomb', 'Luster Purge')) {
                basePower *= 1.5;
            }
            else if (move.named('Dark Pulse', 'Dark Void', 'Night Daze', 'Light That Burns the Sky', 'Tectonic Rage', 'Aurora Beam', 'Signal Beam', 'Flash Cannon', 'Dazzling Gleam', 'Mirror Beam', 'Mirror Shot', 'Doom Desire', 'Techno Blast', 'Moongeist Beam', 'Menacing Moonraze Maelstrom', 'Photon Geyser')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Dark-Crystal':
            if (move.named('Prismatic Laser')) {
                basePower *= 2;
            }
            else if (move.named('Dark Pulse', 'Nature Power', 'Night Daze', 'Night Slash', 'Shadow Ball', 'Shadow Force', 'Shadow Sneak', 'Shadow Punch', 'Shadow Claw', 'Shadow Bone', 'Aurora Beam', 'Signal Beam', 'Doom Desire', 'Flash Cannon', 'Luster Purge', 'Dazzling Gleam', 'Mirror Shot', 'Technoblast', 'Power Gem', 'Moongeist Beam', 'Menacing Moonraze Maelstrom', 'Photon Geyser', 'Diamond Storm', 'Black Hole Eclipse', 'Mirror Beam')) {
                basePower *= 1.5;
            }
            else if (move.named('Earthquake', 'Bulldoze', 'Magnitude', 'Tectonic Rage')) {
                basePower *= 1.3;
            }
            else if (move.named('Solar Beam', 'Solar Blade')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Deep-Earth':
            if (move.named('Core Enforcer')) {
                move.priority = -1;
            }
            if (move.named('Crush Grip')) {
                move.bp = 120;
            }
            if (move.named('Gyro Ball')) {
                move.bp = 150;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.3;
            }
            if (move.hasType('Psychic')) {
                basePower *= 1.3;
            }
            if (move.hasType('Ground')) {
                if (defender.hasType('Ground')) {
                    basePower *= 0.5;
                }
                else {
                    basePower *= 1.5;
                }
            }
            if (move.named("Land's Wrath", 'Magnet Bomb', 'Precipice Blade', 'Tectonic Rage', 'Crush Grip', 'Smack Down', 'Core Enforcer')) {
                basePower *= 2;
            }
            else if (move.named('Heavy Slam', 'Heat Crash', 'Body Slam', 'Stomp', 'Dragon Rush', 'Steamroller', 'Grav Apple', 'Ancient Power', 'Fling', 'Grass Knot', 'Low Kick', 'Spacial Rend', 'Storm Throw', 'Circle Throw', 'Vital Throw', 'Body Press', 'Submission', 'Ice Hammer', 'Hammer Arm', 'Crabhammer', 'Icicle Crash', 'Thousand Waves', 'Thousand Arrows')) {
                basePower *= 1.5;
            }
            if (move.priority > 0) {
                basePower *= 0.7;
            }
            else if (move.priority < 0) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Desert':
            if (move.hasType('Water') && !move.named('Scald', 'Steam Eruption') && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 0.5;
            }
            if (move.hasType('Electric') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 0.5;
            }
            if (move.named('Nature Power', 'Heat Wave', 'Dig', 'Heat Wave', 'Needle Arm', 'Pin Missile', 'Sand Tomb', 'Thousand Waves', 'Burn Up', 'Scald', 'Steam Eruption', 'Searing Sunraze Smash', 'Solar Beam', 'Solar Blade', 'Bone Club', 'Bone Rush', 'Bonemerang', 'Shadow Bone')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Dimensional':
            if (move.named('Rage')) {
                move.bp = 60;
                move.type = 'Dark';
            }
            if (move.hasType('Shadow')) {
                basePower *= 1.5;
            }
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            if (move.hasType('Ghost')) {
                basePower *= 1.2;
            }
            if (move.hasType('Fairy')) {
                basePower *= 0.5;
            }
            if (move.named('Hyperspace Fury', 'Hyperspace Hole', 'Spacial Rend', 'Roar of Time', 'Eternabeam', 'Dynamax Cannon', 'Shadow Force', 'Outrage', 'Thrash', 'Stomping Tantrum', 'Lash Out', 'Freezing Glare', 'Fiery Wrath', 'Raging Fury')) {
                basePower *= 1.5;
            }
            else if (move.named('Ice Burn', 'Freeze Shock', 'Glaciate', 'Seed Flare', 'Precipice Blades')) {
                basePower *= 1.3;
            }
            else if (move.named('Nature Power', 'Dark Pulse', 'Night Daze')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Dragon-Den':
            if (move.hasType('Dragon')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.3;
            }
            if (move.hasType('Water', 'Ice')) {
                basePower *= 0.5;
            }
            if (move.named('Smack Down', 'Thousand Arrows', 'Dragon Ascent', 'Pay Day', 'Luster Purge', 'Mist Ball')) {
                basePower *= 2;
            }
            else if (move.named('Rock Climb', 'Strength', 'Mega Kick', 'Stomping Tantrum', 'Power Gem', 'Diamond Storm', 'Matrix Shot', 'Lava Plume', 'Magma Storm', 'Earth Power', 'Magma Drift', 'Shell Trap')) {
                basePower *= 1.5;
            }
            if (move.named('Mist Ball', 'Glaciate', 'Subzero Slammer', 'Oceanic Operetta', 'Hydro Vortex')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Electric':
            if (move.hasType("Electric") && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 1.5;
            }
            if (move.named('Magnet Bomb', 'Plasma Fist')) {
                basePower *= 2;
            }
            else if (move.named('Explosion', 'Self-Destruct', 'Surf', 'Muddy Water', 'Hurricane', 'Smack Down', 'Thousand Arrows')) {
                basePower *= 1.5;
            }
            else if (move.named('Tectonic Rage', 'Stoked Sparksurfer')) {
                basePower *= 1.3;
            }
            else if (move.named('Focus Punch')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Factory':
            if (move.hasType('Electric')) {
                basePower *= 1.2;
            }
            if (move.named('Nature Power', 'Flash Cannon', 'Gyro Ball', 'Gear Grind', 'Magnet Bomb', 'Double Iron Bash')) {
                basePower *= 2;
            }
            else if (move.named('Steam Roller', 'Techno Blast', 'Super UMD Move')) {
                basePower *= 1.5;
            }
            else if (move.named('Explosion', 'Self-Destruct', 'Magnitude', 'Fissure', 'Earthquake', 'Bulldoze', 'Tectonic Rage', 'Discharge', 'Overdrive', 'Aura Wheel', 'Ion Deluge', 'Gigavolt Havoc', 'Light that Burns the Sky')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Fairy-Tale':
            if (move.hasType('Dragon')) {
                basePower *= 2;
            }
            if (move.hasType('Steel')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fairy')) {
                basePower *= 1.5;
            }
            if (move.named('Draining Kiss', 'Mist Ball')) {
                basePower *= 2;
            }
            else if (move.named('Night Slash', 'Leaf Blade', 'Psycho Cut', 'Solar Blade', 'Smart Strike', 'Razor Shell', 'Behemoth Bash', 'Behemoth Blade', 'Mystical Fire', 'Ancient Power', 'Relic Song', 'Magical Leaf', 'Sparkling Aria', 'Moongeist Beam', 'Fleur Cannon', 'Air Slash', 'Oceanic Operetta', 'Menacing Moonraze Maelstrom')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower-Garden-1':
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower-Garden-2':
            if (move.hasType('Grass')) {
                basePower *= 1.1;
            }
            if (move.named('Cut')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower-Garden-3':
            if (move.hasType('Bug')) {
                basePower *= 1.5;
            }
            if (move.hasType('Grass')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.named('Cut')) {
                basePower *= 1.5;
            }
            else if (move.named('Petal Dance', 'Petal Blizzard', 'Fleur Cannon')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower-Garden-4':
            if (move.hasType('Bug')) {
                basePower *= 2;
            }
            if (move.hasType('Grass')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.named('Cut', 'Petal Blizzard', 'Petal Dance', 'Fleur Cannon')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower-Garden-5':
            if (move.named('Petal Dance', 'Petal Blizzard') || move.name.includes(' Powder')) {
                move.target = 'allAdjacent';
            }
            if (move.hasType('Bug')) {
                basePower *= 2;
            }
            if (move.hasType('Grass')) {
                basePower *= 2;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.named('Cut', 'Petal Blizzard', 'Petal Dance', 'Fleur Cannon')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Forest':
            if (move.hasType('Grass')) {
                basePower *= 1.5;
            }
            if (move.hasType('Bug') && move.category === 'Special') {
                basePower *= 1.5;
            }
            if (move.named('Cut')) {
                basePower *= 2;
            }
            else if (move.named('Slash', 'Air Slash', 'Gale Strike', 'Fury Cutter', 'Air Cutter', 'Psycho Cut', 'Breaking Swipe', 'Grav Apple', 'Attack Order')) {
                basePower *= 1.5;
            }
            else if (move.named('Surf', 'Muddy Water')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Frozen':
            if (move.hasType('Ice')) {
                basePower *= 1.2;
            }
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            if (move.named('Outrage', 'Thrash', 'Lash Out', 'Freezing Glare', 'Roar of Time', 'Fiery Wrath', 'Rage', 'Stomping Tantrum', 'Raging Fury')) {
                basePower *= 1.5;
            }
            if (move.named('Blast Burn', 'Inferno', 'Lava Plume', 'Heat Wave', 'Eruption', 'Flame Burst', 'Burn Up', 'Raging Fury')) {
                basePower *= 1.3;
            }
            else if (move.named('Surf', 'Muddy Water', 'Water Pulse', 'Hydro Pump', 'Night Slash', 'Dark Pulse', 'Hyperspace Fury', 'Hyperspace Hole')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Glitch':
            if (move.hasType('Psychic')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Grassy':
            if (move.hasType('Grass') && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 1.5;
            }
            if (move.named('Fairy Wind', 'Silver Wind', 'Ominous Wind', 'Icy Wind', 'Razor Wind', 'Gust', 'Grass Knot', 'Twister')) {
                basePower *= 1.5;
            }
            else if (move.named('Sludge Wave', 'Acid Downpour')) {
                basePower *= 1.3;
            }
            else if (move.named('Bloom Doom') && field.terrain === null) {
                basePower *= 1.3;
            }
            else if (move.named('Muddy Water', 'Surf', 'Earthquake', 'Magnitude', 'Bulldoze')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Haunted':
            if (move.hasType('Ghost')) {
                basePower *= 1.5;
            }
            if (move.named('Bone Club', 'Bonemerang', 'Bone Rush', 'Astonish')) {
                basePower *= 1.5;
            }
            else if (move.named('Dazzling Gleam', 'Judgment', 'Origin Pulse', 'Sacred Fire', 'Flame Burst', 'Inferno', 'Flame Charge', 'Fire Spin')) {
                basePower *= 1.3;
            }
            if (move.named('Shadow Bone')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Icy':
            if (move.hasType('Ice')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 0.5;
            }
            if (move.named('Bitter Malice')) {
                basePower *= 1.5;
            }
            else if (move.named('Heat Wave', 'Flame Burst', 'Lava Plume', 'Eruption', 'Searing Shot', 'Fire Pledge', 'Inferno Overdrive', 'Raging Fury', 'Magma Drift', 'Incinerate', 'Mind Blown', 'Steam Eruption')) {
                basePower *= 1.3;
            }
            if (move.named('Scald', 'Steam Eruption')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Infernal':
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fairy') && !move.named('Spirit Break')) {
                basePower *= 0.5;
            }
            if (move.hasType('Water')) {
                basePower *= 0.5;
            }
            if (move.named('Punishment', 'Smog', 'Dream Eater')) {
                basePower *= 2;
            }
            else if (move.named('Blast Burn', 'Earth Power', 'Inferno Overdrive', 'Precipice Blade', 'Inferno', 'Raging Fury', 'Infernal Parade')) {
                basePower *= 1.5;
            }
            else if (move.named('Glaciate', 'Judgment', 'Origin Pulse')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Mirror':
            if (move.named('Nature Power', 'Mirror Shot')) {
                basePower *= 2;
            }
            else if (move.named('Aurora Beam', 'Signal Beam', 'Flash Cannon', 'Luster Purge', 'Doom Desire', 'Dazzling Gleam', 'Techno Blast', 'Prismatic Laser', 'Photon Geyser')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Misty':
            if (move.hasType('Fairy')) {
                basePower *= 1.5;
            }
            if (move.hasType('Dragon')) {
                basePower *= 0.5;
            }
            if (move.named('Mystical Fire', 'Magical Leaf', 'Doom Desire', 'Icy Wind', 'Aura Sphere', 'Nature Power', 'Mist Ball', 'Steam Eruption', 'Springtide Storm', 'Clear Smog', 'Silver Wind', 'Smog', 'Strange Steam', 'Moongeist Beam')) {
                basePower *= 1.5;
            }
            if (move.named('Gust', 'Razor Wind', 'Hurricane', 'Twister', 'Supersonic Skystrike', 'Clear Smog', 'Smog', 'Acid Downpour')) {
                basePower *= 1.3;
            }
            else if (move.named('Dark Pulse', 'Night Daze', 'Shadow Ball')) {
                basePower *= 0.5;
            }
            else if (move.named('Explosion', 'Self-Destruct', 'Mind Blown')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Mountain':
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying') && field.hasWeather('Strong Winds') && move.category === 'Special') {
                basePower *= 1.5;
            }
            if (move.named('Vital Throw', 'Storm Throw', 'Circle Throw', 'Ominous Wind', 'Razor Wind', 'Icy Wind', 'Silver Wind', 'Fairy Wind', 'Twister', 'Eruption', 'Avalanche', 'Thunder', 'Hyper VOice', 'Mountain Gale')) {
                basePower *= 1.5;
            }
            else if (move.named('Ominous Wind', 'Razor Wind', 'Icy Wind', 'Silver Wind', 'Fairy Wind', 'Twister', 'Gust') && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            else if (move.named('Fly', 'Bounce', 'Lava Plume', 'Magma Drift', 'Eruption', 'Inferno Overdrive', 'Blizzard', 'Subzero Slammer', 'Mountain Gale', 'Glaciate')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Murkwater':
            if (move.hasType('Water')) {
                basePower *= 1.5;
            }
            if (move.hasType('Electric') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 1.3;
            }
            if (move.hasType('Poison')) {
                basePower *= 1.5;
            }
            if (move.hasType('Ground')) {
                basePower *= 0;
            }
            if (move.named('Mud Bomb', 'Mud Shot', 'Mud Slap', 'Thousand Wave', 'Mud Barrage', 'Smack Down', 'Apple Acid', 'Acid', 'Acid Spray', 'Brine')) {
                basePower *= 1.5;
            }
            else if (move.named('Whirlpool', 'Blizzard', 'Glaciate', 'Subzero Slammer')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'New-World':
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            if (move.named('Doom Desire')) {
                basePower *= 4;
            }
            else if (move.named('Nature Power', 'Vacuum Wave', 'Draco Meteor', 'Meteor Mash', 'Moonblast', 'Comet Punch', 'Swift', 'Future Sight', 'Ancient Power', 'Hyperspace Hole', 'Hyperspace Fury', 'Spacial Rend', 'Menacing Moonraze Maelstrom', 'Light That Burns the Sky', 'Black Hole Eclipse')) {
                basePower *= 2;
            }
            else if (move.named('Aurora Beam', 'Signal Beam', 'Flash Cannon', 'Dazzling Gleam', 'Mirror Shot', 'Earth Power', 'Power Gem', 'Eruption', 'Continental Crush', 'Psystrike', 'Aeroblast', 'Sacred Fire', 'Mist Ball', 'Mirror Beam', 'Luster Purge', 'Origin Pulse', 'Precipice Blades', 'Dragon Ascent', 'Psycho Boost', 'Roar of Time', 'Magma Storm', 'Crush Grip', 'Judgment', 'Searing Shot', 'Shadow Force', ' Seed Flare', ' V-Create', 'Photon Geyser', 'Sacred Sword', 'Secret Sword', 'Fusion Bolt', 'Fusion Flare', 'Bolt Strike', 'Blue Flare', 'Glaciate', 'Ice Burn', 'Freeze Shock', ' Relic Song', 'Techno Blast', ' Oblivion Wing', "Land's Wrath", 'Thousand Arrows', 'Thousand Waves', 'Core Enforcer', 'Diamond Storm', 'Steam Eruption', 'Fleur Cannon', 'Prismatic Laser', 'Sunsteel Strike', 'Spectral Thief', 'Moongeist Beam', 'Multiattack', 'Genesis Supernova', 'Mind Blown', 'Soul-eating Seven Star Strike', 'Plasma Fists', 'Searing Sunraze Smash', 'Menacing Moonraze Maelstrom')) {
                basePower *= 1.5;
            }
            else if (move.named('Earthquake', 'Bulldoze', 'Magnitude')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Psychic':
            if (move.hasType('Psychic') && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 1.5;
            }
            if (move.named('Hex', 'Magical Leaf', 'Mystical Fire', 'Moonblast', 'Aura Sphere', 'Mind Blown', 'Focus Blast', 'Secret Power') || move.name.includes('Hidden Power ')) {
                basePower *= 1.5;
            }
            else if (move.named('Genesis Supernova') && field.hasTerrain === null) {
                basePower *= 1.3;
            }
            if (move.priority > 0 && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Rainbow':
            if (move.hasType('Normal') && move.category == 'Special') {
                basePower *= 1.5;
            }
            if (move.named('Weather Ball')) {
                basePower *= 2;
            }
            else if (move.named('Nature Power', 'Silver Wind', 'Mystical Fire', 'Dragon Pulse', 'Tri Attack', 'Sacred Fire', 'Fire Pledge', ' Water Pledge', 'Grass Pledge', 'Aurora Beam', 'Judgment', 'Relic Song', 'Secret Power', 'Weather Ball', 'Mist Ball', 'Heart Stamp', 'Moonblast', 'Zen Headbutt', 'Sparkling Aria', 'Fleur Cannon', 'Prismatic Laser', 'Twinkle Tackle', 'Oceanic Operetta', 'Solar Beam', 'Solar Blade', 'Dazzling Gleam', 'Mirror Beam') || move.name.includes('Hidden Power ')) {
                basePower *= 1.5;
            }
            else if (move.named('Dark Pulse', 'Night Daze', 'Shadow Ball', 'Never-Ending Nightmare')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Rocky':
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.named('Nature Power', 'Rock Smash')) {
                basePower *= 2;
            }
            else if (move.named('Earthquake', 'Magnitude', 'Rock Climb', 'Strength', 'Bulldoze', 'Accelerock')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Short-Circuit-0.5':
        case 'Short-Circuit-0.8':
        case 'Short-Circuit-1.2':
        case 'Short-Circuit-1.5':
        case 'Short-Circuit-2':
            if (move.hasType('Electric')) {
                switch (field.terrain) {
                    case 'Short-Circuit-0.5':
                        basePower *= 0.5;
                        break;
                    case 'Short-Circuit-0.8':
                        basePower *= 0.8;
                        break;
                    case 'Short-Circuit-1.2':
                        basePower *= 1.2;
                        break;
                    case 'Short-Circuit-1.5':
                        basePower *= 1.5;
                        break;
                    case 'Short-Circuit-2':
                        basePower *= 2;
                        break;
                }
            }
            if (move.named('Dazzling Gleam', 'Flash Cannon', 'Super UMD Move', 'Surf', 'Muddy Water', 'Gyro Ball', 'Magnet Bomb', 'Gear Grind', 'Hydro Vortex')) {
                basePower *= 1.5;
            }
            else if (move.named('Nature Power', 'Charge Beam', 'Discharge', 'Wild Charge', 'Parabolic Charge', 'Ion Deluge', 'Gigavolt Havoc', 'Overdrive', 'Aura Wheel', 'Dark Pulse', 'Night Daze', 'Night Slash', 'Shadow Ball', 'Shadow Claw', 'Shadow Force', 'Shadow Sneak', 'Shadow Punch', 'Shadow Bone', 'Phantom Force')) {
                basePower *= 1.3;
            }
            else if (move.named('Steel Beam')) {
                basePower *= 1.667;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Sky':
            if (attacker.hasAbility('Long Reach')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying')) {
                basePower *= 1.5;
            }
            if (move.named('Icy Wind', 'Silver Wind', ' Ominous Wind', 'Fairy Wind', 'Aeroblast', 'Flying Press', 'Sky Uppercut', 'Thundershock', 'Thunderbolt', 'Steel Wing', 'Dragon Darts', 'Grav Apple', 'Dragon Ascent', 'Thunder', 'Twister', 'Razor Wind', 'Dive', 'Esper Wing', 'Bleakwind Storm')) {
                basePower *= 1.5;
            }
            if (move.named('Thousand Arrows', 'Smack Down', 'Springtide Storm', 'Windbolt Storm', 'Sandsear Storm', 'Grav Apple')) {
                basePower *= 1.3;
            }
            else if (move.named('Magnitude', 'Earthquake', 'Dig', 'Rototiller', 'Bulldoze')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Snowy-Mountain':
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying')) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying') && move.category === 'Special' && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            if (move.hasType('Ice')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 0.5;
            }
            if (move.named('Icy Wind')) {
                basePower *= 2;
            }
            if (move.named('Ominous Wind', 'Razor Wind', 'Icy Wind', 'Silver Wind', 'Fairy Wind', 'Twister', 'Gust') && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            if (move.named('Nature Power', 'Vital Throw', 'Storm Throw', 'Circle Throw', 'Ominous Wind', 'Razor Wind', 'Silver Wind', 'Fairy Wind', 'Twister', 'Powder Snow', 'Avalanche', 'Hyper Voice', 'Mountain Gale', 'Bitter Malice')) {
                basePower *= 1.5;
            }
            else if (move.named('Eruption', 'Magma Drift', 'Fly', 'Bounce', 'Heat Wave', 'Flame Burst', 'Lava Plume', 'Searing Shot', 'Raging Fury', 'Fire Pledge', 'Inferno Overdrive', 'Incinerate', 'Mind Blown')) {
                basePower *= 1.3;
            }
            else if (move.named('Scald', 'Steam Eruption')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Starlight':
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            if (move.hasType('Psychic')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fairy')) {
                basePower *= 1.3;
            }
            if (move.named('Doom Desire')) {
                basePower *= 4;
            }
            else if (move.named('Draco Meteor', 'Meteor Mash', 'Comet Punch', 'Spacial Rend', 'Swift', 'Hyperspace Hole', 'Hyperspace Fury', 'Sunsteel Strike', 'Moongeist Beam', 'Black Hole Eclipse', 'Searing Sunraze Smash', 'Menacing Moonraze Maelstrom', 'Light that Burns the Sky', 'Meteor Assault')) {
                basePower *= 2;
            }
            else if (move.named('Nature Power', 'Aurora Beam', 'Signal Beam', 'Flash Cannon', 'Luster Purge', 'Dazzling Gleam', 'Mirror Shot', 'Technoblast', 'Solar Beam', 'Photon Geyser', 'Prismatic Laser', 'Night Slash', 'Night Daze', 'Mirror Beam', 'Moonblast')) {
                basePower *= 1.5;
            }
            if (move.named('Light That Burns the Sky')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Swamp':
            if (move.hasType('Bug')) {
                basePower *= 1.3;
            }
            if (move.hasType('Water')) {
                basePower *= 1.3;
            }
            if (move.hasType('Grass')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fire')) {
                basePower *= 0.8;
            }
            if (move.named('Nature Power', 'Mud Bomb', 'Mud Shot', 'Mud Slap', 'Muddy Water', 'Sludge', 'Sludge Bomb', 'Sludge Wave', 'Gunk Shot', 'Brine', 'Smack Down', 'Thousand Arrows', 'Hydro Vortex', 'Mud Barrage', 'Savage Spin-Out')) {
                basePower *= 1.5;
            }
            else if (move.named('Explosion', 'Self-Destruct', 'Mind Blown')) {
                basePower *= 0;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Underwater':
            if (move.hasType('Electric')) {
                basePower *= 2;
            }
            if (move.hasType('Water')) {
                basePower *= 1.5;
            }
            if (move.category === 'Physical' && !move.hasType('Water') && !attacker.hasType('Water')) {
                basePower *= 0.5;
            }
            if (move.hasType('Fire')) {
                basePower *= 0;
            }
            if (move.named('Anchor Shot', 'Dragon Darts', 'Acid Downpour', 'Sludge Wave')) {
                basePower *= 2;
            }
            else if (move.named('Water Pulse', 'Nature Power')) {
                basePower *= 1.5;
            }
            else if (move.named('Dive', 'Fly', 'Bounce', 'Sky Drop')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Volcanic':
            if (move.hasType('Fire') && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 1.5;
            }
            if (move.hasType('Grass') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 0.5;
            }
            if ((move.hasType('Ice'))) {
                basePower *= 0.5;
            }
            if (move.named('Smog', 'Clear Smog')) {
                basePower *= 2;
            }
            else if (move.named('Smack Down', 'Thousand Arrows', 'Rock Slide', 'Infernal Parade')) {
                basePower *= 1.5;
            }
            else if (move.named('Gust', 'Razor Wind', 'Hurricane', 'Twister', 'Surf', 'Muddy Water', 'Water Pledge', 'Water Spout', 'Sparkling Aria', 'Hydro Vortex', 'Oceanic Operetta', 'Sand Tomb', 'Continental Crush', 'Blizzard')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Volcanic-Top':
            if (move.hasType('Fire')) {
                basePower *= 1.2;
            }
            if (move.hasType('Water') && (0, util_2.isGrounded)(attacker, field)) {
                basePower *= 0.9;
            }
            if (move.hasType('Ice')) {
                basePower *= 0.5;
            }
            if (move.named('Steam Eruption', 'Scald')) {
                basePower *= 1.667;
            }
            else if (move.named('Thunder', 'Ominous Wind', 'Silver Wind', 'Razor Wind', 'Icy Wind', 'Gust', 'Twister', 'Precipice Blades', 'Smog', 'Clear Smog', 'Infernal Parade')) {
                basePower *= 1.5;
            }
            else if (move.named('Nature Power', 'Fly', 'Bounce', 'Blizzard', 'Glaciate', 'Subzero Slammer', 'Eruption', 'Heat Wave', ' Magma Storm', 'Lava Plume', 'Magma Drift')) {
                basePower *= 1.3;
            }
            if (move.named('Surf', 'Muddy Water', 'Water Pledge', 'Water Spout', 'Water Sport', 'Sparkling Aria', 'Oceanic Operetta', 'Hydro Pump', 'Hydro Vortex')) {
                basePower *= 0.555;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Wasteland':
            if (move.named('Spit Up')) {
                basePower *= 2;
            }
            if (move.named('Vine Whip', 'Power Whip', 'Mud Bomb', 'Mud Slap', 'Mud Shot')) {
                basePower *= 1.5;
            }
            else if (move.named('Gunk Shot', 'Sludge', 'Sludge Wave', 'Sludge Bomb', 'Octazooka') && !defender.hasType('Poison', 'Steel') &&
                !defender.hasAbility('Inmunity', 'Posion Heal', 'Toxic Boost')) {
                basePower *= 1.2;
            }
            else if (move.named('Magnitude', 'Earthquake', 'Bulldoze')) {
                basePower *= 0.25;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Water':
            if (move.hasType('Water')) {
                basePower *= 1.5;
            }
            if (move.hasType('Electric')) {
                basePower *= 1.5;
            }
            if (move.hasType('Fire') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 0.5;
            }
            if (move.hasType('Ground')) {
                basePower *= 0;
            }
            if (move.named('Whirlpool', 'Nature Power', 'Surf', 'Dive', 'Muddy Water', 'Octazooka', 'Hydro Vortex', 'Origin Pulse', 'Sludge Wave')) {
                basePower *= 1.2;
            }
            if (move.named('Dive', 'Anchor Shot', 'Grav Apple', 'Acid Downpour', 'Blizzard', 'Glaciate', 'Subzero Slammer')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        default:
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
    }
    if (field.hasWeather('Shadow Sky') && move.named('Solar Beam')) {
        basePower *= 0;
    }
    if (basePower === 0) {
        return 0;
    }
    if (move.named('Breakneck Blitz', 'Bloom Doom', 'Inferno Overdrive', 'Hydro Vortex', 'Gigavolt Havoc', 'Subzero Slammer', 'Supersonic Skystrike', 'Savage Spin-Out', 'Acid Downpour', 'Tectonic Rage', 'Continental Crush', 'All-Out Pummeling', 'Shattered Psyche', 'Never-Ending Nightmare', 'Devastating Drake', 'Black Hole Eclipse', 'Corkscrew Crash', 'Twinkle Tackle')) {
        desc.moveBP = move.bp;
    }
    var bpMods = calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder);
    basePower = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((basePower * (0, util_2.chainMods)(bpMods, 41, 2097152)) / 4096)));
    if (attacker.teraType && move.type === attacker.teraType &&
        attacker.hasType(attacker.teraType) && move.hits === 1 &&
        move.priority <= 0 && move.bp > 0 && !move.named('Dragon Energy', 'Eruption', 'Water Spout') &&
        basePower < 60 && gen.num >= 9) {
        basePower = 60;
        desc.moveBP = 60;
    }
    return basePower;
}
exports.calculateBasePowerSMSSSV = calculateBasePowerSMSSSV;
function calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder) {
    var bpMods = [];
    var resistedKnockOffDamage = (!defender.item || (0, util_2.isQPActive)(defender, field)) ||
        (defender.named('Dialga-Origin') && defender.hasItem('Adamant Crystal')) ||
        (defender.named('Palkia-Origin') && defender.hasItem('Lustrous Globe')) ||
        (defender.name.includes('Giratina-Origin') && defender.item.includes('Griseous')) ||
        (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
        (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
        (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
        (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
        (defender.name.includes('Silvally') && defender.item.includes('Memory')) ||
        defender.item.includes(' Z') ||
        (defender.named('Zacian') && defender.hasItem('Rusted Sword')) ||
        (defender.named('Zamazenta') && defender.hasItem('Rusted Shield')) ||
        (defender.name.includes('Ogerpon-Cornerstone') && defender.hasItem('Cornerstone Mask')) ||
        (defender.name.includes('Ogerpon-Hearthflame') && defender.hasItem('Hearthflame Mask')) ||
        (defender.name.includes('Ogerpon-Wellspring') && defender.hasItem('Wellspring Mask')) ||
        (defender.named('Venomicon-Epilogue') && defender.hasItem('Vile Vial'));
    if (!resistedKnockOffDamage && defender.item) {
        var item = gen.items.get((0, util_1.toID)(defender.item));
        resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
    }
    if (move.named('Thief', 'Cover') && !resistedKnockOffDamage && field.hasTerrain('Back-Alley')) {
        move.bp = basePower * 2;
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
        (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
        (move.named('Venoshock') && (defender.hasStatus('psn', 'tox') || field.hasTerrain('Corrosive-Mist', 'Murkwater', 'Corrosive', 'Wasteland'))) ||
        (move.named('Lash Out') && ((0, util_2.countBoosts)(gen, attacker.boosts) < 0))) {
        bpMods.push(8192);
        desc.moveBP = basePower * 2;
    }
    else if (move.named('Expanding Force') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Psychic')) {
        move.target = 'allAdjacentFoes';
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if ((move.named('Knock Off') && !resistedKnockOffDamage) ||
        (move.named('Misty Explosion') && (0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Misty')) ||
        (move.named('Grav Apple') && field.isGravity)) {
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if (move.named('Solar Beam', 'Solar Blade') &&
        field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail', 'Snow')) {
        bpMods.push(2048);
        desc.moveBP = basePower / 2;
        desc.weather = field.weather;
    }
    else if (move.named('Collision Course', 'Electro Drift')) {
        var isGhostRevealed = attacker.hasAbility('Scrappy') || attacker.hasAbility('Mind\'s Eye') ||
            field.defenderSide.isForesight;
        var isRingTarget = defender.hasItem('Ring Target') && !defender.hasAbility('Klutz');
        var types = defender.teraType ? [defender.teraType] : defender.types;
        var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, types[0], isGhostRevealed, field.isGravity, isRingTarget);
        var type2Effectiveness = types[1] ? (0, util_2.getMoveEffectiveness)(gen, move, types[1], isGhostRevealed, field.isGravity, isRingTarget) : 1;
        if (type1Effectiveness * type2Effectiveness >= 2) {
            bpMods.push(5461);
            desc.moveBP = basePower * (5461 / 4096);
        }
    }
    if (field.attackerSide.isHelpingHand) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    if ((attacker.hasAbility('Technician') && basePower <= 60) ||
        (attacker.hasAbility('Technician') && basePower <= 80 && field.hasTerrain('Factory', 'Concert-H', 'Concert-LH', 'Concert-NH', 'Concert-SH')) ||
        (attacker.hasAbility('Flare Boost') &&
            attacker.hasStatus('brn') && move.category === 'Special' && !field.hasTerrain('Frozen')) ||
        (attacker.hasAbility('Flare Boost') && field.hasTerrain('Volcanic', 'Infernal') && move.category === 'Special') ||
        (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Sharpness') && move.flags.slicing)) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Toxic Boost') && move.category === 'Physical') {
        if (attacker.hasStatus('psn', 'tox') || field.hasTerrain('Corrosive-Mist', 'Wasteland') || ((0, util_2.isGrounded)(attacker, field) && field.hasTerrain('Murkwater', 'Corrosive'))) {
            bpMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
        else if (field.hasTerrain('Corrupted')) {
            bpMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
    }
    if (attacker.hasAbility('Steely Spirit') && move.hasType('Steel')) {
        if (field.hasTerrain('Fairy-Tale')) {
            bpMods.push(8192);
        }
        else {
            bpMods.push(6144);
        }
        desc.attackerAbility = attacker.ability;
    }
    var aura = "".concat(move.type, " Aura");
    var isAttackerAura = attacker.hasAbility(aura);
    var isDefenderAura = defender.hasAbility(aura);
    var isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
    var isFieldAuraBreak = field.isAuraBreak;
    var isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
    var isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
    var auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
    var auraBreak = isFieldAuraBreak || isUserAuraBreak;
    if (auraActive) {
        if (auraBreak) {
            bpMods.push(3072);
            desc.attackerAbility = attacker.ability;
            desc.defenderAbility = defender.ability;
        }
        else {
            bpMods.push(5448);
            if (isAttackerAura)
                desc.attackerAbility = attacker.ability;
            if (isDefenderAura)
                desc.defenderAbility = defender.ability;
        }
    }
    if ((attacker.hasAbility('Sheer Force') && (move.secondaries || move.named('Jet Punch', 'Order Up')) && !move.isMax) ||
        (attacker.hasAbility('Sand Force') && ((field.hasWeather('Sand') || field.hasTerrain('Desert', 'Ashen-Beach'))) && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Analytic') &&
            (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
        (attacker.hasAbility('Tough Claws') && move.flags.contact)) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Punk Rock') && move.flags.sound) {
        if (field.hasTerrain('Big-Top', 'Cave')) {
            bpMods.push(6144);
        }
        else {
            bpMods.push(5325);
        }
        desc.attackerAbility = attacker.ability;
        desc.terrain = field.terrain;
    }
    if (field.attackerSide.isBattery && move.category === 'Special') {
        bpMods.push(5325);
        desc.isBattery = true;
    }
    if (field.attackerSide.isPowerSpot) {
        bpMods.push(5325);
        desc.isPowerSpot = true;
    }
    if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
        if (attacker.gender === defender.gender) {
            bpMods.push(5120);
            desc.rivalry = 'buffed';
        }
        else {
            bpMods.push(3072);
            desc.rivalry = 'nerfed';
        }
        desc.attackerAbility = attacker.ability;
    }
    if (!move.isMax && hasAteAbilityTypeChange) {
        if ((attacker.hasAbility('Galvanize') && field.hasTerrain('Electric', 'Factory')) ||
            (attacker.hasAbility('Aerilate') && field.hasTerrain('Sky', 'Mountain', 'Snowy-Mountain')) ||
            (attacker.hasAbility('Refrigerate') && field.hasTerrain('Icy', 'Frozen', 'Snowy-Mountain')) ||
            (attacker.hasAbility('Pixilate') && field.hasTerrain('Misty'))) {
            bpMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
        else if (attacker.hasAbility('Galvanize') && field.hasTerrain('Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2')) {
            bpMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
        else {
            bpMods.push(4915);
            desc.attackerAbility = attacker.ability;
        }
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasItem('Punching Glove') && move.flags.punch) {
        bpMods.push(4506);
        desc.attackerItem = attacker.item;
    }
    if (gen.num <= 8 && defender.hasAbility('Heatproof') && move.hasType('Fire')) {
        bpMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        bpMods.push(5120);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Supreme Overlord') && attacker.alliesFainted) {
        var powMod = [4096, 4506, 4915, 5325, 5734, 6144];
        bpMods.push(powMod[Math.min(5, attacker.alliesFainted)]);
        desc.attackerAbility = attacker.ability;
        desc.alliesFainted = attacker.alliesFainted;
    }
    if (attacker.hasItem("".concat(move.type, " Gem"))) {
        bpMods.push(5325);
        desc.attackerItem = attacker.item;
    }
    else if ((((attacker.hasItem('Adamant Crystal') && attacker.named('Dialga-Origin')) ||
        (attacker.hasItem('Adamant Orb') && attacker.named('Dialga'))) && move.hasType('Steel', 'Dragon')) ||
        (((attacker.hasItem('Lustrous Orb') && attacker.named('Palkia')) ||
            (attacker.hasItem('Lustrous Globe') && attacker.named('Palkia-Origin'))) && move.hasType('Water', 'Dragon')) ||
        (((attacker.hasItem('Griseous Orb') || attacker.hasItem('Griseous Core')) && (attacker.named('Giratina-Origin') ||
            attacker.named('Giratina'))) && move.hasType('Ghost', 'Dragon')) ||
        (attacker.hasItem('Vile Vial') && attacker.named('Venomicon-Epilogue') && move.hasType('Poison', 'Flying')) ||
        (attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') && move.hasType('Psychic', 'Dragon')) ||
        attacker.item && move.hasType((0, items_1.getItemBoostType)(attacker.item)) ||
        (attacker.name.includes('Ogerpon-Cornerstone') && attacker.hasItem('Cornerstone Mask')) ||
        (attacker.name.includes('Ogerpon-Hearthflame') && attacker.hasItem('Hearthflame Mask')) ||
        (attacker.name.includes('Ogerpon-Wellspring') && attacker.hasItem('Wellspring Mask'))) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
        (attacker.hasItem('Wise Glasses') && move.category === 'Special')) {
        bpMods.push(4505);
        desc.attackerItem = attacker.item;
    }
    return bpMods;
}
exports.calculateBPModsSMSSSV = calculateBPModsSMSSSV;
function calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var attack;
    var attackSource = move.named('Foul Play') ? defender : attacker;
    if (move.named('Photon Geyser', 'Light That Burns The Sky') ||
        (move.named('Tera Blast') && attackSource.teraType)) {
        move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
    }
    var attackStat = move.named('Shell Side Arm') && (0, util_2.getShellSideArmCategory)(attacker, defender) === 'Physical' ? 'atk'
        : move.named('Body Press') ? 'def'
            : field.hasTerrain('Glitch') && move.category === 'Special' && attackSource.stats.spa < attackSource.stats.spd ? 'spd'
                : move.category === 'Special' ? 'spa'
                    : 'atk';
    desc.attackEVs =
        move.named('Foul Play')
            ? (0, util_2.getEVDescriptionText)(gen, defender, attackStat, defender.nature)
            : (0, util_2.getEVDescriptionText)(gen, attacker, attackStat, attacker.nature);
    if (attackSource.boosts[attackStat] === 0 ||
        (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    else if (defender.hasAbility('Unaware')) {
        attack = attackSource.rawStats[attackStat];
        desc.defenderAbility = defender.ability;
    }
    else {
        attack = attackSource.stats[attackStat];
        desc.attackBoost = attackSource.boosts[attackStat];
    }
    if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
        if (field.hasTerrain('City', 'Back-Alley')) {
            attack *= 1.75;
        }
        else {
            attack = (0, util_2.pokeRound)((attack * 3) / 2);
        }
        desc.attackerAbility = attacker.ability;
    }
    var atMods = calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc);
    attack = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((attack * (0, util_2.chainMods)(atMods, 410, 131072)) / 4096)));
    return attack;
}
exports.calculateAttackSMSSSV = calculateAttackSMSSSV;
function calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc) {
    var atMods = [];
    if ((attacker.hasAbility('Slow Start') && !field.hasTerrain('Deep-Earth') && attacker.abilityOn &&
        (move.category === 'Physical' || (move.category === 'Special' && move.isZ))) ||
        (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2) ||
        (!attacker.hasType('Water') && move.category == 'Physical' && !(attacker.hasAbility('Steelworker', 'Swift Swim')))) {
        atMods.push(2048);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Corrosion') && field.hasTerrain('Corrosive-Mist', 'Corrupted', 'Corrosive')) ||
        (attacker.hasAbility('Magician') && field.hasTerrain('Fairy-Tale') && move.category === 'Special') ||
        (attacker.hasAbility('Intrepid Sword') && field.hasTerrain('Fairy-Tale')) ||
        (attacker.hasAbility('Stance Change Blade') && field.hasTerrain('Fairy-Tale', 'Chess') && move.category === 'Physical') ||
        (attacker.hasAbility('Iluminate') && move.category === 'Special' && field.hasTerrain('Starlight')) ||
        (attacker.hasAbility('Anticipation', 'Forewarn') && move.category === 'Special' && field.hasTerrain('Psychic'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Solar Power') && field.hasWeather('Sun', 'Harsh Sunshine') && move.category === 'Special' && !field.hasTerrain('Frozen')) ||
        (attacker.named('Cherrim') && attacker.hasAbility('Flower Gift') && (field.hasWeather('Sun', 'Harsh Sunshine') ||
            field.hasTerrain('Bewitched', 'Flower-Garden-1', 'Flower-Garden-2', 'Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5')) &&
            move.category === 'Physical') ||
        (attacker.hasAbility('Gorilla Tactics') && move.category === 'Physical' && !attacker.isDynamaxed)) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if (field.attackerSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.category === 'Physical') {
        atMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftAttacker = true;
    }
    else if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
        (attacker.curHP() <= attacker.maxHP() / 3 &&
            ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
                (attacker.hasAbility('Blaze') && move.hasType('Fire') && !field.hasTerrain('Frozen')) ||
                (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
                (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')) ||
        (move.category === 'Special' && attacker.hasAbility('Plus', 'Minus') && field.hasTerrain('Short-Circuit-0.8', 'Short-Circuit-1.5', 'Short-Circuit-0.5', 'Short-Circuit-1.2', 'Short-Circuit-2')) ||
        (attacker.hasAbility('Blaze') && move.hasType('Fire') && field.hasTerrain('Volcanic', 'Infernal')) ||
        (attacker.hasAbility('Queenly Majesty') && field.hasTerrain('Fairy-Tale', 'Chess')) ||
        (attacker.hasAbility('Intrepid Sword', 'Justified', 'No Guard') && field.hasTerrain('Colosseum')) ||
        (attacker.hasAbility('Torrent') && move.hasType('Water') && field.hasTerrain('Water', 'Underwater')) ||
        (attacker.hasAbility('Overgrow') && move.hasType('Grass') && field.hasTerrain('Forest')) ||
        (attacker.hasAbility('Overgrow') && move.hasType('Grass') && attacker.curHP() <= attacker.maxHP() * 0.66 && field.hasTerrain('Flower-Garden-2')) ||
        (attacker.hasAbility('Swarm') && move.hasType('Bug') && field.hasTerrain('Forest', 'Flower-Garden-1', 'Flower-Garden-2')) ||
        (attacker.hasAbility('Long Reach') && field.hasTerrain('Mountain', 'Snowy-Mountain')) ||
        (attacker.hasAbility('Lightning Rod') && field.hasTerrain('Electric') && move.category === 'Special') ||
        (attacker.hasItem('Cell Battery') && field.hasTerrain('Electric') && move.category === 'Physical')) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Overgrow') && move.hasType('Grass') && field.hasTerrain('Flower-Garden-3')) {
        atMods.push(6553);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Overgrow') && move.hasType('Grass') && field.hasTerrain('Flower-Garden-4') ||
        (attacker.hasAbility('Swarm') && move.hasType('Bug') && field.hasTerrain('Flower-Garden-3', 'Flower-Garden-4'))) {
        atMods.push(7373);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Swarm') && move.hasType('Bug') && field.hasTerrain('Flower-Garden-5')) ||
        (attacker.hasAbility('Overgrow') && move.hasType('Grass') && field.hasTerrain('Flower-Garden-5'))) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
        desc.terrain = field.terrain;
    }
    else if ((attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire') && !field.hasTerrain('Frozen')) ||
        (attacker.hasAbility('Flash Fire') && move.hasType('Fire') && field.hasTerrain('Volcanic', 'Infernal'))) {
        atMods.push(6144);
        desc.attackerAbility = 'Flash Fire';
    }
    else if ((attacker.hasAbility('Dragon\'s Maw') && move.hasType('Dragon')) ||
        (attacker.hasAbility('Propeller Tail') && field.hasTerrain('Water', 'Underwater') && move.priority > 0) ||
        (attacker.hasAbility('Rocky Payload') && move.hasType('Rock'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Steelworker') && move.hasType('Steel')) {
        if (field.hasTerrain('Factory')) {
            atMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
        else {
            atMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
    }
    else if (move.hasType('Electric') && attacker.hasAbility('Teravolt') && field.hasTerrain('Electric')) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Transistor') && move.hasType('Electric')) {
        atMods.push(gen.num >= 9 ? 5325 : 6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Stakeout') && attacker.abilityOn) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Water Bubble') && move.hasType('Water')) ||
        (attacker.hasAbility('Huge Power') && move.category === 'Physical')) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Pure Power')) {
        if (field.hasTerrain('Psychic') && move.category === 'Special') {
            atMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
        else if (move.category === 'Physical') {
            atMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
    }
    if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
        (defender.hasAbility('Water Bubble') && move.hasType('Fire')) ||
        (defender.hasAbility('Purifying Salt') && move.hasType('Ghost'))) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (gen.num >= 9 && defender.hasAbility('Heatproof') && move.hasType('Fire')) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    var isTabletsOfRuinActive = (defender.hasAbility('Tablets of Ruin') || field.isTabletsOfRuin) &&
        !attacker.hasAbility('Tablets of Ruin');
    var isVesselOfRuinActive = (defender.hasAbility('Vessel of Ruin') || field.isVesselOfRuin) &&
        !attacker.hasAbility('Vessel of Ruin');
    if ((isTabletsOfRuinActive && move.category === 'Physical') ||
        (isVesselOfRuinActive && move.category === 'Special')) {
        if (defender.hasAbility('Tablets of Ruin') || defender.hasAbility('Vessel of Ruin')) {
            desc.defenderAbility = defender.ability;
        }
        else {
            desc[move.category === 'Special' ? 'isVesselOfRuin' : 'isTabletsOfRuin'] = true;
        }
        atMods.push(3072);
    }
    if ((0, util_2.isQPActive)(attacker, field)) {
        if ((move.category === 'Physical' && (0, util_2.getQPBoostedStat)(attacker) === 'atk') ||
            (move.category === 'Special' && (0, util_2.getQPBoostedStat)(attacker) === 'spa')) {
            atMods.push(5325);
            desc.attackerAbility = attacker.ability;
        }
    }
    if ((attacker.hasAbility('Hadron Engine') && move.category === 'Special' &&
        field.hasTerrain('Electric') && (0, util_2.isGrounded)(attacker, field)) ||
        (attacker.hasAbility('Orichalcum Pulse') && move.category === 'Physical' &&
            field.hasWeather('Sun', 'Harsh Sunshine') && !attacker.hasItem('Utility Umbrella'))) {
        atMods.push(5461);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Skill Link') && move.flags.multihit && field.hasTerrain('Colosseum')) {
        atMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if ((attacker.hasItem('Thick Club') &&
        attacker.named('Cubone', 'Marowak', 'Marowak-Alola', 'Marowak-Alola-Totem') &&
        move.category === 'Physical') ||
        (attacker.hasItem('Deep Sea Tooth') &&
            attacker.named('Clamperl') &&
            move.category === 'Special') ||
        (attacker.hasItem('Light Ball') && attacker.name.includes('Pikachu') && !move.isZ)) {
        atMods.push(8192);
        desc.attackerItem = attacker.item;
    }
    else if (!move.isZ && !move.isMax &&
        ((attacker.hasItem('Choice Band') && move.category === 'Physical') ||
            (attacker.hasItem('Choice Specs') && move.category === 'Special'))) {
        atMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    if ((attacker.hasAbility('Slow Start') && field.hasTerrain('Deep-Earth') && move.category === 'Physical') ||
        (attacker.hasAbility('Mercilees', 'Pickpocket') && field.hasTerrain('Back-Alley') && move.category === 'Physical') ||
        (attacker.hasAbility('Magician') && field.hasTerrain('Back-Alley') && move.category === 'Special') ||
        (attacker.hasAbility('Early Bird') && field.hasTerrain('City') && move.category === 'Physical') ||
        (attacker.hasAbility('Frisk') && field.hasTerrain('City') && move.category === 'Special') ||
        (attacker.hasAbility('Pressure') && field.hasTerrain('Dimensional', 'Frozen')) ||
        (attacker.hasItem('Magnet') && field.hasTerrain('Deep-Earth') && move.category === 'Special') ||
        (attacker.hasAbility('Berserker') && field.hasTerrain('Dimensional', 'Frozen') && move.category === 'Special') ||
        (attacker.hasAbility('Anger Point', 'Justified') && field.hasTerrain('Dimensional', 'Frozen') && move.category === 'Physical')) {
        atMods.push(6144);
    }
    if (attacker.hasItem('Eviolite') && field.hasTerrain('Glitch')) {
        atMods.push(6144);
    }
    if (field.hasWeather('Shadow Sky')) {
        if (move.hasType('Shadow', 'Ghost', 'Dark')) {
            atMods.push(6144);
        }
        else if (move.hasType('Fairy')) {
            atMods.push(2048);
        }
    }
    switch (attacker.item) {
        case 'Magcargo Crest':
            if (attacker.named('Magcargo') && move.category === 'Special') {
                atMods.push(6144);
            }
            break;
        case 'Stantler Crest':
            if ((attacker.named('Stantler') || attacker.named('Wyrdeer') && move.category === 'Physical')) {
                atMods.push(6144);
            }
            break;
        case 'Hypno Crest':
            if (attacker.named('Hypno') && move.category === 'Special') {
                atMods.push(6144);
            }
            break;
        case 'Relicanth Crest':
            if (attacker.named('Relicanth') && move.category === 'Physical') {
                atMods.push(4915);
            }
            break;
        case 'Oricorio Crest':
            if ((attacker.named('Oricorio', 'Oricorio-Pa\'u', 'Oricorio-Pom-Pom', 'Oricorio-Sensu') && move.category === 'Special')) {
                atMods.push(5120);
            }
            break;
        case 'Cofagrigus Crest':
            if (attacker.named('Cofagrigus') && move.category === 'Special') {
                atMods.push(5120);
            }
            break;
        case 'Dusknoir Crest':
            if (attacker.named('Dusknoir') && move.category === 'Physical') {
                atMods.push(4915);
            }
            break;
        case 'Skuntank Crest':
            if (attacker.named('Skuntank') && move.category === 'Physical') {
                atMods.push(4915);
            }
            break;
        case 'Cherrim Crest':
            if (attacker.named('Cherrim-Sunshine')) {
                atMods.push(6144);
            }
            break;
        case 'Whiscash Crest':
            if (attacker.named('Whiscash')) {
                atMods.push(4915);
            }
            break;
        case 'Electrode Crest':
            if (attacker.named('Electrode') && move.category === 'Physical') {
                atMods.push(8192);
            }
            break;
        case 'Simisear Crest':
            if (attacker.named('Simisear')) {
                atMods.push(4915);
            }
            break;
        case 'Simipour Crest':
            if (attacker.named('Simipour')) {
                atMods.push(4915);
            }
            break;
        case 'Simisage Crest':
            if (attacker.named('Simisage')) {
                atMods.push(4915);
            }
            break;
    }
    return atMods;
}
exports.calculateAtModsSMSSSV = calculateAtModsSMSSSV;
function calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var defense;
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
        (move.named('Shell Side Arm') && (0, util_2.getShellSideArmCategory)(attacker, defender) === 'Physical');
    var defenseStat = hitsPhysical ? 'def'
        : !hitsPhysical && field.hasTerrain('Glitch') && defender.stats.spa > defender.stats.spd ? 'spa'
            : 'spd';
    desc.defenseEVs = (0, util_2.getEVDescriptionText)(gen, defender, defenseStat, defender.nature);
    if (defender.boosts[defenseStat] === 0 ||
        (isCritical && defender.boosts[defenseStat] > 0) ||
        move.ignoreDefensive) {
        defense = defender.rawStats[defenseStat];
    }
    else if (attacker.hasAbility('Unaware')) {
        defense = defender.rawStats[defenseStat];
        desc.attackerAbility = attacker.ability;
    }
    else {
        defense = defender.stats[defenseStat];
        desc.defenseBoost = defender.boosts[defenseStat];
    }
    if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
        defense = (0, util_2.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    if (field.hasWeather('Snow') && defender.hasType('Ice') && hitsPhysical) {
        defense = (0, util_2.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    var dfMods = calculateDfModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical);
    return (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((defense * (0, util_2.chainMods)(dfMods, 410, 131072)) / 4096)));
}
exports.calculateDefenseSMSSSV = calculateDefenseSMSSSV;
function calculateDfModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical) {
    var _a;
    if (isCritical === void 0) { isCritical = false; }
    if (hitsPhysical === void 0) { hitsPhysical = false; }
    var dfMods = [];
    if (defender.hasType('Fairy') && field.hasTerrain('Misty') && !hitsPhysical) {
        dfMods.push(6144);
    }
    if ((defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) ||
        (defender.hasAbility('Marvel Scale') && field.hasTerrain('Misty', 'Dragon-Den', 'Rainbow', 'Fairy-Tale', 'Starlight') && hitsPhysical)) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if ((defender.hasAbility('Magma Armor') && field.hasTerrain('Volcanic') && hitsPhysical) ||
        (defender.hasAbility('Magma Armor', 'Flame Body', 'Desolate Land') && field.hasTerrain('Infernal') && hitsPhysical) ||
        (defender.hasAbility('Magma Armor') && field.hasTerrain('Dragon-Den')) ||
        (defender.hasAbility('Shell Armor') && field.hasTerrain('Dragon-Den') && hitsPhysical) ||
        (defender.hasAbility('Power of Alchemy') && field.hasTerrain('Fairy-Tale')) ||
        (defender.hasAbility('Shell Armor', 'Battle Armor') && field.hasTerrain('Fairy-Tale', 'Colosseum') && hitsPhysical) ||
        (defender.hasAbility('Stance Change Shield') && field.hasTerrain('Chess', 'Fairy-Tale') && hitsPhysical) ||
        (defender.hasAbility('Magic Guard', 'Mirror Armor') && field.hasTerrain('Colosseum') && !hitsPhysical) ||
        (defender.hasAbility('Magic Bounce', 'Pastel Veil', 'Magic Guard', 'Mirror Armor') && field.hasTerrain('Fairy-Tale') && !hitsPhysical) ||
        (defender.hasAbility('Dauntless Shield') && field.hasTerrain('Fairy-Tale')) ||
        (defender.hasAbility('Dauntless Shield') && field.hasTerrain('Colosseum')) ||
        (defender.hasAbility('Stall') && field.hasTerrain('Chess') && hitsPhysical) ||
        (defender.hasType('Ground') && !hitsPhysical && field.hasTerrain('Desert'))) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.named('Cherrim') && defender.hasAbility('Flower Gift') && field.hasWeather('Sun', 'Harsh Sunshine') && !hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
        desc.weather = field.weather;
    }
    else if (defender.hasAbility('Transistor') && field.hasTerrain('Electric') && move.hasType('Ground')) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Pastel Veil') && field.hasTerrain('Misty', 'Rainbow') && move.hasType('Poison')) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
        desc.terrain = field.terrain;
    }
    else if (defender.hasAbility('Flower Veil') && field.hasTerrain('Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5')) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
        desc.terrain = field.terrain;
    }
    else if (field.defenderSide.isFlowerGift && field.hasWeather('Sun', 'Harsh Sunshine') && !hitsPhysical) {
        dfMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftDefender = true;
    }
    else if (defender.hasAbility('Grass Pelt') && field.hasTerrain('Grassy', 'Forest', 'Flower-Garden-2', 'Flower-Garden-3', 'Flower-Garden-4', 'Flower-Garden-5') && hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    if ((defender.hasType('Dragon') && field.hasTerrain('Dragon-Den') && !hitsPhysical)) {
        dfMods.push(6144);
        desc.terrain = field.terrain;
    }
    if (defender.hasAbility('Big Pecks') && field.hasTerrain('Sky') && hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
        desc.terrain = field.terrain;
    }
    if (move.named('Explosion', 'Self-Destruct') && field.hasTerrain('Glitch')) {
        dfMods.push(2046);
        desc.terrain = field.terrain;
    }
    var isSwordOfRuinActive = (attacker.hasAbility('Sword of Ruin') || field.isSwordOfRuin) &&
        !defender.hasAbility('Sword of Ruin');
    var isBeadsOfRuinActive = (attacker.hasAbility('Beads of Ruin') || field.isBeadsOfRuin) &&
        !defender.hasAbility('Beads of Ruin');
    if ((isSwordOfRuinActive && hitsPhysical) ||
        (isBeadsOfRuinActive && !hitsPhysical)) {
        if (attacker.hasAbility('Sword of Ruin') || attacker.hasAbility('Beads of Ruin')) {
            desc.attackerAbility = attacker.ability;
        }
        else {
            desc[hitsPhysical ? 'isSwordOfRuin' : 'isBeadsOfRuin'] = true;
        }
        dfMods.push(3072);
    }
    if ((0, util_2.isQPActive)(defender, field)) {
        if ((hitsPhysical && (0, util_2.getQPBoostedStat)(defender) === 'def') ||
            (!hitsPhysical && (0, util_2.getQPBoostedStat)(defender) === 'spd')) {
            desc.defenderAbility = defender.ability;
            dfMods.push(5324);
        }
    }
    if ((defender.hasItem('Eviolite') &&
        (defender.name === 'Dipplin' || ((_a = gen.species.get((0, util_1.toID)(defender.name))) === null || _a === void 0 ? void 0 : _a.nfe))) ||
        (!hitsPhysical && defender.hasItem('Assault Vest'))) {
        dfMods.push(6144);
        desc.defenderItem = defender.item;
    }
    else if ((defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
        (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)) {
        dfMods.push(8192);
        desc.defenderItem = defender.item;
    }
    if (defender.hasType('Ghost', 'Dark') && field.hasTerrain('Dark-Crystal')) {
        dfMods.push(6144);
    }
    if ((defender.hasAbility('Heavy Metal') && hitsPhysical && field.hasTerrain('Deep-Earth', 'Factory')) ||
        defender.hasAbility('Slow Start') && field.hasTerrain('Deep-Earth') ||
        (defender.hasAbility('Anticipation', 'Forewarn') && field.hasTerrain('Back-Alley')) ||
        (defender.hasAbility('Big Pecks') && field.hasTerrain('City') && hitsPhysical) ||
        (defender.hasType('Ice') && field.hasTerrain('Snowy-Mountain', 'Icy') && field.hasWeather('Hail') && hitsPhysical) ||
        (defender.hasType('Ghost') && field.hasTerrain('Dimensional')) ||
        (attacker.hasAbility('Heavy Metal', 'Solid Rock', 'Punk Rock', 'Soundproof', 'Rock Head') && field.hasTerrain('Concert-NH', 'Concert-H', 'Concert-LH', 'Concert-SH'))) {
        dfMods.push(6144);
    }
    if (!(0, util_2.isGrounded)(defender, field) && field.hasTerrain('New-World') && hitsPhysical) {
        dfMods.push(3686);
    }
    if (field.hasTerrain('Frozen')) {
        if (defender.hasType('Ice', 'Ghost')) {
            dfMods.push(4915);
        }
        else if (defender.hasType('Fire')) {
            dfMods.push(3277);
        }
    }
    switch (defender.item) {
        case 'Magcargo Crest':
            if (defender.named('Magcargo')) {
                defender.stats.def = defender.stats.spe;
            }
            break;
        case 'Relicanth Crest':
            if (defender.named('Relicanth') && move.category === 'Special') {
                dfMods.push(5324);
            }
            break;
        case 'Cofagrigus Crest':
            if (defender.named('Cofagrigus') && move.category === 'Special') {
                dfMods.push(5120);
            }
            break;
        case 'Noctowl Crest':
            if (defender.named('Noctowl') && move.category === 'Physical') {
                dfMods.push(4915);
            }
            break;
        case 'Phione Crest':
            if (defender.named('Phione')) {
                dfMods.push(6144);
            }
            break;
        case 'Crabominable Crest':
            if (defender.named('Crabominable') && move.category === 'Physical') {
                dfMods.push(4915);
            }
            break;
    }
    return dfMods;
}
exports.calculateDfModsSMSSSV = calculateDfModsSMSSSV;
function calculateBaseDamageSMSSSV(gen, attacker, defender, basePower, attack, defense, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var baseDamage = (0, util_2.getBaseDamage)(attacker.level, basePower, attack, defense);
    var isSpread = field.gameType !== 'Singles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    if (isSpread) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 3072) / 4096);
    }
    if (attacker.hasAbility('Parental Bond (Child)')) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 1024) / 4096);
    }
    if (field.hasWeather('Sun') && move.named('Hydro Steam') && !attacker.hasItem('Utility Umbrella')) {
        baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 6144) / 4096);
        desc.weather = field.weather;
    }
    else if (!defender.hasItem('Utility Umbrella')) {
        if ((field.hasWeather('Sun', 'Harsh Sunshine') && move.hasType('Fire')) ||
            (field.hasWeather('Rain', 'Heavy Rain') && move.hasType('Water'))) {
            baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 6144) / 4096);
            desc.weather = field.weather;
        }
        else if ((field.hasWeather('Sun') && move.hasType('Water')) ||
            (field.hasWeather('Rain') && move.hasType('Fire'))) {
            baseDamage = (0, util_2.pokeRound)((0, util_2.OF32)(baseDamage * 2048) / 4096);
            desc.weather = field.weather;
        }
    }
    if (isCritical) {
        baseDamage = Math.floor((0, util_2.OF32)(baseDamage * 1.5));
        desc.isCritical = isCritical;
    }
    return baseDamage;
}
function calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, hitCount) {
    if (isCritical === void 0) { isCritical = false; }
    if (hitCount === void 0) { hitCount = 0; }
    var finalMods = [];
    if (field.defenderSide.isReflect && move.category === 'Physical' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732
            : field.hasWeather('Shadow Sky') ? 1638
                : 2048);
        desc.isReflect = true;
    }
    else if (field.defenderSide.isLightScreen && move.category === 'Special' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732
            : field.hasWeather('Shadow Sky') ? 1638
                : 2048);
        desc.isLightScreen = true;
    }
    if (field.defenderSide.isAuroraVeil && !isCritical) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isAuroraVeil = true;
    }
    if (attacker.hasAbility('Neuroforce') && typeEffectiveness > 1) {
        finalMods.push(5120);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Sniper') && isCritical) ||
        (attacker.hasAbility('Victory Star') && field.hasTerrain('Starlight', 'New-World'))) {
        finalMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
        finalMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.isDynamaxed && move.named('Dynamax Cannon', 'Behemoth Blade', 'Behemoth Bash')) {
        finalMods.push(8192);
    }
    if ((defender.hasAbility('Multiscale', 'Shadow Shield') &&
        defender.curHP() === defender.maxHP() &&
        hitCount === 0 &&
        (!field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) ||
            defender.hasItem('Heavy-Duty Boots')) && !attacker.hasAbility('Parental Bond (Child)')) ||
        (defender.hasAbility('Shadow Shield') && field.hasTerrain('Dark-Crystal', 'Dimensional'))) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Shadow Shield') && field.hasTerrain('Starlight', 'New-World')) {
        finalMods.push(3072);
    }
    if (defender.hasAbility('Prism Armor') && field.hasTerrain('Dark-Crystal', 'Rainbow', 'Crystal')) {
        finalMods.push(2744);
    }
    if (defender.hasAbility('Fluffy') && move.flags.contact && !attacker.hasAbility('Long Reach')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if ((defender.hasAbility('Punk Rock') && move.flags.sound) ||
        (defender.hasAbility('Ice Scales') && move.category === 'Special')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if ((defender.hasAbility('Solid Rock', 'Filter', 'Prism Armor') && typeEffectiveness > 1)) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (field.defenderSide.isFriendGuard) {
        finalMods.push(3072);
        desc.isFriendGuard = true;
    }
    if (defender.hasAbility('Fluffy') && move.hasType('Fire')) {
        finalMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
        finalMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Life Orb')) {
        finalMods.push(5324);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome >= 1) {
        var timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome);
        if (timesUsedWithMetronome <= 4) {
            finalMods.push(4096 + timesUsedWithMetronome * 819);
        }
        else {
            finalMods.push(8192);
        }
        desc.attackerItem = attacker.item;
    }
    if (move.hasType((0, items_1.getBerryResistType)(defender.item)) &&
        (typeEffectiveness > 1 || move.hasType('Normal')) &&
        hitCount === 0 &&
        !attacker.hasAbility('Unnerve', 'As One (Glastrier)', 'As One (Spectrier)')) {
        if (defender.hasAbility('Ripen')) {
            finalMods.push(1024);
        }
        else {
            finalMods.push(2048);
        }
        desc.defenderItem = defender.item;
    }
    if (field.hasTerrain('Chess') && move.named('Psychic', 'Strength', 'Rock Throw', 'Ancient Power', 'Nature Power', 'Continental Crush', 'Barrage', 'Secret Power', 'Shattered Psyche')) {
        if (defender.hasAbility('Oblivious', 'Simple', 'Unaware', 'Klutz', 'Defeatist')) {
            finalMods.push(8192);
        }
        else if (defender.hasAbility('Adaptability', 'Synchronize', 'Anticipation', 'Telepathy')) {
            finalMods.push(2048);
        }
    }
    if (attacker.hasAbility('Reckless', 'Gorilla Tactics') && field.hasTerrain('Chess')) {
        finalMods.push(4915);
    }
    if (defender.hasType('Grass') && field.hasTerrain('Flower-Garden-3')) {
        if (field.hasTerrain('Flower-Garden-3')) {
            finalMods.push(3072);
        }
        else if (field.hasTerrain('Flower-Garden-4')) {
            finalMods.push(2703);
        }
        else if (field.hasTerrain('Flower-Garden-5')) {
            finalMods.push(2048);
        }
    }
    return finalMods;
}
exports.calculateFinalModsSMSSSV = calculateFinalModsSMSSSV;
function hasTerrainSeed(pokemon) {
    return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}
//# sourceMappingURL=gen789.js.map