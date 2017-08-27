(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moveByKeyboard = moveByKeyboard;
exports.moveByPlayer = moveByPlayer;
exports.moveByMouse = moveByMouse;
/**
 * Передвигать камеру клавишами клавиатуры
 * 
 * @param {Cursor} cursor 
 * @param {Game} game
 */
function moveByKeyboard(cursors, game) {
    var cameraSpeed = 10;

    if (cursors.up.isDown) {
        game.camera.y -= cameraSpeed;
    } else if (cursors.down.isDown) {
        game.camera.y += cameraSpeed;
    }

    if (cursors.left.isDown) {
        game.camera.x -= cameraSpeed;
    } else if (cursors.right.isDown) {
        game.camera.x += cameraSpeed;
    }
}

/**
 * Камера двигается вслед за игровым персонажем
 * 
 * @param {Cursor} cursor 
 * @param {Player} player 
 */
function moveByPlayer(cursor, player) {
    player.body.setZeroVelocity();

    if (cursors.up.isDown) {
        player.body.moveUp(300);
    } else if (cursors.down.isDown) {
        player.body.moveDown(300);
    }

    if (cursors.left.isDown) {
        player.body.velocity.x = -300;
    } else if (cursors.right.isDown) {
        player.body.moveRight(300);
    }
}

/**
 * Двигать камеру мышкой
 * Нажать левую кнопку мышки передвигать. Камера будет следовать за мышкой. Отжать кнопку что бы остановить следование.
 * 
 * @param {Game} game 
 */
function moveByMouse(game) {
    if (game.input.activePointer.isDown) {
        // move the camera by the amount the mouse has moved since last update
        if (game.origDragPoint) {
            game.camera.x += game.origDragPoint.x - game.input.activePointer.position.x;
            game.camera.y += game.origDragPoint.y - game.input.activePointer.position.y;
        } // set new drag origin to current position	
        game.origDragPoint = game.input.activePointer.position.clone();
    } else {
        game.origDragPoint = null;
    }
}

},{}],2:[function(require,module,exports){
'use strict';

var _camera = require('./camera');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('background', 'static/asserts/debug/debug-grid-1920x1920.png');
    game.load.image('player', 'static/asserts/sprites/phaser-dude.png');
}

var player;
var cursors;

function create() {

    /**
     * Отобразить скрайт бекграунда
     */
    game.add.tileSprite(0, 0, 1920, 1920, 'background');

    /**
     * 
     */
    game.world.setBounds(0, 0, 1920, 1920);
    game.physics.startSystem(Phaser.Physics.P2JS);

    /**
     * Создать игрока в центре экрана
     */
    // player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    for (var i = 0; i < 5; i++) {
        player = game.add.sprite(620, 600 + i * 35, 'player', i);
        player.inputEnabled = true;
        player.input.enableDrag();
        player.input.enableSnap(10, 10, false, true);
        // player.events.onDragStop.add(fixLocation);
    }

    /**
     * Привязать курсор к клавищам клавиатуры
     */
    cursors = game.input.keyboard.createCursorKeys();

    /**
     * Задать начальную позицию камеры
     */
    game.camera.setPosition(game.world.centerX - game.world.centerX / 2, game.world.centerY - game.world.centerY / 2);

    /**
     * Позволить игрока перетаскивать
     */
    //  Input Enable the sprites
    // player.inputEnabled = true;
    //  Allow dragging - the 'true' parameter will make the sprite snap to the center
    // player.input.enableDrag(true);
}

function update() {
    (0, _camera.moveByKeyboard)(cursors, game);
    // moveCameraByMouse(game);
}

function render() {
    game.debug.cameraInfo(game.camera, 3, 2, 32);
    game.debug.spriteCoords(player, 32, 500);
}

},{"./camera":1}]},{},[2]);
