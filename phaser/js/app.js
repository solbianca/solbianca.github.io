(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[
  {
    "level": "01",
    "staticPlatforms":[
      {"x":400,"y":400},
      {"x":-150,"y":250}
    ],
    "movablePlatforms":[],
    "totalBones": 16,
    "nextLevel": "02"
  },
  {
    "level": "02",
    "staticPlatforms":[
      {"x":303,"y":130,"scale": [0.5,1]},
      {"x":440,"y":400,"scale": [0.89,1]},
      {"x":-150,"y":270}
    ],
    "movablePlatforms":[],
    "totalBones": 16,
    "nextLevel": "03"
  },
  {
    "level": "03",
    "staticPlatforms":[
      {"x":850,"y":450},
      {"x":335,"y":310},
      {"x":-150,"y":250}
    ],
    "movablePlatforms":[],
    "totalBones": 16,
    "nextLevel": "04"
  },
  {
    "level": "04",
    "staticPlatforms":[
      {"x":335,"y":310},
      {"x":-150,"y":200}
    ],
    "movablePlatforms":[
      {"x":850,"y":450}
    ],
    "totalBones": 16,
    "nextLevel": "end"
  }
]

},{}],2:[function(require,module,exports){
'use strict';

var _Boot = require('./modules/Boot');

var Boot = _interopRequireWildcard(_Boot);

var _Load = require('./modules/Load');

var Load = _interopRequireWildcard(_Load);

var _End = require('./modules/End');

var End = _interopRequireWildcard(_End);

var _Levels = require('./modules/Levels');

var Levels = _interopRequireWildcard(_Levels);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(1067, 600, Phaser.AUTO, 'gameDiv');

game.state.add('boot', Boot.init(game));
game.state.add('load', Load.init(game));
game.state.add('levels', Levels.init(game));
game.state.add('end', End.init(game));

game.state.start('boot');

},{"./modules/Boot":4,"./modules/End":6,"./modules/Levels":7,"./modules/Load":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.collect = collect;

var _Random = require('./Random');

var Random = _interopRequireWildcard(_Random);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {Phaser.Game} game
 * @param {integer} quantity
 */
function create(game, quantity) {
  var bones = game.add.group();
  bones.enableBody = true;

  for (var i = 0; i < quantity; i++) {
    var bone = void 0;
    var skin = Random.int(0, 4);
    if (i === 0) {
      bone = bones.create(10, 0, 'bone', skin);
    } else {
      bone = bones.create(i * 68, 0, 'bone', skin);
    }

    bone.body.gravity.y = 200;
    bone.body.bounce.y = 0.5 + Math.random() * 0.2;
  }

  return bones;
}

/**
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} bone
 * @param {Phaser.Sound} sfx
 */
function collect(game, bone) {
  var sfx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (sfx) {
    sfx.play();
  }
  bone.kill();
  game.global.collectedBones++;
  var score = game.global.score + game.global.collectedBones;
  game.global.scoreText.text = 'Score: ' + score;
  game.global.levelScoreText.text = 'Level score: ' + game.global.collectedBones;
}

},{"./Random":13}],4:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
function init(game) {
  return {
    preload: function preload(game) {
      return _preload(game);
    },
    create: function create() {
      return _create(game);
    }
  };
}

/**
 * @param {Phaser.Game} game
 */
function _preload(game) {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.load.image('progressBar', 'assets/images/progress_bar.png');
}

/**
 * @param {Phaser.Game} game
 */
function _create(game) {
  game.state.start('load');
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var _Bones = require('./Bones');

var Bones = _interopRequireWildcard(_Bones);

var _Score = require('./Score');

var Score = _interopRequireWildcard(_Score);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {Phaser.Game} game
 * @param {string} level
 */
function update(game, level) {

  var bones = game.global.level.bones;
  var staticPlatforms = game.global.level.staticPlatforms;
  var movablePlatforms = game.global.level.movablePlatforms;
  var ground = game.global.level.ground;
  var player = game.global.level.player;
  var sounds = game.global.sounds;

  var overlapPlayerBones = function overlapPlayerBones(player, bone) {
    Bones.collect(game, bone, sounds.getBoneSfx);
    if (isGameEnded(game.global.collectedBones, level.totalBones)) {
      Score.calculate(game, true);
      var go = function go() {
        return game.state.start(level.nextLevel);
      };
      game.camera.fade('#000', 800);
      game.camera.onFadeComplete.add(go);
    }
  };

  game.physics.arcade.collide(bones, staticPlatforms);
  game.physics.arcade.collide(bones, movablePlatforms);
  game.physics.arcade.collide(bones, ground);
  game.physics.arcade.collide(player, staticPlatforms);
  game.physics.arcade.collide(player, movablePlatforms);
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(ground, movablePlatforms);
  game.physics.arcade.overlap(player, bones, overlapPlayerBones);
}

/**
 *
 * @param {integer} collectedBones
 * @param {integer} totalBonesCheck
 * @return {boolean}
 */
function isGameEnded(collectedBones, totalBonesCheck) {
  return collectedBones === totalBonesCheck;
}

},{"./Bones":3,"./Score":14}],6:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
function init(game) {
  return {
    preload: function preload() {
      return _preload(game);
    },
    create: function create() {
      return _create(game);
    },
    update: function update(game) {
      return _update(game);
    }
  };
}

/**
 * @param {Phaser.Game} game
 */
function _preload(game) {
  game.global.music.stop();
  var mainMsgEnd = 'COMPLETE GAME, CONGRATULATIONS!';
  var sizeMainMsg = 50;
  if (game.global.timeLevel == -1) {
    var soundGameOver = game.add.audio('gameOver');
    soundGameOver.play();
    mainMsgEnd = 'GAME OVER';
    sizeMainMsg = 70;
  }

  var textGameOver = game.add.text(game.world.centerX, 280, mainMsgEnd, { font: sizeMainMsg + 'px grobold', fill: '#fff' });
  textGameOver.anchor.set(0.5);

  var textScore = game.add.text(game.world.centerX, 150, 'YOUR SCORE: ' + game.global.score, { font: '11.5px emulogic', fill: '#fff' });
  textScore.anchor.set(0.5);
}

/**
 * @param {Phaser.Game} game
 */
function _create(game) {
  var txtPressEnter = game.add.text(game.world.centerX, 555, 'PRESS ENTER TO RESTART', { font: '15px emulogic', fill: '#fff' });
  txtPressEnter.anchor.set(0.5);
  game.add.tween(txtPressEnter).to({ y: 355 }, 1000).start();

  var txtBlink = function txtBlink() {
    return game.add.tween(txtPressEnter).to({ alpha: 1 }, 700).to({ alpha: 0 }, 700).loop().start();
  };
  game.time.events.add(1000, txtBlink);
}

/**
 * @param {Phaser.Game} game
 */
function _update(game) {
  var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  if (enterKey.isDown) {
    game.global.timeLevel = 0;
    game.global.score = 0;
    game.global.collectedBones = 0;
    game.state.start('levels'); //for now, later wil go to menu
  }
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _LevelsFactory = require('./LevelsFactory');

var LevelsFactory = _interopRequireWildcard(_LevelsFactory);

var _Music = require('./Music');

var Music = _interopRequireWildcard(_Music);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {Phaser.Game} game
 */
function init(game) {
  return {
    preload: function preload(game) {
      return _preload(game);
    },
    create: function create() {
      return _create(game);
    }
  };
}

/**
 * @param {Phaser.Game} game
 */
function _preload(game) {
  game.global = { music: {}, timeLevel: 0, score: 0, collectedBones: 0 };

  game.global.music = Music.createBackgroundMusic(game);
  game.global.music.play();

  var getBoneSfx = game.add.audio('getBone');

  game.global.sounds = { getBoneSfx: getBoneSfx };
  game.global.cursors = game.input.keyboard.createCursorKeys();
  game.global.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  LevelsFactory.create(game);
}

/**
 * @param {Phaser.Game} game
 */
function _create(game) {
  setTimeout(function () {
    game.state.start('01');
  }, 500);
}

},{"./LevelsFactory":8,"./Music":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.create = create;

var _Platforms = require('./Platforms');

var Platforms = _interopRequireWildcard(_Platforms);

var _Player = require('./Player');

var Player = _interopRequireWildcard(_Player);

var _Bones = require('./Bones');

var Bones = _interopRequireWildcard(_Bones);

var _Timer = require('./Timer');

var Timer = _interopRequireWildcard(_Timer);

var _Collision = require('./Collision');

var Collision = _interopRequireWildcard(_Collision);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var levels = require('../data/levels');

/**
 * @param {Phaser.Game} game
 */
function create(game) {
  if (!isLevelsValid(levels)) {
    throw new Error('Data level is not array or empty or dont have required property.');
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var level = _step.value;

      if (!isLevelValid(level)) {
        throw new Error('Level must be an object and contain required properties.');
      }
      game.state.add(level.level, {
        create: function create() {
          return createLevel(game, level);
        },
        update: function update() {
          return updateLevel(game, level);
        }
      });
    };

    for (var _iterator = levels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/**
 * @param {Phaser.Game} game
 * @param {object} level
 */
function createLevel(game, level) {
  game.add.sprite(0, 0, 'background');

  var staticPlatforms = Platforms.createStatic(game, level.staticPlatforms);
  var movablePlatforms = Platforms.createMovable(game, level.movablePlatforms);
  var ground = Platforms.createGround(game);
  var player = Player.create(game);
  var bones = Bones.create(game, level.totalBones);

  Timer.create(game, 20, level);

  game.global.level = {
    staticPlatforms: staticPlatforms,
    movablePlatforms: movablePlatforms,
    ground: ground,
    player: player,
    bones: bones
  };

  var score = 'Score: ' + game.global.score;
  var levelScore = 'Level score: 0';
  game.global.scoreText = game.add.text(16, 16, score, { fontSize: '32px', fill: '#000' });
  game.global.levelScoreText = game.add.text(16, 48, levelScore, { fontSize: '32px', fill: '#000' });
}

function updateLevel(game, level) {
  Collision.update(game, level);
  Player.update(game.global.level.player, game.global.cursors, game.global.spaceKey);
}

/**
 * @param {array} value
 * @returns {boolean}
 */
function isLevelsValid(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * @param {object} level
 * @return {boolean}
 */
function isLevelValid(level) {
  if ((typeof level === 'undefined' ? 'undefined' : _typeof(level)) !== 'object') {
    return false;
  }

  var properties = ['level', 'staticPlatforms', 'movablePlatforms', 'totalBones', 'nextLevel'];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var property = _step2.value;

      if (!level.hasOwnProperty(property)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return true;
}

},{"../data/levels":1,"./Bones":3,"./Collision":5,"./Platforms":11,"./Player":12,"./Timer":15}],9:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
function init(game) {
  return {
    preload: function preload() {
      return _preload(game);
    },
    create: function create() {
      return _create(game);
    }
  };
}

/**
 * @param {Phaser.Game} game
 */
function _preload(game) {
  var textLoading = game.add.text(game.world.centerX, 250, 'LOADING...', { font: '70px grobold', fill: '#fff' });
  textLoading.anchor.set(0.5);

  var progressBar = game.add.sprite(game.world.centerX, 310, 'progressBar');
  progressBar.anchor.set(0.5);

  game.load.setPreloadSprite(progressBar);
  loadDefaultAssets(game);
}

/**
 * @param {Phaser.Game} game
 */
function _create(game) {
  game.state.start('levels');
  // setTimeout(function () { game.state.start('01'); }, 500);
}

/**
 * @param {Phaser.Game} game
 */
function loadDefaultAssets(game) {
  game.load.image('background', 'assets/images/paw_patrol_bg.png');
  game.load.image('platform', 'assets/images/platform.png');
  game.load.image('bone', 'assets/images/bone.png');
  game.load.spritesheet('bone', 'assets/images/gameboy_seize_color_40x60.png', 40, 60);

  //sprites
  // game.load.spritesheet('character', 'assets/images/rubble.png', 80.5, 71);
  // game.load.spritesheet('character', 'assets/images/rubble.png', 80.5, 71);
  game.load.spritesheet('character', 'assets/images/dude.png', 32, 48);

  //sounds
  game.load.audio('bgSound', 'assets/sounds/paw-patrol-theme-song.mp3');
  game.load.audio('getBone', 'assets/sounds/get-item.ogg');
  game.load.audio('gameOver', 'assets/sounds/game-over.ogg');
}

},{}],10:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBackgroundMusic = createBackgroundMusic;
function createBackgroundMusic(game) {
  var music = game.add.audio('bgSound');
  music.loop = true;
  music.volume = 0.2;

  return music;
}

},{}],11:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 * @param {array} platformsLevelData
 * @return {Phaser.Group}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStatic = createStatic;
exports.createMovable = createMovable;
exports.createGround = createGround;
function createStatic(game, platformsLevelData) {
  var platforms = game.add.group();
  platforms.enableBody = true;

  for (var key in platformsLevelData) {
    var platform = platforms.create(platformsLevelData[key].x, platformsLevelData[key].y, 'platform');

    platform.body.immovable = true;

    if ('scale' in platformsLevelData[key]) {
      platform.scale.setTo(platformsLevelData[key].scale[0], platformsLevelData[key].scale[1]);
    }
  }

  return platforms;
}

/**
 * @param {Phaser.Game} game
 * @param {array} platformsLevelData
 * @return {Phaser.Group}
 */
function createMovable(game, platformsLevelData) {
  var platforms = game.add.group();
  platforms.enableBody = true;

  for (var key in platformsLevelData) {
    var platform = platforms.create(platformsLevelData[key].x, platformsLevelData[key].y, 'platform');

    platform.body.immovable = true;
    platform.body.bounce.y = 1;
    platform.body.collideWorldBounds = true;
    platform.body.gravity.y = 200;

    if ('scale' in platformsLevelData[key]) {
      platform.scale.setTo(platformsLevelData[key].scale[0], platformsLevelData[key].scale[1]);
    }
  }

  return platforms;
}

/**
 * @param {Phaser.Game} game
 * @return {Phaser.Group}
 */
function createGround(game) {
  var ground = game.add.group();
  ground.enableBody = true;

  var platform = ground.create(0, game.world.height - 57.6, 'platform');
  platform.scale.setTo(2.6675, 1.8);
  platform.body.immovable = true;

  return ground;
}

},{}],12:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.update = update;
function create(game) {
  // let player = game.add.sprite(32, game.world.height - 150, 'character');
  var player = game.add.sprite(32, game.world.height - 150, 'character');
  player.frame = 4;

  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.1;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  // player.animations.add('left', [0], 10, true);
  // player.animations.add('right', [1], 10, true);
  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  return player;
}

/**
 * @param {Phaser.Sprite} player
 * @param {object} cursors
 * @param {Phaser.Key} spaceKey
 */
function update(player, cursors, spaceKey) {
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -165;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 165;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;
  }

  if ((cursors.up.isDown || spaceKey.isDown) && player.body.touching.down) {
    player.body.velocity.y = -350;
  } else if (cursors.down.isDown && !player.body.touching.down) {
    player.body.velocity.y = 200;
  }
}

},{}],13:[function(require,module,exports){
'use strict';

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.int = int;
function int(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

},{}],14:[function(require,module,exports){
'use strict';

/**
 * @param {Phaser.Game} game
 * @param {boolean} isGameOver
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculate = calculate;
function calculate(game, isGameOver) {
  var score = game.global.collectedBones;
  game.global.score += score;
  game.global.scoreText.text = 'Score: ' + game.global.score;
  game.global.timeLevel = 0;
  game.global.collectedBones = 0;
  if (isGameOver) {
    game.global.timeLevel = -1;
  }
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _Score = require('./Score');

var Score = _interopRequireWildcard(_Score);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {Phaser.Game} game
 * @param {integer} timer
 * @param {object} level
 */
function create(game, timer, level) {
  console.log(timer);
  console.log(level);
  var txtTimer = game.add.text(game.width - 10, 10, '00:' + timer, { font: '35px grobold', fill: '#fff' });
  txtTimer.anchor.set(1, 0);

  var updateTime = function updateTime() {
    if (timer > 0) {
      timer--;
    } else if (timer === 0) {
      Score.calculate(game, true);
      var go = function go() {
        return game.state.start('end');
      };
      game.camera.fade('#000', 800);
      game.camera.onFadeComplete.add(go);
    }

    txtTimer.text = '00:' + (timer < 10 ? '0' : '') + timer;
    if (game.global.timeLevel !== -1) {
      game.global.timeLevel = timer;
    }
  };

  game.time.events.loop(1000, updateTime);
}

},{"./Score":14}]},{},[2]);
