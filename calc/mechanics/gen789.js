"use strict";
exports.__esModule = true;

var util_1 = require("../util");
var items_1 = require("../items");
var result_1 = require("../result");
var util_2 = require("./util");
function calculateSMSSSV(gen, attacker, defender, move, field) {
    var _a;
    (0, util_2.checkAirLock)(attacker, field);
    (0, util_2.checkAirLock)(defender, field);
    (0, util_2.checkTeraformZero)(attacker, field);
    (0, util_2.checkTeraformZero)(defender, field);
    (0, util_2.checkForecast)(attacker, field.weather);
    (0, util_2.checkForecast)(defender, field.weather);
    (0, util_2.checkItem)(attacker, field.isMagicRoom);
    (0, util_2.checkItem)(defender, field.isMagicRoom);
    (0, util_2.checkWonderRoom)(attacker, field.isWonderRoom);
    (0, util_2.checkWonderRoom)(defender, field.isWonderRoom);
    (0, util_2.checkSeedBoost)(attacker, field);
    (0, util_2.checkSeedBoost)(defender, field);
    (0, util_2.checkDauntlessShield)(attacker, gen);
    (0, util_2.checkDauntlessShield)(defender, gen);
    (0, util_2.checkEmbody)(attacker, gen);
    (0, util_2.checkEmbody)(defender, gen);
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, "def", "spd", "spe");
    (0, util_2.checkIntimidate)(gen, attacker, defender);
    (0, util_2.checkIntimidate)(gen, defender, attacker);
    (0, util_2.checkDownload)(attacker, defender, field.isWonderRoom);
    (0, util_2.checkDownload)(defender, attacker, field.isWonderRoom);
    (0, util_2.checkIntrepidSword)(attacker, gen);
    (0, util_2.checkIntrepidSword)(defender, gen);
    (0, util_2.checkWindRider)(attacker, field.attackerSide);
    (0, util_2.checkWindRider)(defender, field.defenderSide);
    if (move.named("Meteor Beam", "Electro Shot")) {
        attacker.boosts.spa += attacker.hasAbility("Simple")
            ? 2
            : attacker.hasAbility("Contrary")
                ? -1
                : 1;
        attacker.boosts.spa = Math.min(6, Math.max(-6, attacker.boosts.spa));
    }
    (0, util_2.computeFinalStats)(gen, attacker, defender, field, "atk", "spa");
    (0, util_2.checkInfiltrator)(attacker, field.defenderSide);
    (0, util_2.checkInfiltrator)(defender, field.attackerSide);
    var desc = {
        attackerName: attacker.name,
        moveName: move.name,
        defenderName: defender.name,
        isDefenderDynamaxed: defender.isDynamaxed,
        isWonderRoom: field.isWonderRoom
    };
    if (attacker.teraType !== "Stellar" ||
        move.name === "Tera Blast" ||
        move.isStellarFirstUse) {
        desc.isStellarFirstUse =
            attacker.name !== "Terapagos-Stellar" &&
                move.name === "Tera Blast" &&
                attacker.teraType === "Stellar" &&
                move.isStellarFirstUse;
        desc.attackerTera = attacker.teraType;
    }
    if (defender.teraType !== "Stellar")
        desc.defenderTera = defender.teraType;
    if (move.named("Photon Geyser", "Light That Burns the Sky") ||
        (move.named("Tera Blast") && attacker.teraType)) {
        move.category =
            attacker.stats.atk > attacker.stats.spa ? "Physical" : "Special";
    }
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === "Status" && !move.named("Nature Power")) {
        return result;
    }
    if (move.flags.punch && attacker.hasItem("Punching Glove")) {
        desc.attackerItem = attacker.item;
        move.flags.contact = 0;
    }
    if (move.named("Shell Side Arm") &&
        (0, util_2.getShellSideArmCategory)(attacker, defender) === "Physical") {
        move.flags.contact = 1;
    }
    var breaksProtect = move.breaksProtect ||
        move.isZ ||
        attacker.isDynamaxed ||
        (attacker.hasAbility("Unseen Fist") && move.flags.contact);
    if (field.defenderSide.isProtected && !breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    if (move.name === "Pain Split") {
        var average = Math.floor((attacker.curHP() + defender.curHP()) / 2);
        var damage_1 = Math.max(0, defender.curHP() - average);
        result.damage = damage_1;
        return result;
    }
    var defenderAbilityIgnored = defender.hasAbility("Armor Tail", "Aroma Veil", "Aura Break", "Battle Armor", "Big Pecks", "Bulletproof", "Clear Body", "Contrary", "Damp", "Dazzling", "Disguise", "Dry Skin", "Earth Eater", "Filter", "Flash Fire", "Flower Gift", "Flower Veil", "Fluffy", "Friend Guard", "Fur Coat", "Good as Gold", "Grass Pelt", "Guard Dog", "Heatproof", "Heavy Metal", "Hyper Cutter", "Ice Face", "Ice Scales", "Illuminate", "Immunity", "Inner Focus", "Insomnia", "Keen Eye", "Leaf Guard", "Levitate", "Light Metal", "Lightning Rod", "Limber", "Magic Bounce", "Magma Armor", "Marvel Scale", "Mind's Eye", "Mirror Armor", "Motor Drive", "Multiscale", "Oblivious", "Overcoat", "Own Tempo", "Pastel Veil", "Punk Rock", "Purifying Salt", "Queenly Majesty", "Sand Veil", "Sap Sipper", "Shell Armor", "Shield Dust", "Simple", "Snow Cloak", "Solid Rock", "Soundproof", "Sticky Hold", "Storm Drain", "Sturdy", "Suction Cups", "Sweet Veil", "Tangled Feet", "Telepathy", "Tera Shell", "Thermal Exchange", "Thick Fat", "Unaware", "Vital Spirit", "Volt Absorb", "Water Absorb", "Water Bubble", "Water Veil", "Well-Baked Body", "White Smoke", "Wind Rider", "Wonder Guard", "Wonder Skin");
    var attackerIgnoresAbility = attacker.hasAbility("Mold Breaker", "Teravolt", "Turboblaze");
    var moveIgnoresAbility = move.named("G-Max Drum Solo", "G-Max Fire Ball", "G-Max Hydrosnipe", "Light That Burns the Sky", "Menacing Moonraze Maelstrom", "Moongeist Beam", "Photon Geyser", "Searing Sunraze Smash", "Sunsteel Strike");
    if (defenderAbilityIgnored &&
        (attackerIgnoresAbility || moveIgnoresAbility)) {
        if (attackerIgnoresAbility)
            desc.attackerAbility = attacker.ability;
        if (defender.hasItem("Ability Shield")) {
            desc.defenderItem = defender.item;
        }
        else {
            defender.ability = "";
        }
    }
    var ignoresNeutralizingGas = [
        "As One (Glastrier)",
        "As One (Spectrier)",
        "Battle Bond",
        "Comatose",
        "Disguise",
        "Gulp Missile",
        "Ice Face",
        "Multitype",
        "Neutralizing Gas",
        "Power Construct",
        "RKS System",
        "Schooling",
        "Shields Down",
        "Stance Change",
        "Tera Shift",
        "Zen Mode",
        "Zero to Hero",
    ];
    if (attacker.hasAbility("Neutralizing Gas") &&
        !ignoresNeutralizingGas.includes(defender.ability || "")) {
        desc.attackerAbility = attacker.ability;
        if (defender.hasItem("Ability Shield")) {
            desc.defenderItem = defender.item;
        }
        else {
            defender.ability = "";
        }
    }
    if (defender.hasAbility("Neutralizing Gas") &&
        !ignoresNeutralizingGas.includes(attacker.ability || "")) {
        desc.defenderAbility = defender.ability;
        if (attacker.hasItem("Ability Shield")) {
            desc.attackerItem = attacker.item;
        }
        else {
            attacker.ability = "";
        }
    }
    var isCritical = !defender.hasAbility("Battle Armor", "Shell Armor") &&
        (move.isCrit ||
            (attacker.hasAbility("Merciless") &&
                (defender.hasStatus("psn", "tox") ||
                    field.hasTerrain("Corrosive", "Corrosive Mist", "Murkwater", "Wasteland")))) &&
        move.timesUsed === 1;
    var type = move.type;
    if (move.originalName === "Weather Ball") {
        var holdingUmbrella = attacker.hasItem("Utility Umbrella");
        type =
            field.hasWeather("Sun", "Harsh Sunshine") && !holdingUmbrella
                ? "Fire"
                : field.hasWeather("Rain", "Heavy Rain") && !holdingUmbrella
                    ? "Water"
                    : field.hasWeather("Sand")
                        ? "Rock"
                        : field.hasWeather("Hail", "Snow")
                            ? "Ice"
                            : "Normal";
        desc.weather = field.weather;
        desc.moveType = type;
    }
    else if ((move.named("Judgment") ||
        (move.named("Nature Power") && field.hasTerrain("Holy"))) &&
        attacker.item &&
        attacker.item.includes("Plate")) {
        type = (0, items_1.getItemBoostType)(attacker.item);
    }
    else if (move.originalName === "Techno Blast" &&
        attacker.item &&
        attacker.item.includes("Drive")) {
        type = (0, items_1.getTechnoBlast)(attacker.item);
        desc.moveType = type;
    }
    else if (move.originalName === "Multi-Attack" &&
        attacker.item &&
        attacker.item.includes("Memory")) {
        type = (0, items_1.getMultiAttack)(attacker.item);
        desc.moveType = type;
    }
    else if (move.named("Natural Gift") && ((_a = attacker.item) === null || _a === void 0 ? void 0 : _a.endsWith("Berry"))) {
        var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
        type = gift.t;
        desc.moveType = type;
        desc.attackerItem = attacker.item;
    }
    else if (move.named("Nature Power") ||
        (move.originalName === "Terrain Pulse" && (0, util_2.isGrounded)(attacker, field))) {
        type = field.hasTerrain("Ashen Beach", "Inverse", "Misty", "Psychic")
            ? "Psychic"
            : field.hasTerrain("Big Top")
                ? "Flying"
                : field.hasTerrain("Burning", "Superheated")
                    ? "Fire"
                    : field.hasTerrain("Cave", "Chess Board", "Crystal Fire", "Crystal Water", "Crystal Grass", "Crystal Psychic", "Mountain")
                        ? "Rock"
                        : field.hasTerrain("Corrosive", "Corrosive Mist", "Murkwater", "Wasteland")
                            ? "Poison"
                            : field.hasTerrain("Dark Crystal")
                                ? "Dark"
                                : field.hasTerrain("Desert")
                                    ? "Ground"
                                    : field.hasTerrain("Dragon's Den", "New World")
                                        ? "Dragon"
                                        : field.hasTerrain("Electric", "Short-Circuit 0.5", "Short-Circuit 0.8", "Short-Circuit 1.2", "Short-Circuit 1.5", "Short-Circuit 2")
                                            ? "Electric"
                                            : field.hasTerrain("Factory", "Mirror", "Fairy Tale")
                                                ? "Steel"
                                                : field.hasTerrain("Rocky")
                                                    ? "Fighting"
                                                    : field.hasTerrain("Flower Garden 1", "Flower Garden 2", "Flower Garden 3", "Flower Garden 4", "Flower Garden 5", "Forest", "Grassy")
                                                        ? "Grass"
                                                        : field.hasTerrain("Icy", "Rainbow", "Snowy Mt")
                                                            ? "Ice"
                                                            : field.hasTerrain("Starlight")
                                                                ? "Fairy"
                                                                : field.hasTerrain("Swamp", "Underwater", "Water")
                                                                    ? "Water"
                                                                    : "Normal";
        desc.terrain = field.terrain;
        desc.moveType = type;
        if (move.isMax) {
            desc.moveType = type;
        }
        if (!(move.named("Nature Power") && attacker.hasAbility("Prankster")) &&
            (defender.types.includes("Dark") ||
                (field.hasTerrain("Psychic") && (0, util_2.isGrounded)(defender, field)))) {
            desc.moveType = type;
        }
    }
    else if (move.originalName === "Revelation Dance") {
        if (attacker.teraType) {
            type = attacker.teraType;
        }
        else {
            type = attacker.types[0];
        }
    }
    else if (move.named("Aura Wheel")) {
        if (attacker.named("Morpeko")) {
            type = "Electric";
        }
        else if (attacker.named("Morpeko-Hangry")) {
            type = "Dark";
        }
    }
    else if (move.named("Raging Bull")) {
        if (attacker.named("Tauros-Paldea-Combat")) {
            type = "Fighting";
        }
        else if (attacker.named("Tauros-Paldea-Blaze")) {
            type = "Fire";
        }
        else if (attacker.named("Tauros-Paldea-Aqua")) {
            type = "Water";
        }
        field.defenderSide.isReflect = false;
        field.defenderSide.isLightScreen = false;
        field.defenderSide.isAuroraVeil = false;
    }
    else if (move.named("Ivy Cudgel")) {
        if (attacker.name.includes("Ogerpon-Cornerstone")) {
            type = "Rock";
        }
        else if (attacker.name.includes("Ogerpon-Hearthflame")) {
            type = "Fire";
        }
        else if (attacker.name.includes("Ogerpon-Wellspring")) {
            type = "Water";
        }
    }
    else if (move.named("Tera Starstorm") &&
        attacker.name === "Terapagos-Stellar") {
        move.target = "allAdjacentFoes";
        type = "Stellar";
    }
    else if (move.named("Brick Break", "Psychic Fangs")) {
        field.defenderSide.isReflect = false;
        field.defenderSide.isLightScreen = false;
        field.defenderSide.isAuroraVeil = false;
    }
    var hasAteAbilityTypeChange = false;
    var isAerilate = false;
    var isPixilate = false;
    var isRefrigerate = false;
    var isGalvanize = false;
    var isLiquidVoice = false;
    var isNormalize = false;
    var noTypeChange = move.named("Revelation Dance", "Judgment", "Nature Power", "Techno Blast", "Multi-Attack", "Natural Gift", "Weather Ball", "Terrain Pulse", "Struggle") ||
        (move.named("Tera Blast") && attacker.teraType);
    if (!move.isZ && !noTypeChange) {
        var normal = type === "Normal";
        var glitchConverted = move.hasType("Fairy", "Steel", "Dark");
        if ((isAerilate =
            attacker.hasAbility("Aerilate") && (normal || glitchConverted))) {
            type = "Flying";
        }
        else if ((isGalvanize =
            attacker.hasAbility("Galvanize") && (normal || glitchConverted))) {
            type = "Electric";
        }
        else if ((isLiquidVoice =
            attacker.hasAbility("Liquid Voice") && !!move.flags.sound)) {
            if (field.hasTerrain("Icy")) {
                type = "Ice";
            }
            else {
                type = "Water";
            }
        }
        else if ((isPixilate =
            attacker.hasAbility("Pixilate") && (normal || glitchConverted))) {
            type = "Fairy";
        }
        else if ((isRefrigerate =
            attacker.hasAbility("Refrigerate") && (normal || glitchConverted))) {
            type = "Ice";
        }
        else if ((isNormalize = attacker.hasAbility("Normalize"))) {
            type = "Normal";
        }
        if (isGalvanize ||
            isPixilate ||
            isRefrigerate ||
            isAerilate ||
            isNormalize) {
            desc.attackerAbility = attacker.ability;
            hasAteAbilityTypeChange = true;
        }
        else if (isLiquidVoice) {
            desc.attackerAbility = attacker.ability;
        }
    }
    if (move.named("Tera Blast") && attacker.teraType) {
        type = attacker.teraType;
    }
    if (field.hasTerrain("Fairy Tale") &&
        move.named("Cut", "Sacred Sword", "Secret Sword", "Slash")) {
        type = "Steel";
    }
    else if (field.hasTerrain("Murkwater") &&
        move.named("Mud Bomb", "Mud Shot", "Mud-Slap", "Thousand Waves")) {
        type = "Water";
    }
    else if (field.hasTerrain("Starlight") &&
        move.named("Solar Beam", "Solar Blade")) {
        type = "Fairy";
    }
    else if (field.hasTerrain("Glitch") &&
        move.hasType("Dark", "Steel", "Fairy")) {
        type = "Normal";
    }
    else if (field.hasTerrain("Ashen Beach") && move.named("Strength")) {
        type = "Fighting";
    }
    move.type = type;
    if (field.hasTerrain("Glitch")) {
        if (move.hasType("Normal", "Fighting", "Ghost", "Poison", "Bug", "Flying", "Ground", "Rock")) {
            move.category = "Physical";
        }
        else {
            move.category = "Special";
        }
    }
    if ((attacker.hasAbility("Triage") && move.drain) ||
        (attacker.hasAbility("Gale Wings") &&
            move.hasType("Flying") &&
            attacker.curHP() === attacker.maxHP())) {
        move.priority = 1;
        desc.attackerAbility = attacker.ability;
    }
    var isGhostRevealed = attacker.hasAbility("Scrappy") ||
        attacker.hasAbility("Mind's Eye") ||
        field.defenderSide.isForesight;
    var isRingTarget = defender.hasItem("Ring Target") && !defender.hasAbility("Klutz");
    var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget);
    var type2Effectiveness = defender.types[1]
        ? (0, util_2.getMoveEffectiveness)(gen, move, defender.types[1], isGhostRevealed, field.isGravity, isRingTarget)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness;
    if (defender.teraType && defender.teraType !== "Stellar") {
        typeEffectiveness = (0, util_2.getMoveEffectiveness)(gen, move, defender.teraType, isGhostRevealed, field.isGravity, isRingTarget);
    }
    if (typeEffectiveness === 0 &&
        move.hasType("Ground") &&
        defender.hasItem("Iron Ball") &&
        !defender.hasAbility("Klutz")) {
        typeEffectiveness = 1;
    }
    if ((typeEffectiveness === 0 && move.named("Thousand Arrows")) ||
        (typeEffectiveness === 0 && move.hasType("Ground") && field.hasTerrain("Cave"))) {
        typeEffectiveness = 1;
    }
    if ((move.named("Sky Drop") &&
        (defender.hasType("Flying") ||
            defender.weightkg >= 200 ||
            field.isGravity)) ||
        (move.named("Synchronoise") &&
            !defender.hasType(attacker.types[0]) &&
            (!attacker.types[1] || !defender.hasType(attacker.types[1]))) ||
        (move.named("Dream Eater") &&
            !(defender.hasStatus("slp") || defender.hasAbility("Comatose"))) ||
        (move.named("Steel Roller") && !field.terrain) ||
        (move.named("Poltergeist") &&
            (!defender.item || (0, util_2.isQPActive)(defender, field)))) {
        return result;
    }
    if ((field.hasWeather("Harsh Sunshine") && move.hasType("Water")) ||
        (field.hasWeather("Heavy Rain") && move.hasType("Fire"))) {
        desc.weather = field.weather;
        return result;
    }
    if (field.hasWeather("Strong Winds") &&
        defender.hasType("Flying") &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness["Flying"] > 1) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    if (move.type === "Stellar") {
        desc.defenderTera = defender.teraType;
        typeEffectiveness = !defender.teraType ? 1 : 2;
    }
    if (field.hasTerrain("Dragon's Den") &&
        defender.hasAbility("Multiscale") &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness["Dragon"] > 1) {
        typeEffectiveness /= 2;
        desc.terrain = field.terrain;
    }
    if (field.hasTerrain("Flower Garden 4", "Flower Garden 5") &&
        defender.hasType("Grass") &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness["Grass"] > 1) {
        typeEffectiveness /= 2;
        desc.terrain = field.terrain;
    }
    var moveType = gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[0]] * (defender.types[1] ? gen.types.get((0, util_1.toID)(move.type)).effectiveness[defender.types[1]] : 1);
    var addedType;
    switch (field.terrain) {
        case "Ashen Beach":
            addedType = gen.types.get("psychic");
            if (move.named("Strength")) {
                typeEffectiveness =
                    (attacker.hasAbility("Scrappy") && defender.hasType("Ghost")
                        ? 1
                        : moveType) *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Burning":
        case "New World":
        case "Dragon's Den":
            addedType = gen.types.get("fire");
            if (move.named("Doom Desire") && field.hasTerrain("New World")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Flash Fire") ||
                    field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (move.named("Smack Down", "Thousand Arrows", "Clear Smog", "Smog") &&
                field.hasTerrain("Burning")) {
                if (move.named("Thousand Arrows") && typeEffectiveness === 1) {
                    typeEffectiveness = 1 * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                else {
                    typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                if (defender.hasAbility("Flash Fire") || field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (move.named("Smack Down", "Thousand Arrows", "Continental Crush", "Tectonic Rage") &&
                field.hasTerrain("Dragon's Den")) {
                if (move.named("Thousand Arrows") && typeEffectiveness === 1) {
                    typeEffectiveness = 1 * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                else {
                    typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                if (defender.hasAbility("Flash Fire", "Magma Armor") ||
                    field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case "Corrosive":
        case "Wasteland":
        case "Corrosive Mist":
            addedType = gen.types.get("poison");
            if ((move.named("Mud Bomb", "Mud Shot", "Mud-Slap", "Muddy Water", "Smack Down", "Thousand Arrows", "Whirlpool") || move.hasType("Grass")) && field.hasTerrain("Corrosive")) {
                if (move.named("Thousand Arrows") && typeEffectiveness === 1) {
                    typeEffectiveness = 1 * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                else {
                    typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
            }
            else if (move.named("Mud Bomb", "Mud-Slap", "Mud Shot") && field.hasTerrain("Wasteland")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            if ((move.named("Bubble", "Bubble Beam", "Sparkling Aria", "Energy Ball") ||
                (move.hasType("Flying") && move.category === "Special")) &&
                field.hasTerrain("Corrosive Mist")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Chess Board":
        case "Rocky":
            addedType = gen.types.get("rock");
            if (move.named("AncientPower", "Nature Power", "Psychic", "SecretPower", "Strength", "Continental Crush", "Sahttered Psyche") &&
                field.hasTerrain("Chess Board")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named("Bulldoze", "Earthquake", "Magnitude", "Rock Climb", "Strength") &&
                field.hasTerrain("Rocky")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Crystal Fire":
        case "Crystal Water":
        case "Crystal Grass":
        case "Crystal Psychic":
            if (field.hasTerrain("Crystal Fire") &&
                (move.named("Judgment", "Multi-Attack", "Rock Climb", "Strength", "Prismatic Laser") ||
                    move.hasType("Rock"))) {
                addedType = gen.types.get("fire");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Flash Fire") ||
                    field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (field.hasTerrain("Crystal Water") &&
                (move.named("Judgment", "Multi-Attack", "Rock Climb", "Strength", "Prismatic Laser") ||
                    move.hasType("Rock"))) {
                addedType = gen.types.get("water");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Water Absorb", "Dry Skin", "Storm Drain") ||
                    field.hasWeather("Harsh Sunshine")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (field.hasTerrain("Crystal Grass") &&
                (move.named("Judgment", "Multi-Attack", "Rock Climb", "Strength", "Prismatic Laser") ||
                    move.hasType("Rock"))) {
                addedType = gen.types.get("grass");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Sap Sipper")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (field.hasTerrain("Crystal Psychic") &&
                (move.named("Judgment", "Multi-Attack", "Rock Climb", "Strength", "Prismatic Laser") ||
                    move.hasType("Rock"))) {
                addedType = gen.types.get("psychic");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Electric":
            addedType = gen.types.get("electric");
            if (move.named("Explosion", "Hurricane", "Muddy Water", "Self-Destruct", "Smack Down", "Surf", "Thousand Arrows", "Hydro Vortex")) {
                if (move.named("Thousand Arrows") && typeEffectiveness === 1) {
                    typeEffectiveness = 1 * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                else {
                    typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                if (defender.hasAbility("Volt Absorb", "Lightning Rod", "Motor Drive")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case "Fairy Tale":
            addedType = gen.types.get("dragon");
            if (move.hasType("Fire")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Icy":
        case "Snowy Mt":
            addedType = gen.types.get("ice");
            if (move.hasType("Rock")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Murkwater":
            if (move.named("Sludge Wave", "Nature Power")) {
                addedType = gen.types.get("water");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Water Absorb", "Dry Skin", "Storm Drain") ||
                    field.hasWeather("Harsh Sunshine")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (move.hasType("Water") || move.named("Smack Down")) {
                addedType = gen.types.get("poison");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            break;
        case "Short-Circuit 0.5":
        case "Short-Circuit 0.8":
        case "Short-Circuit 1.2":
        case "Short-Circuit 1.5":
        case "Short-Circuit 2":
            if (move.named("Flash Cannon", "Gear Grind", "Gyro Ball", "Magnet Bomb", "Muddy Water", "Surf") ||
                (attacker.hasAbility("Steelworker") && move.hasType("Steel"))) {
                addedType = gen.types.get("electric");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Volt Absorb", "Lightning Rod", "Motor Drive")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case "Starlight":
            if (move.hasType("Dark")) {
                addedType = gen.types.get("fairy");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
            }
            else if (move.named("Doom Desire")) {
                addedType = gen.types.get("fire");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Flash Fire") ||
                    field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case "New World":
            if (move.named("Doom Desire")) {
                addedType = gen.types.get("fire");
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Flash Fire") ||
                    field.hasWeather("Heavy Rain")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        case "Swamp":
        case "Underwater":
            addedType = gen.types.get("water");
            if (move.named("Smack Down", "Thousand Arrows") &&
                field.hasTerrain("Swamp")) {
                if (move.named("Thousand Arrows") && typeEffectiveness === 1) {
                    typeEffectiveness = 1 * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                else {
                    typeEffectiveness = moveType * addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                }
                if (defender.hasAbility("Water Absorb", "Dry Skin", "Storm Drain") ||
                    field.hasWeather("Harsh Sunshine")) {
                    typeEffectiveness *= 0;
                }
            }
            else if (move.hasType("Ground") && field.hasTerrain("Underwater")) {
                typeEffectiveness =
                    moveType *
                        addedType.effectiveness[defender.types[0]] *
                        (defender.types[1] ? addedType.effectiveness[defender.types[1]] : 1);
                if (defender.hasAbility("Water Absorb", "Dry Skin", "Storm Drain") ||
                    field.hasWeather("Harsh Sunshine")) {
                    typeEffectiveness *= 0;
                }
            }
            break;
        default:
            typeEffectiveness = typeEffectiveness;
    }
    if (field.hasTerrain('Underwater') && move.hasType('Water') && defender.hasType('Water')) {
        typeEffectiveness *= 2;
        desc.terrain = field.terrain;
    }
    else if (field.hasTerrain('Holy') && move.hasType('Normal')) {
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
    else if (field.hasTerrain('Fairy Tale') && move.hasType('Steel') && defender.hasType('Dragon')) {
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
        if (defender.hasItem("Synthetic Seed")) {
            typeEffectiveness = 1;
        }
        if (move.hasType('Ghost') && defender.hasType('Psychic')) {
            typeEffectiveness = 0;
        }
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
        if (move.named('Freeze Dry') && defender.hasType('Water')) {
            typeEffectiveness *= 4;
        }
        if (defender.hasType('Flying') && field.hasWeather('Strong Winds') && typeEffectiveness > 1) {
            typeEffectiveness /= 2;
            desc.weather = field.weather;
        }
    }
    var turn2typeEffectiveness = typeEffectiveness;
    if (defender.hasAbility("Tera Shell") &&
        defender.curHP() === defender.maxHP() &&
        ((!field.defenderSide.isSR &&
            (!field.defenderSide.spikes || defender.hasType("Flying"))) ||
            defender.hasItem("Heavy-Duty Boots"))) {
        typeEffectiveness = 0.5;
        desc.defenderAbility = defender.ability;
    }
    if ((defender.hasAbility("Wonder Guard") && typeEffectiveness <= 1) ||
        (move.hasType("Grass") && defender.hasAbility("Sap Sipper")) ||
        (move.hasType("Fire") && defender.hasAbility("Flash Fire", "Well-Baked Body")) ||
        (move.hasType("Water") && defender.hasAbility("Dry Skin", "Storm Drain", "Water Absorb")) ||
        (move.hasType("Electric") && defender.hasAbility("Lightning Rod", "Motor Drive", "Volt Absorb")) ||
        (move.hasType("Ground") && !field.isGravity && !move.named("Thousand Arrows") && !field.hasTerrain("Cave") && !defender.hasItem("Iron Ball") && defender.hasAbility("Levitate")) ||
        (move.flags.bullet && defender.hasAbility("Bulletproof")) ||
        (move.flags.sound && !move.named("Clangorous Soul") && defender.hasAbility("Soundproof")) ||
        (move.priority > 0 && defender.hasAbility("Queenly Majesty", "Dazzling", "Armor Tail")) ||
        (move.hasType("Ground") && defender.hasAbility("Earth Eater")) ||
        (move.flags.wind && defender.hasAbility("Wind Rider")) ||
        (move.hasType('Fire') && defender.hasAbility('Magma Armor') && field.hasTerrain('Dragon\'s Den')) ||
        (move.hasType('Rock') && field.hasTerrain('Crystal Grass') && defender.hasAbility("Sap Sipper")) ||
        ((move.hasType('Rock')) && field.hasTerrain('Crystal Fire') && defender.hasAbility("Flash Fire")) ||
        (move.hasType('Rock') && field.hasTerrain('Crystal Water') && (defender.hasAbility("Water Absorb") || defender.hasAbility('Storm Drain'))) ||
        (move.hasType('Rock')) && field.hasTerrain('Crystal Psychic') && defender.hasType('Dark') ||
        (move.flags.bullet && (defender.hasAbility('Bulletproof') || (defender.boosts.def > 0 && field.hasTerrain('Rocky'))))) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    if (move.hasType("Ground") && !move.named("Thousand Arrows") && !field.hasTerrain("Cave") && !field.isGravity && defender.hasItem("Air Balloon")) {
        desc.defenderItem = defender.item;
        return result;
    }
    if (move.hasType('Ground') && !move.named('Thousand Arrows') && !field.isGravity && defender.hasItem('Synthetic Seed') && field.hasTerrain('Short-Circuit 0.5', 'Short-Circuit 0.8', 'Short-Circuit 1.2', 'Short-Circuit 1.5', 'Short-Circuit 2')) {
        desc.defenderItem = defender.item;
        return result;
    }
    if (move.priority > 0 && field.hasTerrain("Psychic") && (0, util_2.isGrounded)(defender, field)) {
        desc.terrain = field.terrain;
        return result;
    }
    var weightBasedMove = move.named("Heat Crash", "Heavy Slam", "Low Kick", "Grass Knot");
    if (defender.isDynamaxed && weightBasedMove) {
        return result;
    }
    desc.HPEVs = (0, util_2.getStatDescriptionText)(gen, defender, "hp");
    var fixedDamage = (0, util_2.handleFixedDamageMoves)(attacker, move);
    if (field.hasTerrain('Rainbow') && move.named('Sonic Boom')) {
        var lostHP = 140;
        result.damage = lostHP;
        return result;
    }
    if (fixedDamage) {
        if (attacker.hasAbility("Parental Bond")) {
            result.damage = [fixedDamage, fixedDamage];
            desc.attackerAbility = attacker.ability;
        }
        else {
            result.damage = fixedDamage;
        }
        return result;
    }
    if (move.named("Final Gambit")) {
        result.damage = attacker.curHP();
        return result;
    }
    if (move.named("Guardian of Alola")) {
        var zLostHP = Math.floor((defender.curHP() * 3) / 4);
        if (field.defenderSide.isProtected &&
            attacker.item &&
            attacker.item.includes(" Z")) {
            zLostHP = Math.ceil(zLostHP / 4 - 0.5);
        }
        result.damage = zLostHP;
        return result;
    }
    if (move.named('Nature\'s Madness')) {
        var lostHP = 0;
        if (field.hasTerrain('Grassy', 'Forest', 'Holy', 'New World')) {
            lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.75);
        }
        else {
            lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() * 0.5);
        }
        result.damage = lostHP;
        return result;
    }
    if (move.named("Spectral Thief")) {
        var stat = void 0;
        for (stat in defender.boosts) {
            if (defender.boosts[stat] > 0) {
                attacker.boosts[stat] += attacker.hasAbility("Contrary")
                    ? -defender.boosts[stat]
                    : defender.boosts[stat];
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
    if (typeEffectiveness === 0) {
        return result;
    }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? "first" : "last";
    var basePower = calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
    if (basePower === 0) {
        return result;
    }
    var attack = calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var attackSource = move.named('Foul Play') ? defender : attacker;
    var attackStat = move.named("Shell Side Arm") && (0, util_2.getShellSideArmCategory)(attacker, defender) === "Physical" ? "atk"
        : move.named("Body Press") ? "def"
            : field.hasTerrain('Glitch') && move.category === 'Special' && attackSource.stats.spa < attackSource.stats.spd ? 'spd'
                : move.category === "Special" ? "spa"
                    : "atk";
    var defense = calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var hitsPhysical = move.overrideDefensiveStat === "def" || move.category === "Physical" || (move.named("Shell Side Arm") && (0, util_2.getShellSideArmCategory)(attacker, defender) === "Physical");
    var defenseStat = hitsPhysical ? "def"
        : !hitsPhysical && field.hasTerrain('Glitch') && defender.stats.spa > defender.stats.spd ? 'spa'
            : "spd";
    var baseDamage = calculateBaseDamageSMSSSV(gen, attacker, defender, basePower, attack, defense, move, field, desc, isCritical);
    if (hasTerrainSeed(defender) &&
        field.hasTerrain(defender.item.substring(0, defender.item.indexOf(" "))) &&
        items_1.SEED_BOOSTED_STAT[defender.item] === defenseStat) {
        desc.defenderItem = defender.item;
    }
    var preStellarStabMod = (0, util_2.getStabMod)(attacker, move, desc);
    var stabMod = (0, util_2.getStellarStabMod)(attacker, move, preStellarStabMod);
    var applyBurn = attacker.hasStatus("brn") &&
        move.category === "Physical" &&
        !attacker.hasAbility("Guts") &&
        !move.named("Facade");
    desc.isBurned = applyBurn;
    var finalMods = calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness);
    var protect = false;
    if (field.defenderSide.isProtected &&
        (attacker.isDynamaxed ||
            (move.isZ && attacker.item && attacker.item.includes(" Z")))) {
        protect = true;
        desc.isProtected = true;
    }
    var finalMod = (0, util_2.chainMods)(finalMods, 41, 131072);
    var isSpread = field.gameType !== "Singles" &&
        ["allAdjacent", "allAdjacentFoes"].includes(move.target);
    var childDamage;
    if (attacker.hasAbility("Parental Bond") && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = "Parental Bond (Child)";
        (0, util_2.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateSMSSSV(gen, child, defender, move, field)
            .damage;
        desc.attackerAbility = attacker.ability;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] = (0, util_2.getFinalDamage)(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
    }
    desc.attackBoost = move.named("Foul Play")
        ? defender.boosts[attackStat]
        : attacker.boosts[attackStat];
    if (move.timesUsed > 1 || move.hits > 1) {
        var origDefBoost = desc.defenseBoost;
        var origAtkBoost = desc.attackBoost;
        var numAttacks = 1;
        if (move.timesUsed > 1) {
            desc.moveTurns = "over ".concat(move.timesUsed, " turns");
            numAttacks = move.timesUsed;
        }
        else {
            numAttacks = move.hits;
        }
        var usedItems = [false, false];
        var _loop_1 = function (times) {
            usedItems = (0, util_2.checkMultihitBoost)(gen, attacker, defender, move, field, desc, usedItems[0], usedItems[1]);
            var newAttack = calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
            var newDefense = calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
            hasAteAbilityTypeChange =
                hasAteAbilityTypeChange &&
                    attacker.hasAbility("Aerilate", "Galvanize", "Pixilate", "Refrigerate", "Normalize");
            if (move.timesUsed > 1) {
                preStellarStabMod = (0, util_2.getStabMod)(attacker, move, desc);
                typeEffectiveness = turn2typeEffectiveness;
                stabMod = (0, util_2.getStellarStabMod)(attacker, move, preStellarStabMod, times);
            }
            var newBasePower = calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc, times + 1);
            var newBaseDamage = calculateBaseDamageSMSSSV(gen, attacker, defender, newBasePower, newAttack, newDefense, move, field, desc, isCritical);
            var newFinalMods = calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness, times);
            var newFinalMod = (0, util_2.chainMods)(newFinalMods, 41, 131072);
            var damageMultiplier = 0;
            damage = damage.map(function (affectedAmount) {
                var newFinalDamage = (0, util_2.getFinalDamage)(newBaseDamage, damageMultiplier, typeEffectiveness, applyBurn, stabMod, newFinalMod, protect);
                damageMultiplier++;
                return affectedAmount + newFinalDamage;
            });
        };
        for (var times = 1; times < numAttacks; times++) {
            _loop_1(times);
        }
        desc.defenseBoost = origDefBoost;
        desc.attackBoost = origAtkBoost;
    }
    result.damage = childDamage ? [damage, childDamage] : damage;
    if (field.hasTerrain('Corrosive Mist') && move.named('Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive', 'Explosion', 'Self-Destruct')) {
        var lostHP = 0;
        if (defender.hasAbility('Damp', 'Flash Fire') || field.defenderSide.isProtected) {
            return result;
        }
        else if (defender.hasAbility('Sturdy') && defender.curHP() == defender.maxHP()) {
            lostHP = defender.maxHP();
            result.damage = lostHP - 1;
            return result;
        }
        else {
            lostHP = defender.maxHP();
            result.damage = lostHP;
            return result;
        }
    }
    if (field.hasTerrain('Mirror') && move.named('Boomburst', 'Bulldoze', 'Earthquake', 'Explosion', 'Hyper Voice', 'Magnitude', 'Self-Destruct', 'Tectonic Rage')) {
        var lostHP_1 = 0;
        if (defender.hasAbility('Battle Armor', 'Shell Armor') || field.defenderSide.isProtected) {
            return result;
        }
        else if (move.named('Magnitude')) {
            lostHP_1 = Math.floor(defender.maxHP() / 2);
            var lostHP4 = damage;
            var lostHP5 = damage.map(function (num) { return Math.floor((num * 3) + lostHP_1); });
            var lostHP6 = damage.map(function (num) { return Math.floor((num * 5) + lostHP_1); });
            var lostHP7 = damage.map(function (num) { return Math.floor((num * 7) + lostHP_1); });
            var lostHP8 = damage.map(function (num) { return Math.floor((num * 9) + lostHP_1); });
            var lostHP9 = damage.map(function (num) { return Math.floor((num * 11) + lostHP_1); });
            var lostHP10 = damage.map(function (num) { return Math.floor((num * 15) + lostHP_1); });
            var finaldmg = lostHP4.concat(lostHP5, lostHP6, lostHP7, lostHP8, lostHP9, lostHP10);
            result.damage = finaldmg;
            return result;
        }
        else {
            lostHP_1 = Math.floor(defender.maxHP() / 2);
            var finaldmg = damage.map(function (num) { return num + lostHP_1; });
            result.damage = finaldmg;
            return result;
        }
    }
    if (field.hasTerrain('Big Top') && (move.named('Blaze Kick', 'Body Slam', 'Bounce', 'Brutal Swing', 'Bulldoze', 'Crabhammer', 'Dragon Hammer', 'Dragon Rush', 'Dual Chop', 'Earthquake', 'Giga Impact', 'Heat Crash', 'Heavy Slam', 'High Horsepower', 'Ice Hammer', 'Icicle Crash', 'Iron Tail', 'Magnitude', 'Meteor Mash', 'Pound', 'Sky Drop', 'Smack Down', 'Stomp', 'Stomping Tantrum', 'Strength', 'Wood Hammer') || (move.hasType('Fighting') && move.category == 'Physical'))) {
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
    if (move.named('Magnitude')) {
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
function calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc, hit) {
    var _a;
    if (hit === void 0) { hit = 1; }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower;
    switch (move.name) {
        case 'Payback':
            basePower = move.bp * (turnOrder === 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Bolt Beak':
        case 'Fishious Rend':
            basePower = move.bp * (turnOrder !== 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Pursuit':
            var switching = field.defenderSide.isSwitching === 'out';
            basePower = move.bp * (switching ? 2 : 1);
            if (switching)
                desc.isSwitching = 'out';
            desc.moveBP = basePower;
            break;
        case 'Electro Ball':
            var r = Math.floor(attacker.stats.spe / defender.stats.spe);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            if (defender.stats.spe === 0)
                basePower = 40;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
            if (attacker.stats.spe === 0)
                basePower = 1;
            desc.moveBP = basePower;
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_2.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            break;
        case 'Low Kick':
        case 'Grass Knot':
            var w = (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Hex':
        case 'Infernal Parade':
            basePower = move.bp * (defender.status || defender.hasAbility('Comatose') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Barb Barrage':
            basePower = move.bp * (defender.hasStatus('psn', 'tox') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var wr = (0, util_2.getWeight)(attacker, desc, 'attacker') /
                (0, util_2.getWeight)(defender, desc, 'defender');
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Stored Power':
        case 'Power Trip':
            basePower = 20 + 20 * (0, util_2.countBoosts)(gen, attacker.boosts);
            desc.moveBP = basePower;
            break;
        case 'Acrobatics':
            basePower = move.bp * (attacker.hasItem('Flying Gem') ||
                (!attacker.item || (0, util_2.isQPActive)(attacker, field)) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Assurance':
            basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
            break;
        case 'Wake-Up Slap':
            basePower = move.bp * (defender.hasStatus('slp') || defender.hasAbility('Comatose') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Smelling Salts':
            basePower = move.bp * (defender.hasStatus('par') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather && !field.hasWeather('Strong Winds') ? 2 : 1);
            if (field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain') &&
                attacker.hasItem('Utility Umbrella'))
                basePower = move.bp;
            desc.moveBP = basePower;
            break;
        case 'Terrain Pulse':
            basePower = move.bp * ((0, util_2.isGrounded)(attacker, field) && field.terrain ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Rising Voltage':
            basePower = move.bp * (((0, util_2.isGrounded)(defender, field) && field.hasTerrain('Electric')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Psyblade':
            basePower = move.bp * (field.hasTerrain('Electric') ? 1.5 : 1);
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
            desc.moveBP = basePower;
            break;
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Natural Gift':
            if ((_a = attacker.item) === null || _a === void 0 ? void 0 : _a.endsWith('Berry')) {
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
                case 'Ashen Beach':
                    basePower = 0;
                    desc.moveName = 'Meditate';
                    break;
                case 'Big Top':
                    basePower = 110;
                    move.category = 'Physical';
                    desc.moveName = 'Acrobatics';
                    break;
                case 'Burning':
                    basePower = 90;
                    desc.moveName = 'Flamethrower';
                    break;
                case 'Cave':
                    basePower = 60;
                    move.category = 'Physical';
                    desc.moveName = 'Rock Tomb';
                    break;
                case 'Corrosive':
                    basePower = 40;
                    desc.moveName = 'Acid Spray';
                    break;
                case 'Corrosive Mist':
                    basePower = 130;
                    desc.moveName = 'Venoshock';
                    break;
                case 'Crystal Fire':
                case 'Crystal Water':
                case 'Crystal Grass':
                case 'Crystal Psychic':
                    basePower = 80;
                    desc.moveName = 'Power Gem';
                    break;
                case 'Dark Crystal':
                    basePower = 80;
                    desc.moveName = 'Dark Pulse';
                    break;
                case 'Desert':
                    basePower = 35;
                    move.category = 'Physical';
                    desc.moveName = 'Sand Tomb';
                    break;
                case 'Dragon\'s Den':
                    basePower = 85;
                    desc.moveName = 'Dragon Pulse';
                    break;
                case 'Chess Board':
                    basePower = 60;
                    desc.moveName = 'Ancient Power';
                    break;
                case 'Electric':
                    basePower = 90;
                    desc.moveName = 'Thunderbolt';
                    break;
                case 'Factory':
                    basePower = 100;
                    move.category = 'Physical';
                    desc.moveName = 'Gear Grind';
                    break;
                case 'Fairy Tale':
                    basePower = 85;
                    move.overrideDefensiveStat = 'def';
                    desc.moveName = 'Secret Sword';
                    break;
                case 'Flower Garden 1':
                case 'Flower Garden 2':
                case 'Flower Garden 3':
                case 'Flower Garden 4':
                    basePower = 0;
                    desc.moveName = 'Growth';
                    break;
                case 'Flower Garden 5':
                    basePower = 90;
                    move.category = 'Physical';
                    desc.moveName = 'Petal Blizzard';
                    break;
                case 'Forest':
                    basePower = 120;
                    move.category = 'Physical';
                    desc.moveName = 'Wood Hammer';
                    break;
                case 'Glitch':
                    basePower = 0;
                    desc.moveName = 'Metronome';
                    break;
                case 'Grassy':
                    basePower = 90;
                    desc.moveName = 'Energy Ball';
                    break;
                case 'Holy':
                    basePower = 100;
                    desc.moveName = 'Judgment';
                    break;
                case 'Icy':
                    basePower = 90;
                    desc.moveName = 'Ice Beam';
                    break;
                case 'Inverse':
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
                    basePower = 75;
                    move.category = 'Physical';
                    desc.moveName = 'Rock Slide';
                    break;
                case 'Murkwater':
                    basePower = 95;
                    desc.moveName = 'Sludge Wave';
                    break;
                case 'New World':
                    basePower = 100;
                    desc.moveName = 'Spacial Rend';
                    break;
                case 'Psychic':
                    basePower = 90;
                    desc.moveName = 'Psychic';
                    break;
                case 'Rainbow':
                    basePower = 65;
                    desc.moveName = 'Aurora Beam';
                    break;
                case 'Rocky':
                    basePower = 40;
                    move.category = 'Physical';
                    desc.moveName = 'Rock Smash';
                    break;
                case 'Short-Circuit 0.5':
                case 'Short-Circuit 0.8':
                case 'Short-Circuit 1.2':
                case 'Short-Circuit 1.5':
                case 'Short-Circuit 2':
                    basePower = 80;
                    desc.moveName = 'Discharge';
                    break;
                case 'Snowy Mt':
                    basePower = 60;
                    move.category = 'Physical';
                    desc.moveName = 'Avalanche';
                    break;
                case 'Starlight':
                    basePower = 95;
                    desc.moveName = 'Moonblast';
                    break;
                case 'Superheated':
                    basePower = 95;
                    desc.moveName = 'Heat Wave';
                    break;
                case 'Swamp':
                    basePower = 90;
                    desc.moveName = 'Muddy Water';
                    break;
                case 'Underwater':
                    basePower = 60;
                    desc.moveName = 'Water Pulse';
                    break;
                case 'Wasteland':
                    basePower = 120;
                    move.category = 'Physical';
                    desc.moveName = 'Gunk Shot';
                    break;
                case 'Water':
                    basePower = 35;
                    desc.moveName = 'Whirlpool';
                    break;
                default:
                    basePower = 80;
                    desc.moveName = 'Tri Attack';
            }
            break;
        case 'Plasma Fists':
            basePower = move.bp;
            if (!field.hasTerrain('Underwater', 'New World') && !attacker.hasItem('Everstone')) {
                basePower = move.bp * 1.3;
            }
            desc.moveBP = basePower;
            break;
        case 'Stoked Sparksurfer':
        case 'Genesis Supernova':
            basePower = move.bp * (field.hasTerrain('Underwater', 'New World') ? 1 : 1.3);
            desc.moveBP = basePower;
            break;
        case 'Bloom Doom':
            basePower = move.bp * (field.hasTerrain('Underwater', 'New World', 'Forest', 'Flower Garden 1', 'Flower Garden 2', 'Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5') ? 1 : 1.3);
            desc.moveBP = basePower;
            break;
        case 'Water Shuriken':
            basePower = attacker.named('Greninja-Ash') && attacker.hasAbility('Battle Bond') ? 20 : 15;
            desc.moveBP = basePower;
            break;
        case 'Triple Axel':
            basePower = hit * 20;
            desc.moveBP = move.hits === 2 ? 60 : move.hits === 3 ? 120 : 20;
            break;
        case 'Triple Kick':
            basePower = hit * 10;
            desc.moveBP = move.hits === 2 ? 30 : move.hits === 3 ? 60 : 10;
            break;
        case 'Crush Grip':
        case 'Wring Out':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
            desc.moveBP = basePower;
            break;
        case 'Hard Press':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((100 * basePower + 2048 - 1) / 4096) / 100) || 1;
            desc.moveBP = basePower;
            break;
        case 'Tera Blast':
            basePower = attacker.teraType === 'Stellar' ? 100 : 80;
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    switch (field.terrain) {
        case 'Ashen Beach':
            if (move.named('Mud Bomb', 'Mud Shot', 'Mud-Slap', 'Sand Tomb')) {
                basePower *= 2;
            }
            else if (move.named('HP', 'HP Bug', 'HP Dark', 'HP Dragon', 'HP Electric', 'HP Fighting', 'HP Fairy', 'HP Fire', 'HP Flying', 'HP Ghost', 'HP Grass', 'HP Ground', 'HP Ice', 'HP Poison', 'HP Psychic', 'HP Rock', 'HP Steel', 'HP Water', 'Land\'s Wrath', 'Muddy Water', 'Strength', 'Surf', 'Thousand Waves', 'Clangorous Soulblaze')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Aura Sphere', 'Focus Blast', 'Stored Power', 'Zen Headbutt')) {
                basePower *= 1.3;
            }
            if (move.named('Psychic')) {
                basePower *= 1.2;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Big Top':
            if (move.flags.sound || move.named('Fiery Dance', 'Fire Lash', 'First Impresion', 'Fly', 'Petal Dance', 'Power Whip', 'Revelation Dance', 'VineW hip')) {
                basePower *= 1.5;
            }
            else if (move.named('Acrobatics', 'Nature Power')) {
                basePower = 110 * 1.5;
            }
            else if (move.named('Pay Day')) {
                basePower *= 2;
            }
            if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Burning':
            if (move.named('Smack Down', 'Thousand Arrows')) {
                basePower *= 2;
            }
            else if (move.named('Clear Smog', 'Smog')) {
                basePower *= 1.5;
            }
            else if (move.named('Blizzard', 'Subzero Slammer', 'Splintered Stormshards', 'Gust', 'Hurricane', 'Muddy Water', 'Razor Wind', 'Sand Tomb', 'Sludge Wave', 'Sparkling Area', 'Surf', 'Twister', 'Water Pledge', 'Water Spout', 'Continental Crush', 'Hydro Vortex', 'Oceanic Operetta', 'Splintered Stormshards', 'Supersonic Skystrike')) {
                basePower *= 1.3;
            }
            if ((0, util_2.isGrounded)(attacker, field) && move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if ((move.hasType('Grass') && (0, util_2.isGrounded)(defender, field)) || move.hasType('Ice')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Cave':
            if (move.named('Sky Drop')) {
                basePower *= 0;
            }
            else if (move.named('Rock Tomb', 'Nature Power')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Diamond Storm', 'Power Gem')) {
                basePower *= 1.3;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            if (move.flags.sound) {
                basePower *= 1.5;
            }
            if (move.hasType('Flying') && !move.flags.contact) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Chess Board':
            if (move.named('Ancient Power', 'Psychic', 'Secret Power', 'Strength', 'Continental Crush', 'Shattered Psyche', 'Fake Out', 'Feint', 'Feint Attack', 'First Impression', 'Nature Power', 'Shadow Sneak', 'Smart Strike', 'Sucker Punch')) {
                basePower *= 1.5;
            }
            if (move.named('Stomping Tantrum', 'Tectonic Rage', 'Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Corrosive':
            if (move.named('Acid', 'Acid Spray', 'Nature Power', "Grass Knot")) {
                basePower *= 2;
            }
            else if (move.named('Mud Bomb', 'Mud Shot', 'Mud-Slap', 'Muddy Water', 'Smack Down', 'Thousand Arrows', 'Whirlpool')) {
                basePower *= 1.5;
            }
            else if (move.named('Seed Flare', 'Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Corrosive Mist':
            if (move.named('Bubble', 'Bubble Beam', 'Sparkling Aria', 'Acid Spray', 'Clear Smog', 'Smog')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive', 'Explosion', 'Self-Destruct', 'Gust', 'Huricane', 'Razor Wind', 'Seed Flare', 'Twister', 'Supersonic Skystrike')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fire')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Crystal Fire':
        case 'Crystal Water':
        case 'Crystal Grass':
        case 'Crystal Psychic':
            if (move.named('Judgment', 'Multi-Attack', 'Rock Climb', 'Strength', 'Ancient Power', 'Diamond Storm', 'Nature Power', 'Power Gem', 'Rock Smash', 'Rock Tomb')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Dark Pulse', 'Night Daze', 'Light That Burns the Sky', 'Bulldoze', 'Earthquake', 'Magnitude', 'Tectonic Rage', 'Aurora Beam', 'Dazzling Gleam', 'Doom Desire', 'Luster Purge', 'Mirror Shot', 'Moongeist Beam', 'Photon Geyser', 'Signal Beam', 'Techno Blast', 'Menacing Moonraze Maelstrom')) {
                basePower *= 1.3;
            }
            if (move.hasType('Rock') || move.hasType('Dragon')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Dark Crystal':
            if (move.named('Solar Blade', 'Solar Beam')) {
                basePower *= 0;
            }
            else if (move.named('Prismatic Laser', 'Black Hole Eclipse')) {
                basePower *= 2;
            }
            else if (move.named('Aurora Beam', 'Dark Pulse', 'Nature Power', 'Dazzling Gleam', 'Diamond Storm', 'Doom Desire', 'Flash Cannon', 'Luster Purge', 'Mirror Shot', 'Moongeist Beam', 'Night Daze', 'Night Slash', 'Photon Geyser', 'Power Gem', 'Shadow Ball', 'Shadow Bone', 'Shadow Claw', 'Shadow Force', 'Shadow Punch', 'Shadow Sneak', 'Signal Beam', 'Techno Blast', 'Menacing Moonraze Maelstrom')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Bulldoze', 'Earthquake', 'Magnitude', 'Tectonic Rage')) {
                basePower *= 1.3;
            }
            else if (move.named('Light That Burns the Sky')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Desert':
            if (move.named('Burn Up', 'Dig', 'Heat Wave', 'Needle Arm', 'Pin Missile', 'Sand Tomb', 'Nature Power', 'Solar Beam', 'Solar Blade', 'Thousand Waves', 'Searing Sunraze Smash')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if ((move.hasType('Water') && (0, util_2.isGrounded)(attacker, field)) || (move.hasType('Electric') && (0, util_2.isGrounded)(defender, field))) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case "Dragon's Den":
            if (move.named('Smack Down', 'Thousand Arrows', 'Continental Crush', 'Tectonic Rage', 'Dragon Ascent', 'Pay Day')) {
                basePower *= 2;
            }
            else if (move.named('Lava Plume', 'Magma Storm', 'Mega Kick')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Glaciate', 'Hydro Vortex', 'Oceanic Operetta', 'Subzero Slammer')) {
                basePower *= 1.3;
            }
            if (move.hasType('Dragon', 'Fire')) {
                basePower *= 1.5;
            }
            else if (move.hasType('Water', 'Ice')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Electric':
            if (move.named('Focus Punch')) {
                basePower *= 0;
            }
            else if (move.named('Magnet Bomb')) {
                basePower *= 2;
            }
            else if (move.named('Explosion', 'Hurricane', 'Muddy Water', 'Self-Destruct', 'Smack Down', 'Surf', 'Thousand Arrows')) {
                basePower *= 1.5;
            }
            else if (move.named('Tectonic Rage', 'Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if ((0, util_2.isGrounded)(attacker, field) && move.hasType('Electric')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Factory':
            if (move.named('Flash Cannon', 'Gear Grind', 'Nature Power', 'Gyro Ball', 'Magnet Bomb')) {
                basePower *= 2;
            }
            else if (move.named('Steamroller', 'Techno Blast')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Bulldoze', 'Discharge', 'Earthquake', 'Explosion', 'Magnitude', 'Self-Destruct', 'Light That Burns the Sky', 'Tectonic Rage')) {
                basePower *= 1.3;
            }
            if (move.hasType('Electric')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Fairy Tale':
            if (move.hasType('Dragon')) {
                basePower *= 2;
            }
            if (move.named('Draining Kiss')) {
                basePower *= 2;
            }
            else if (move.named('AirSlash', 'Ancient Power', 'Fleur Cannon', 'Leaf Blade', 'Magical Leaf', 'Moongeist Beam', 'Mystical Fire', 'Night Slash', 'Psycho Cut', 'Relic Song', 'Smart Strike', 'Solar Blade', 'Sparkling Aria', 'Menacing Moonraze Maelstrom', 'Oceanic Operetta')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fairy', 'Steel')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Flower Garden 1':
        case 'Flower Garden 2':
        case 'Flower Garden 3':
        case 'Flower Garden 4':
        case 'Flower Garden 5':
            if (field.hasTerrain('Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5') && !field.hasWeather('Rain', 'Heavy Rain') && move.named('Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive')) {
                basePower *= 1.3;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            else if (move.named('Cut') && !field.hasTerrain('Flower Garden 1')) {
                basePower *= 1.5;
                if (defender.hasType('Grass')) {
                    basePower *= 2;
                }
            }
            else if (move.named('Petal Blizzard', 'Nature Power', 'Fleur Cannon', 'Petal Dance')) {
                if (field.hasTerrain('Flower Garden 3')) {
                    basePower *= 1.2;
                }
                else if (field.hasTerrain('Flower Garden 4', 'Flower Garden 5')) {
                    basePower *= 1.5;
                }
            }
            if (move.hasType('Grass')) {
                if (field.hasTerrain('Flower Garden 2')) {
                    basePower *= 1.1;
                }
                else if (field.hasTerrain('Flower Garden 3')) {
                    basePower *= 1.3;
                }
                else if (field.hasTerrain('Flower Garden 4')) {
                    basePower *= 1.5;
                }
                else if (field.hasTerrain('Flower Garden 5')) {
                    basePower *= 2;
                }
            }
            else if (move.hasType('Bug')) {
                if (field.hasTerrain('Flower Garden 2', 'Flower Garden 3')) {
                    basePower *= 1.5;
                }
                else if (field.hasTerrain('Flower Garden 4', 'Flower Garden 5')) {
                    basePower *= 2;
                }
            }
            else if (move.hasType('Fire') && field.hasTerrain('Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Forest':
            if (move.named('Attack order', 'Cut', 'Electroweb')) {
                if (move.named('Cut') && defender.hasType('Grass')) {
                    basePower *= 3;
                }
                else {
                    basePower *= 1.5;
                }
            }
            else if (move.named('Muddy Water', 'Surf')) {
                basePower *= 0.5;
            }
            else if (move.named('Splintered Stormshards', 'Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive') && !field.hasWeather('Rain', 'Heavy Rain')) {
                basePower *= 1.3;
            }
            if (move.hasType('Grass') || (move.hasType('Bug')) && move.category === 'Special') {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Glitch':
            if (move.hasType('Psychic')) {
                basePower *= 1.2;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Grassy':
            if (move.named('Fairy Wind', 'Silver Wind')) {
                basePower *= 1.5;
            }
            else if (move.named('Bulldoze', 'Earthquake', 'Magnitude', 'Muddy Water', 'Surf')) {
                basePower *= 0.5;
            }
            if ((0, util_2.isGrounded)(attacker, field) && move.hasType('Grass')) {
                basePower *= 1.5;
            }
            if ((0, util_2.isGrounded)(defender, field) && move.hasType('Fire')) {
                basePower *= 1.5;
            }
            if (move.named('Sludge Wave', 'Acid Downpour') || (move.named('Gust', 'Hurricane', 'Razor Wind', 'Twister', 'Supersonic Skystrike', 'Splintered Stormshards', 'Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive') && !field.hasWeather('Rain', 'Heavy Rain'))) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Holy':
            if (move.named('Ancient Power', 'Extreme Speed', 'Judgment', 'Nature Power', 'Magical Leaf', 'Mystical Fire', 'Return', 'Sacred Fire', 'Sacred Sword')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Light That Burns the Sky', 'Aeroblast', 'Crush Grip', 'Diamond Storm', 'Doom Desire', 'Dragon Ascent', 'Fleur Cannon', 'Hyperspace Hole', 'Land\'s Wrath', 'Luster Purge', 'Mist Ball', 'Moongeist Beam', 'Origin Pulse', 'Precipice Blades', 'Prismatic Laser', 'Psycho Boost', 'Psystrike', 'Relic Song', 'Roar of Time', 'Secret Sword', 'Spacial Rend', 'Sunsteel Strike', 'V-create', 'Genesis Supernova', 'Menacing Moonraze Maelstrom', 'Searing Sunraze Smash')) {
                basePower *= 1.3;
            }
            if (move.hasType('Normal', 'Fairy') && move.category === 'Special') {
                basePower *= 1.5;
            }
            else if (move.hasType('Psychic', 'Dragon')) {
                basePower *= 1.2;
            }
            else if (move.hasType('Ghost') || (move.hasType('Dark') && move.category === 'Special')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Icy':
            if (move.named('Scald', 'Steam Eruption')) {
                basePower *= 0.5;
            }
            else if (move.named('Splintered Stormshards', 'Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive')) {
                basePower *= 1.3;
            }
            if (move.hasType('Ice') || (move.flags.sound && attacker.hasAbility('Liquid Voice'))) {
                basePower *= 1.5;
            }
            else if (move.hasType('Fire')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Inverse':
            if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Mirror':
            if (move.named('Mirror Shot', 'Nature Power')) {
                basePower *= 2;
            }
            else if (move.named('Aurora Beam', 'Dazzling Gleam', 'Doom Desire', 'Flash Cannon', 'Luster Purge', 'Photon Geyser', 'Prismatic Laser', 'Signal Beam', 'Techno Blast', 'Light That Burns the Sky')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Boomburst', 'Bulldoze', 'Earthquake', 'Explosion', 'Hyper Voice', 'Magnitude', 'Self-Destruct', 'Tectonic Rage')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Misty':
            if (move.named('Explosion', 'Mind Blown', 'Self-Destruct')) {
                basePower *= 0;
            }
            else if (move.named('Dark Pulse', 'Night Daze', 'Shadow Ball')) {
                basePower *= 0.5;
            }
            else if (move.named('Aura Sphere', 'Dazzling Gleam', 'Doom Desire', 'Fairy Wind', 'Icy Wind', 'Magical Leaf', 'Mist Ball', 'Nature Power', 'Moonblast', 'Moongeist Beam', 'Mystical Fire', 'Sylver Wind', 'Steam Eruption')) {
                basePower *= 1.5;
            }
            else if (move.named('Acid Downpour')) {
                basePower *= 1.3;
            }
            if (move.hasType('Dragon')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Mountain':
            if (move.named('Avalanche', 'Circle Throw', 'Eruption', 'Fairy Wind', 'Hyper Voice', 'Icy Wind', 'Ominous Wind', 'Razor Wind', "Nature Power", 'Silver Wind', 'Storm Throw', 'Thunder', 'Twister', 'Vital Throw')) {
                basePower *= 1.5;
            }
            if (move.named('Fairy Wind', 'Gust', 'Icy Wind', 'Ominous Wind', 'Razor Wind', 'Silver Wind', 'Twister') && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            if (move.named('Splintered Stormshards', 'Blizzard', 'Glaciate', 'Subzero Slammer')) {
                basePower *= 1.3;
            }
            if (move.hasType('Flying') && move.category == 'Special' && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            if (move.hasType('Rock', "Flying")) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Murkwater':
            if (move.hasType('Ground') && !move.named('Mud Shot', 'Mud-Slap', 'Thousand Waves', 'Mud Bomb')) {
                basePower *= 0;
            }
            else if (move.named('Mud Bomb', 'Mud Shot', 'Mud-Slap', 'Thousand Waves', 'Acid', 'Acid Spray', 'Brine', 'Smack Down')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Whirlpool', 'Blizzard', 'Glaciate', 'Subzero Slammer')) {
                basePower *= 1.3;
            }
            if (move.hasType('Water')) {
                basePower *= 1.5;
            }
            else if (move.hasType('Poison')) {
                basePower *= 1.5;
            }
            else if (move.hasType('Electric') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'New World':
            if (move.named('Doom Desire')) {
                basePower *= 4;
            }
            else if (move.named('Ancient Power', 'Comet Punch', 'Draco Meteor', 'Future Sight', 'Hyperspace Fury', 'Hyperspace Hole', 'Meteor Mash', 'Moonblast', 'Spacial Rend', 'Nature Power', 'Swift', 'Vacuum Wave', 'Black Hole Eclipse')) {
                basePower *= 2;
            }
            else if (move.named('Aeroblast', 'Aurora Beam', 'Bolt Strike', 'Blue Flare', 'Core Enforcer', 'Crush Grip', 'Dazzling Gleam', 'Diamond Storm', 'Dragon Ascent', 'Earth Power', 'Eruption', 'Flash Cannon', 'FleurCannon', 'Freeze Shock', 'Fusion Bolt', 'Fusion Flare', 'Ice Burn', 'Judgment', 'Land\'s Wrath', 'Luster Purge', 'Magma Storm', 'Mind Blown', 'Mirro Shot', 'Mist Ball', 'Moongeist Beam', 'Multi-Attack', 'Oblivion Wing', 'Origin Pulse', 'Photon Geyser', 'Plasma Fists', 'Power Gem', 'Precipice Blades', 'Prismatic Laser', 'Psycho Boost', 'Psystrike', 'Relic Song', 'Roar of Time', 'Sacred Fire', 'Sacred Sword', 'Searing Shot', 'Secret Sword', 'Seed Flare', 'Shadow Force', 'Signal Beam', 'Spectral Thief', 'Steam Eruption', 'Sunsteel Strike', 'Techno Blast', 'Thousand Arrows', 'Thousand Waves', 'V-create', 'Continental Crush', 'Genesis Supernova', 'Menacing Moonraze Maelstrom', 'Searing Sunraze Smash', 'Soul-Stealing 7-Star Strike')) {
                basePower *= 1.5;
            }
            else if (move.named('Bulldoze', 'Earthquake', 'Magnitude')) {
                basePower *= 0.25;
            }
            if (move.hasType('Dark')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Psychic':
            if (move.named('Aura Sphere', 'Hex', 'Magical Leaf', 'Mind Blown', 'Moonblast', 'Mystical Fire')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if ((0, util_2.isGrounded)(attacker, field) && move.hasType('Psychic')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Rainbow':
            if (move.named('Aurora Beam', 'Nature Power', 'Dazzling Gleam', 'Dragon Pulse', 'Fire Pledge', 'Fleur Cannon', 'Grass Pledge', 'Heart Stamp', 'HP', 'HP Bug', 'HP Dark', 'HP Dragon', 'HP Electric', 'HP Fairy', 'HP Fighting', 'HP Fire', 'HP Flying', 'HP Ghost', 'HP Grass', 'HP Ground', 'HP Ice', 'HP Poison', 'HP Psychic', 'HP Rock', 'HP Steel', 'HP Water', 'Judgment', 'Mist Ball', 'Moonblast', 'Mystica lFire', 'Prismatic Laser', 'Relic Song', 'Sacred Fire', 'Secret Power', 'Silver Wind', 'Solar Beam', 'Solar Blade', 'Sparkling Aria', 'Tri Attack', 'Water Pledge', 'Weather Ball', 'Zen Headbutt', 'Oceanic Operetta', 'Twinkle Tackle')) {
                basePower *= 1.5;
            }
            else if (move.named('Dark Pulse', 'Night Daze', 'Shadow Ball', 'Never-Ending Nightmare')) {
                basePower *= 0.5;
            }
            else if (move.named('Splintered Stormshards', 'Light That Burns the Sky')) {
                basePower *= 1.3;
            }
            if (move.hasType('Normal') && move.category === 'Special') {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Rocky':
            if (move.named('Rock Smash', 'Nature Power')) {
                basePower *= 2;
            }
            else if (move.named('Bulldoze', 'Earthquake', 'Magnitude', 'Rock Climb', 'Strength', 'Accelerock')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if (move.hasType('Rock')) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Short-Circuit 2':
        case 'Short-Circuit 0.5':
        case 'Short-Circuit 0.8':
        case 'Short-Circuit 1.2':
        case 'Short-Circuit 1.5':
            if (move.named('Flash Cannon', 'Gear Grind', 'Gyro Ball', 'Magnet Bomb', 'Magnet Bomb', 'Muddy Water', 'Surf', 'Dazzling Gleam', 'Hydro Vortex')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Night Slash', 'Dark Pulse', 'Night Daze', 'Shadow Ball', 'Shadow Bone', 'Shadow Claw', 'Shadow Force', 'Shadow Punch', 'Shadow Sneak', 'Charge Beam', 'Discharge', 'Nature Power', 'Parabolic Charge', 'Wild Charge', 'Gigavolt Havoc')) {
                basePower *= 1.3;
            }
            else if (move.named('Light That Burns the Sky')) {
                basePower *= 0.5;
            }
            if (move.hasType('Electric')) {
                if (field.hasTerrain('Short-Circuit 0.5')) {
                    basePower *= 0.5;
                }
                else if (field.hasTerrain('Short-Circuit 0.8')) {
                    basePower *= 0.8;
                }
                else if (field.hasTerrain('Short-Circuit 1.2')) {
                    basePower *= 1.2;
                }
                else if (field.hasTerrain('Short-Circuit 1.5')) {
                    basePower *= 1.5;
                }
                else if (field.hasTerrain('Short-Circuit 2')) {
                    basePower *= 2;
                }
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Snowy Mt':
            if (move.named('Icy Wind')) {
                basePower *= 2;
            }
            if (move.named('Avalanche', 'Nature Power', 'Circle Throw', 'Fairy Wind', 'Glaciate', 'Hyper Voice', 'Ominous Wind', 'Powder Snow', 'Razor Wind', 'Silver Wind', 'Storm Throw', 'Twister', 'Vital Throw')) {
                basePower *= 1.5;
            }
            if (move.named('Fairy Wind', 'Gust', 'Icy Wind', 'Ominous Wind', 'Razor Wind', 'Silver Wind', 'Twister') && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            else if (move.named('Scald', 'Steam Eruption')) {
                basePower *= 0.5;
            }
            else if (move.named('Splintered Stormshards', 'Eruption', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive')) {
                basePower *= 1.3;
            }
            if (move.hasType('Flying') && move.category == 'Special' && field.hasWeather('Strong Winds')) {
                basePower *= 1.5;
            }
            if (move.hasType('Rock', 'Flying')) {
                basePower *= 1.5;
            }
            else if (move.hasType('Ice')) {
                basePower *= 1.5;
            }
            else if (move.hasType('Fire')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Starlight':
            if (!field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain', 'Hail', 'Strong Winds', 'Sand')) {
                if (move.named('Doom Desire')) {
                    basePower *= 4;
                }
                else if (move.named('Comet Punch', 'Draco Meteor', 'Hyperspace Fury', 'Hyperspace Hole', 'Meteor Mash', 'Moongeist Beam', 'Spacial Rend', 'Swift', 'Black Hole Eclipse', 'Menacing Moonraze Maelstrom', 'Searing Sunraze Smash')) {
                    basePower *= 2;
                }
                else if (move.named('Aurora Beam', 'Dazzling Gleam', 'Flash Cannon', 'Luster Purge', 'Mirro Shot', 'Moonblast', 'Nature Power', 'Photon Geyser', 'Signal Beam', 'Solar Beam', 'Techno Blast')) {
                    basePower *= 1.5;
                }
                if (move.hasType('Dark', 'Psychic')) {
                    basePower *= 1.5;
                }
                else if (move.hasType('Fairy')) {
                    basePower *= 1.3;
                }
            }
            else if (move.named('Splintered Stormshards', 'Light That Burns the Sky')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Superheated':
            if (move.named('Scald', 'Steam Eruption')) {
                basePower *= 1.5;
            }
            else if (move.named('Eruption', 'Explosion', 'Self-Destruct', 'Fire Pledge', 'Flame Burst', 'Heat Wave', 'Nature Power', 'Incinerate', 'Lava Plume', 'Mind Blown', 'Searing Shot', 'Inferno Overdrive') && !field.hasWeather('Rain', 'Heavy Rain')) {
                basePower *= 1.3;
            }
            else if (move.named('Muddy Water', 'Sparkling Aria', 'Surf', 'Water Pledge', 'Water Spout', 'Hydro Vortex', 'Oceanic Operetta')) {
                basePower *= 0.5;
            }
            if (move.hasType('Water') && !move.named('Scald', 'Steam Eruption')) {
                basePower *= 0.9;
            }
            else if (move.hasType('Fire')) {
                basePower *= 1.1;
            }
            else if (move.hasType('Ice')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Swamp':
            if (move.named('Explosion', 'Mind Blown', 'Self-Destruct')) {
                basePower *= 0;
            }
            else if (move.named('Smack Down', 'Thousand Arrows', 'Brine', 'Mud Bomb', 'Gunk Shot', 'Mud Shot', 'Mud-Slap', 'Muddy Water', 'Nature Power', 'Sludge Wave', 'Surf', 'Hydro Vortex')) {
                basePower *= 1.5;
            }
            else if (move.named('Bulldoze', 'Earthquake', 'Magnitude')) {
                basePower *= 0.25;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            if (move.hasType('Poison') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 1.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Underwater':
            if (move.named('Anchor Shot')) {
                basePower *= 2;
            }
            else if (move.named('Water Pulse', 'Nature Power')) {
                basePower *= 1.5;
            }
            else if (move.named('Dive', 'Bounce', 'Fly', 'Sky Drop', 'Acid Downpour')) {
                basePower *= 1.3;
            }
            if (move.hasType('Fire')) {
                basePower *= 0;
            }
            else if (move.hasType('Electric')) {
                basePower *= 2;
            }
            else if (move.hasType('Water')) {
                basePower *= 1.5;
            }
            if (move.category === 'Physical' && !move.hasType('Water', "Ground") && !attacker.hasAbility('Steelworker')) {
                basePower *= 0.5;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Wasteland':
            if (move.named('Spit Up')) {
                basePower *= 2;
            }
            else if (move.named('Mud Bomb', 'Mud Shot', 'Mud-Slap', 'Power Whip', 'Vine Whip')) {
                basePower *= 1.5;
            }
            else if (move.named('Gunk Shot', 'Nature Power', 'Octazooka', 'Sludge', 'Sludge Wave')) {
                basePower *= 1.2;
            }
            else if (move.named('Bulldoze', 'Earthquake', 'Magnitude')) {
                basePower *= 0.25;
            }
            else if (move.named('Splintered Stormshards')) {
                basePower *= 1.3;
            }
            desc.moveBP = basePower;
            desc.terrain = field.terrain;
            desc.moveType = move.type;
            break;
        case 'Water':
            if (move.named('Dive')) {
                basepower *= 1.95;
                
            else if (move.named('Muddy Water', 'Surf', 'Whirlpool', 'Nature Power', 'Hydro Vortex')) {
                basePower *= 1.5;
            }
            else if (move.named('Splintered Stormshards', 'Blizzard', 'Glaciate', 'Subzero Slammer', 'Acid Downpour')) {
                basePower *= 1.3;
            }
            if (move.hasType('Ground')) {
                basePower *= 0;
            }
            else if (move.hasType('Water') || (move.hasType('Electric') && (0, util_2.isGrounded)(defender, field))) {
                basePower *= 1.5;
            }
            else if (move.hasType('Fire') && (0, util_2.isGrounded)(defender, field)) {
                basePower *= 0.5;
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
    if (basePower === 0) {
        return 0;
    }
    var bpMods = calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder, hit);
    basePower = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((basePower * (0, util_2.chainMods)(bpMods, 41, 2097152)) / 4096)));
    if (attacker.teraType && move.type === attacker.teraType &&
        attacker.hasType(attacker.teraType) && move.hits === 1 && !move.multiaccuracy &&
        move.priority <= 0 && move.bp > 0 && !move.named('Dragon Energy', 'Eruption', 'Water Spout') &&
        basePower < 60 && gen.num >= 9) {
        basePower = 60;
        desc.moveBP = 60;
    }
    return basePower;
}
exports.calculateBasePowerSMSSSV = calculateBasePowerSMSSSV;
function calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder, hit) {
    var bpMods = [];
    var defenderItem = (defender.item && defender.item !== '')
        ? defender.item : defender.disabledItem;
    var resistedKnockOffDamage = (!defenderItem || (0, util_2.isQPActive)(defender, field)) ||
        (defender.named('Dialga-Origin') && defenderItem === 'Adamant Crystal') ||
        (defender.named('Palkia-Origin') && defenderItem === 'Lustrous Globe') ||
        (defender.name.includes('Giratina-Origin') && defenderItem.includes('Griseous')) ||
        (defender.name.includes('Arceus') && defenderItem.includes('Plate')) ||
        (defender.name.includes('Genesect') && defenderItem.includes('Drive')) ||
        (defender.named('Groudon', 'Groudon-Primal') && defenderItem === 'Red Orb') ||
        (defender.named('Kyogre', 'Kyogre-Primal') && defenderItem === 'Blue Orb') ||
        (defender.name.includes('Silvally') && defenderItem.includes('Memory')) ||
        defenderItem.includes(' Z') ||
        (defender.named('Zacian') && defenderItem === 'Rusted Sword') ||
        (defender.named('Zamazenta') && defenderItem === 'Rusted Shield') ||
        (defender.name.includes('Ogerpon-Cornerstone') && defenderItem === 'Cornerstone Mask') ||
        (defender.name.includes('Ogerpon-Hearthflame') && defenderItem === 'Hearthflame Mask') ||
        (defender.name.includes('Ogerpon-Wellspring') && defenderItem === 'Wellspring Mask') ||
        (defender.named('Venomicon-Epilogue') && defenderItem === 'Vile Vial');
    if (!resistedKnockOffDamage && defenderItem) {
        var item = gen.items.get((0, util_1.toID)(defenderItem));
        resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
    }
    if (!resistedKnockOffDamage && hit > 1 && !defender.hasAbility('Sticky Hold')) {
        resistedKnockOffDamage = true;
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
        (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
        (move.named('Venoshock') && (defender.hasStatus('psn', 'tox') || field.hasTerrain('Corrosive', 'Corrosive Mist', 'Murkwater', 'Wasteland'))) ||
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
        var types = defender.teraType && defender.teraType !== 'Stellar'
            ? [defender.teraType] : defender.types;
        var type1Effectiveness = (0, util_2.getMoveEffectiveness)(gen, move, types[0], isGhostRevealed, field.isGravity, isRingTarget);
        var type2Effectiveness = types[1] ? (0, util_2.getMoveEffectiveness)(gen, move, types[1], isGhostRevealed, field.isGravity, isRingTarget) : 1;
        if (type1Effectiveness * type2Effectiveness >= 2) {
            bpMods.push(5461);
            desc.moveBP = basePower * (5461 / 4096);
        }
    }
    if (field.attackerSide.isHelpingHand || (field.hasTerrain('Big Top') && attacker.hasItem('Synthetic Seed'))) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    if ((attacker.hasAbility('Flare Boost') && (attacker.hasStatus('brn') || field.hasTerrain('Burning')) && move.category === 'Special') ||
        (attacker.hasAbility('Toxic Boost') && (attacker.hasStatus('psn', 'tox') || field.hasTerrain('Corrosive', 'Murkwater', 'Wasteland')) && move.category === 'Physical') ||
        (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Steely Spirit') && move.hasType('Steel')) ||
        (attacker.hasAbility('Sharpness') && move.flags.slicing)) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Technician')) {
        if (field.hasTerrain('Factory') && basePower <= 80) {
            bpMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
        else if (basePower <= 60) {
            bpMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
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
    if ((attacker.hasAbility('Sheer Force') && (move.secondaries || move.named('Order Up')) && !move.isMax) ||
        (attacker.hasAbility('Sand Force') && (field.hasWeather('Sand') || field.hasTerrain('Desert', 'Ashen Beach')) && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Analytic') && (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
        (attacker.hasAbility('Tough Claws') && move.flags.contact) ||
        (attacker.hasAbility('Punk Rock') && move.flags.sound)) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
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
        if (attacker.hasAbility('Galvanize')) {
            if (field.hasTerrain('Electric', 'Factory')) {
                bpMods.push(6144);
            }
            else if (field.hasTerrain('Short-Circuit 0.5', 'Short-Circuit 0.8', 'Short-Circuit 1.2', 'Short-Circuit 1.5', 'Short-Circuit 2')) {
                bpMods.push(8192);
            }
            else {
                bpMods.push(4915);
            }
        }
        else if (attacker.hasAbility('Pixilate')) {
            if (field.hasTerrain('Misty')) {
                bpMods.push(6144);
            }
            else {
                bpMods.push(4915);
            }
        }
        else if (attacker.hasAbility('Aerilate')) {
            if (field.hasTerrain('Mountain', 'Snowy Mt')) {
                bpMods.push(6144);
            }
            else {
                bpMods.push(4915);
            }
        }
        else if (attacker.hasAbility('Refrigerate')) {
            if (field.hasTerrain('Icy', 'Snowy Mt')) {
                bpMods.push(6144);
            }
            else {
                bpMods.push(4915);
            }
        }
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
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
        (attacker.hasItem('Adamant Orb') && attacker.named('Dialga'))) &&
        move.hasType('Steel', 'Dragon')) ||
        (((attacker.hasItem('Lustrous Orb') &&
            attacker.named('Palkia')) ||
            (attacker.hasItem('Lustrous Globe') && attacker.named('Palkia-Origin'))) &&
            move.hasType('Water', 'Dragon')) ||
        (((attacker.hasItem('Griseous Orb') || attacker.hasItem('Griseous Core')) &&
            (attacker.named('Giratina-Origin') || attacker.named('Giratina'))) &&
            move.hasType('Ghost', 'Dragon')) ||
        (attacker.hasItem('Vile Vial') &&
            attacker.named('Venomicon-Epilogue') &&
            move.hasType('Poison', 'Flying')) ||
        (attacker.hasItem('Soul Dew') &&
            attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
            move.hasType('Psychic', 'Dragon')) ||
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
    else if (attacker.hasItem('Punching Glove') && move.flags.punch) {
        bpMods.push(4506);
    }
    return bpMods;
}
exports.calculateBPModsSMSSSV = calculateBPModsSMSSSV;
function calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var attack;
    var attackSource = move.named('Foul Play') ? defender : attacker;
    var attackStat = move.named('Shell Side Arm') && (0, util_2.getShellSideArmCategory)(attacker, defender) === 'Physical' ? 'atk'
        : move.named('Body Press') ? 'def'
            : field.hasTerrain('Glitch') && move.category === 'Special' && attackSource.stats.spa < attackSource.stats.spd ? 'spd'
                : move.category === 'Special' ? 'spa'
                    : 'atk';
    desc.attackEVs =
        move.named('Foul Play')
            ? (0, util_2.getStatDescriptionText)(gen, defender, attackStat, defender.nature)
            : (0, util_2.getStatDescriptionText)(gen, attacker, attackStat, attacker.nature);
    if (attackSource.boosts[attackStat] === 0 ||
        (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    else if (defender.hasAbility('Unaware')) {
        attack = attackSource.rawStats[attackStat];
        desc.defenderAbility = defender.ability;
    }
    else {
        attack = (0, util_2.getModifiedStat)(attackSource.rawStats[attackStat], attackSource.boosts[attackStat]);
        desc.attackBoost = attackSource.boosts[attackStat];
    }
    if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
        attack = (0, util_2.pokeRound)((attack * 3) / 2);
        desc.attackerAbility = attacker.ability;
    }
    var atMods = calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc);
    attack = (0, util_2.OF16)(Math.max(1, (0, util_2.pokeRound)((attack * (0, util_2.chainMods)(atMods, 410, 131072)) / 4096)));
    return attack;
}
exports.calculateAttackSMSSSV = calculateAttackSMSSSV;
function calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc) {
    var atMods = [];
    if ((attacker.hasAbility('Slow Start') && attacker.abilityOn &&
        (move.category === 'Physical' || (move.category === 'Special' && move.isZ))) ||
        (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2)) {
        atMods.push(2048);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Solar Power') && field.hasWeather('Sun', 'Harsh Sunshine') && move.category === 'Special') ||
        (attacker.named('Cherrim') && attacker.hasAbility('Flower Gift') && field.hasWeather('Sun', 'Harsh Sunshine') && move.category === 'Physical') ||
        (attacker.hasAbility("Flower Gift") && field.hasTerrain('Flower Garden 1', 'Flower Garden 2', 'Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5') && move.category === 'Physical')) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if ((attacker.hasAbility('Gorilla Tactics') && move.category === 'Physical' &&
        !attacker.isDynamaxed)) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
        (attacker.curHP() <= attacker.maxHP() / 3 &&
            ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
                (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
                (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
                (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')) ||
        (attacker.hasAbility('Overgrow') && attacker.curHP() <= attacker.maxHP() * 0.75 && field.hasTerrain('Flower Garden 2') && move.hasType('Grass')) ||
        (attacker.hasAbility('Overgrow') && attacker.curHP() <= attacker.maxHP() && move.hasType('Grass') && field.hasTerrain('Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5')) ||
        (attacker.hasAbility('Swarm') && field.hasTerrain('Forest') && move.hasType('Bug')) ||
        (attacker.hasAbility('Overgrow') && field.hasTerrain('Forest') && move.hasType('Grass')) ||
        (attacker.hasAbility('Swarm') && move.hasType('Bug') && field.hasTerrain('Flower Garden 1', 'Flower Garden 2', 'Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5')) ||
        (attacker.hasAbility('Blaze') && field.hasTerrain('Burning') && move.hasType('Fire')) ||
        (attacker.hasAbility('Torrent') && field.hasTerrain('Water', 'Underwater') && move.hasType('Water')) ||
        (field.hasTerrain('Short-Circuit 0.5', 'Short-Circuit 0.8', 'Short-Circuit 1.2', 'Short-Circuit 1.5', 'Short-Circuit 2') && attacker.hasAbility('Plus', 'Minus'))) {
        if (attacker.hasAbility('Swarm') && field.hasTerrain('Flower Garden 3')) {
            atMods.push(7373);
            desc.attackerAbility = attacker.ability;
        }
        else if (attacker.hasAbility('Swarm', 'Overgrow') && field.hasTerrain('Flower Garden 4')) {
            atMods.push(7373);
            desc.attackerAbility = attacker.ability;
        }
        else if (attacker.hasAbility('Swarm', 'Overgrow') && field.hasTerrain('Flower Garden 5')) {
            atMods.push(8192);
            desc.attackerAbility = attacker.ability;
        }
        else {
            atMods.push(6144);
            desc.attackerAbility = attacker.ability;
        }
    }
    else if ((attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) ||
        (attacker.hasItem('Elemental Seed') && field.hasTerrain('Dragon\'s Den') && move.hasType('Fire'))) {
        atMods.push(6144);
        desc.attackerAbility = 'Flash Fire';
    }
    else if ((attacker.hasAbility('Dragon\'s Maw') && move.hasType('Dragon')) ||
        (attacker.hasAbility('Rocky Payload') && move.hasType('Rock'))) {
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
        (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical') ||
        (attacker.hasAbility('Pure Power') && move.category === 'Special' && field.hasTerrain('Psychic'))) {
        atMods.push(8192);
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
    if (attacker.hasItem('Eviolite', "Assault Vest") && move.category === "Special" && field.hasTerrain('Glitch')) {
        desc.attackerItem = attacker.item;
        atMods.push(6144);
    }
    else if (attacker.hasItem('Elemental Seed') && field.hasTerrain('Electric') && move.hasType('Electric')) {
        atMods.push(8192);
        desc.attackerItem = attacker.item;
    }
    if (field.attackerSide.isFlowerGift &&
        !attacker.hasAbility('Flower Gift') &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.category === 'Physical') {
        atMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftAttacker = true;
    }
    if (field.attackerSide.isSteelySpirit &&
        move.hasType('Steel')) {
        atMods.push(6144);
        desc.isSteelySpiritAttacker = true;
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
        field.hasTerrain('Electric')) ||
        (attacker.hasAbility('Orichalcum Pulse') && move.category === 'Physical' &&
            field.hasWeather('Sun', 'Harsh Sunshine') && !attacker.hasItem('Utility Umbrella'))) {
        atMods.push(5461);
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
    desc.defenseEVs = (0, util_2.getStatDescriptionText)(gen, defender, defenseStat, defender.nature);
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
        defense = (0, util_2.getModifiedStat)(defender.rawStats[defenseStat], defender.boosts[defenseStat]);
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
    if (field.hasTerrain('Glitch') && move.named('Explosion', 'Self-Destruct')) {
        dfMods.push(2048);
    }
    if (field.hasTerrain('New World') && !(0, util_2.isGrounded)(defender, field)) {
        dfMods.push(3686);
    }
    if (((field.hasTerrain('Misty') && defender.hasType('Fairy') && move.category === 'Special')) || (field.hasTerrain('Desert') && defender.hasType('Ground')) || (field.hasTerrain('Icy', 'Snowy Mt') && defender.hasType('Ice') && field.hasWeather('Hail'))) {
        dfMods.push(6144);
        desc.terrain = field.terrain;
    }
    if (field.hasTerrain('Dragon\'s Den') && defender.hasType('Dragon')) {
        dfMods.push(5325);
        desc.terrain = field.terrain;
    }
    if (field.hasTerrain("Dragon's Den") && defender.hasAbility('Magma Armor')) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    if (field.hasTerrain('Dark Crystal') && (defender.hasType('Dark', 'Ghost'))) {
        dfMods.push(6144);
        desc.terrain = field.terrain;
    }
    if (defender.hasAbility('Marvel Scale')) {
        if (defender.status && hitsPhysical) {
            dfMods.push(6144);
            desc.defenderAbility = defender.ability;
        }
        else if (field.hasTerrain('Misty', 'Rainbow', 'Fairy Tale', 'Dragon\'s Den', 'Starlight') && hitsPhysical) {
            dfMods.push(6144);
            desc.defenderAbility = defender.ability;
        }
    }
    else if (defender.named('Cherrim') && defender.hasAbility('Flower Gift') && (field.hasWeather('Sun', 'Harsh Sunshine') || field.hasTerrain('Flower Garden 1', 'Flower Garden 2', 'Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5')) &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
        desc.weather = field.weather;
    }
    else if (field.defenderSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftDefender = true;
    }
    else if (defender.hasAbility('Grass Pelt') &&
        field.hasTerrain('Grassy', "Forest") &&
        hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
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
    if ((attacker.hasAbility('Queenly Majesty') && field.hasTerrain('Chess Board', 'Fairy Tale')) || (field.hasTerrain('Starlight', 'New World') && attacker.hasAbility('Victory Star'))) {
        finalMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    if (field.hasTerrain('Chess Board')) {
        if (move.named('Ancient Power', 'Psychic', 'Secret Power', 'Strength', 'Continental Crush', 'Shattered Psyche') && defender.hasAbility('Oblivious', 'Simple', 'Unaware', 'Klutz')) {
            finalMods.push(8192);
            desc.defenderAbility = defender.ability;
        }
        else if (move.named('Ancient Power', 'Psychic', 'Secret Power', 'Strength', 'Continental Crush', 'Shattered Psyche') && defender.hasAbility('Adaptability', 'Synchronize', 'Anticipation', 'Telepathy')) {
            finalMods.push(2048);
            desc.defenderAbility = defender.ability;
        }
    }
    if (field.defenderSide.isReflect && move.category === 'Physical' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isReflect = true;
    }
    else if (field.defenderSide.isLightScreen && move.category === 'Special' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
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
    else if (attacker.hasAbility('Sniper') && isCritical) {
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
    if (defender.hasAbility('Multiscale') &&
        defender.curHP() === defender.maxHP() &&
        hitCount === 0 &&
        (!field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) ||
            defender.hasItem('Heavy-Duty Boots')) && !attacker.hasAbility('Parental Bond (Child)')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
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
    if (defender.hasAbility('Solid Rock', 'Filter') && typeEffectiveness > 1) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Prism Armor')) {
        if (field.hasTerrain('Dark Crystal', 'Rainbow', 'Crystal Fire', 'Crystal Water', 'Crystal Grass', 'Crystal Psychic')) {
            if (typeEffectiveness > 1) {
                finalMods.push(1536);
                desc.defenderAbility = defender.ability;
            }
            else {
                finalMods.push(3072);
                desc.defenderAbility = defender.ability;
            }
        }
        else if (typeEffectiveness > 1) {
            finalMods.push(3072);
            desc.defenderAbility = defender.ability;
        }
    }
    if (defender.hasAbility('Shadow Shield')) {
        if (field.hasTerrain('Dark Crystal', 'Starlight', 'New World')) {
            if (defender.curHP() === defender.maxHP() &&
                !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
                !attacker.hasAbility('Parental Bond (Child)') && typeEffectiveness > 1) {
                finalMods.push(1536);
                desc.defenderAbility = defender.ability;
            }
            else if (typeEffectiveness > 1) {
                finalMods.push(3072);
                desc.defenderAbility = defender.ability;
            }
        }
        else if (defender.curHP() === defender.maxHP() &&
            !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
            !attacker.hasAbility('Parental Bond (Child)')) {
            finalMods.push(2048);
            desc.defenderAbility = defender.ability;
        }
    }
    if (defender.hasAbility('Flower Veil') && field.hasTerrain('Flower Garden 3', 'Flower Garden 4', 'Flower Garden 5')) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
        desc.terrain = field.terrain;
    }
    if (field.hasTerrain('Mountain', 'Snowy Mt') && attacker.hasAbility('Long Reach')) {
        finalMods.push(6144);
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
    return finalMods;
}
exports.calculateFinalModsSMSSSV = calculateFinalModsSMSSSV;
function hasTerrainSeed(pokemon) {
    return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}
//# sourceMappingURL=gen789.js.map
