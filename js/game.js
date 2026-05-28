// --- Config ---
const BLOCKSIZE = 28; // px
let numblocks_x = 10; // classic width
const NUMBLOCKS_Y = 20; // classic height
const MOVEMENT_LAG = 85; // ms (soft key repeat)
let fall_delay = 600; // ms
let puntosNecesarios = 100; // ms
const HUD = document.getElementsByClassName("HUD"); //References the HUD elements.
const CONTROLES = document.getElementsByClassName("controles_externos");
let levelsData = [
  "assets/levels/level01.json",
  "assets/levels/level02.json",
  "assets/levels/level03.json",
  "assets/levels/level04.json",
];

// 7 tetrominoes, rotation around a center cell
let n_block_types = 7;

// Color de las piezas
const COLOR_GRIS = 0xc0c0c0;
let color_tetromino = {};

// Scene grid values
const EMPTY = 0;
const FALLING = 1;
const OCCUPIED = 2;

class Tetris {
  constructor() {
    this.scene = [];
    this.sceneBlocks = [];
  }

  // Inicializa la matriz lógica del tablero y la matriz de referencias a bloques ya fijados.
  initGrid() {
    for (let x = 0; x < numblocks_x; x++) {
      let col = [];
      let colBlocks = [];
      for (let y = 0; y < NUMBLOCKS_Y; y++) {
        col.push(EMPTY);
        colBlocks.push(null);
      }
      this.scene.push(col);
      this.sceneBlocks.push(colBlocks);
    }
  }

  // Comprueba si una celda está dentro del tablero y no está ocupada por bloques ya fijados.
  validateCoordinates(x, y) {
    if (x < 0 || x >= numblocks_x) return false;
    if (y < 0 || y >= NUMBLOCKS_Y) return false;
    if (this.scene[x][y] === OCCUPIED) return false;
    return true;
  }

  //special one for rotations
  validateCoordinatesRotate(x, y) {
    if (y < 0 || y >= NUMBLOCKS_Y) return false;
    if (x > 0 && x < numblocks_x) {
      if (this.scene[x][y] === OCCUPIED) return false;
    }
    return true;
  }
}

class Tetromino {
  constructor(shape, color, tetris) {
    this.shape = shape;
    this.color = color;
    this.tetris = tetris;
    this.center = [0, 0];
    this.blocks = [];
    this.cells = [];
    // The positions of each block of a tetromino with respect to its center (cell coords)
    this.offsets = {
      0: [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, 1],
      ], // L
      1: [
        [0, -1],
        [0, 0],
        [0, 1],
        [-1, 1],
      ], // J //for
      2: [
        [-1, 0],
        [0, 0],
        [1, 0],
        [2, 0],
      ], // I //forma de I
      3: [
        [-1, -1],
        [0, -1],
        [0, 0],
        [-1, 0],
      ], // O Forma cuadrada
      4: [
        [-1, 0],
        [0, 0],
        [0, -1],
        [1, -1],
      ], // S
      5: [
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1],
      ], // T
      6: [
        [-1, -1],
        [0, -1],
        [0, 0],
        [1, 0],
      ], // Z
      7: [
        [0, -1],
        [0, 0],
        [0, 1],
        [-1, 0],
        [1, 0],
      ], // Plus / Cruz
      8: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
      ], // U
      9: [
        [-1, 0],
        [0, -1],
        [0, 0],
        [1, -1],
        [1, 0],
      ], // F
      10: [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
      ], // W
    };
  }

  // Dibuja el bloque mediante Graphics de Phaser (sin sprites), con un pequeño margen
  // respecto a la rejilla.
  renderBlock(color) {
    let g = game.add.graphics(0, 0);
    g.beginFill(color, 1);
    // tiny inset with regard to the grid
    let m = 1;
    g.drawRect(m, m, BLOCKSIZE - 2 * m, BLOCKSIZE - 2 * m);
    g.endFill();
    return g;
  }

  create(c_x, c_y) {
    this.center = [c_x, c_y];

    let conflict = false;
    let blockCount = this.offsets[this.shape].length;
    for (let i = 0; i < blockCount; i++) {
      let x = c_x + this.offsets[this.shape][i][0];
      let y = c_y + this.offsets[this.shape][i][1];
      let color = this.color;
      let b = this.renderBlock(color);
      b.x = x * BLOCKSIZE;
      b.y = y * BLOCKSIZE;

      this.blocks.push(b);
      this.cells.push([x, y]);

      if (!this.tetris.validateCoordinates(x, y)) {
        conflict = true;
      } else {
        this.tetris.scene[x][y] = FALLING;
      }
    }
    return conflict;
  }
  createPreview(c_x, c_y) {
    this.center = [c_x, c_y];
    let blockCount = this.offsets[this.shape].length;
    for (let i = 0; i < blockCount; i++) {
      let x_preview = c_x + this.offsets[this.shape][i][0];
      let y_preview = c_y + this.offsets[this.shape][i][1];
      let color = color_tetromino[this.shape];

      let b_preview = this.renderBlock(color);
      b_preview.x = x_preview * BLOCKSIZE; // Posición correcta
      b_preview.y = y_preview * BLOCKSIZE;
    }
  }

  // Verifica si la pieza puede moverse/rotar sin salirse del tablero ni chocar con bloques ocupados.
  canMove(coordFn, dir) {
    if (gameOverState) return false;
    for (let i = 0; i < this.cells.length; i++) {
      let nc = coordFn(i, dir);
      if (!this.tetris.validateCoordinates(nc[0], nc[1])) return false;
    }
    return true;
  }

  //Checks Movement for rotation
  canMoveRotate(coordFn) {
    if (gameOverState) return false;
    for (let i = 0; i < this.cells.length; i++) {
      let nc = coordFn(i, "clockwise");
      if (!this.tetris.validateCoordinatesRotate(nc[0], nc[1])) return false;
    }
    return true;
  }

  // Calcula la nueva coordenada de un bloque de la pieza al moverla en una dirección.
  slide(block, dir) {
    return [
      this.cells[block][0] + move_offsets[dir][0],
      this.cells[block][1] + move_offsets[dir][1],
    ];
  }

  // Calcula la nueva coordenada de un bloque tras rotar alrededor del centro (rotación clásica).
  rotate(block, dir) {
    // classic rotation around center
    let c_x = this.center[0];
    let c_y = this.center[1];

    let ox = this.cells[block][0] - c_x;
    let oy = this.cells[block][1] - c_y;

    // adjust for screen coords
    oy = -oy;

    let nx = dir === "clockwise" ? oy : -oy;
    let ny = dir === "clockwise" ? -ox : ox;

    ny = -ny;

    return [c_x + nx, c_y + ny];
  }

  // Aplica el movimiento/rotación: actualiza celdas, posiciones gráficas y el estado del tablero.
  move(coordFn, centerFn, dir) {
    for (let i = 0; i < this.cells.length; i++) {
      let ox = this.cells[i][0];
      let oy = this.cells[i][1];
      let nc = coordFn(i, dir);
      let nx = nc[0];
      let ny = nc[1];

      this.cells[i][0] = nx;
      this.cells[i][1] = ny;
      this.blocks[i].x = nx * BLOCKSIZE;
      this.blocks[i].y = ny * BLOCKSIZE;

      this.tetris.scene[ox][oy] = EMPTY;
      this.tetris.scene[nx][ny] = FALLING;
    }
    if (centerFn) {
      let nc = centerFn(dir);
      this.center = [nc[0], nc[1]];
    }
  }

  //Special one for rotations
  moveRotate(coordFn, centerFn) {
    let dif = undefined;
    for (let i = 0; i < this.cells.length; i++) {
      let ox = this.cells[i][0];
      let oy = this.cells[i][1];
      let nc = coordFn(i, "clockwise");
      let nx = nc[0];
      let ny = nc[1];

      if (nx < 0) {
        if (dif) dif = Math.max(dif, 0 - nx);
        else dif = 0 - nx;
      } else if (nx >= numblocks_x) {
        if (dif) dif = Math.min(dif, numblocks_x - 1 - nx);
        else dif = numblocks_x - 1 - nx;
      }

      this.cells[i][0] = nx;
      this.cells[i][1] = ny;
      this.blocks[i].x = nx * BLOCKSIZE;
      this.blocks[i].y = ny * BLOCKSIZE;

      this.tetris.scene[ox][oy] = EMPTY;
      if (nx < 0) {
        this.tetris.scene[nx + dif][ny] = FALLING;
      } else if (nx >= numblocks_x) {
        // console.log(nx);
        // console.log(dif);
        this.tetris.scene[nx + dif][ny] = FALLING;
      } else {
        this.tetris.scene[nx][ny] = FALLING;
      }
    }
    if (dif)
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i][0] += dif;
        this.blocks[i].x = this.cells[i][0] * BLOCKSIZE;
      }
    if (centerFn) {
      let nc = centerFn("clockwise");
      this.center = [nc[0], nc[1]];
    }
  }

  // Calcula la nueva coordenada del centro de rotación al mover la pieza en una dirección.
  slideCenter(dir) {
    return [
      this.center[0] + move_offsets[dir][0],
      this.center[1] + move_offsets[dir][1],
    ];
  }
}

class ghostTetromino {
  //clase del ghost tetromino
  constructor(tetris) {
    this.tetris = tetris;
    this.blocks = [];
    this.cells = [];
    this.shape = null;
  }

  renderGhostBlock() {
    // dibuja el bloque ghost
    let g = game.add.graphics(0, 0);
    g.beginFill(0xffffff, 0.25); // para que aparezca transparente
    let m = 2; // Margen ligeramente mayor para que parezca más pequeña
    g.drawRect(m, m, BLOCKSIZE - 2 * m, BLOCKSIZE - 2 * m);
    g.endFill();
    return g;
  }

  destroyGraphics() {
    //borrar la silueta del anterior
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i]) {
        this.blocks[i].destroy();
      }
    }
    this.blocks = [];
  }

  updatePosition(currentTetromino) {
    //reposiciona la pieza ghost
    this.destroyGraphics();

    this.shape = currentTetromino.shape;
    this.cells = [];

    for (let i = 0; i < currentTetromino.cells.length; i++) {
      //copia las coordenadas actuales de la pieza real
      this.cells.push([
        currentTetromino.cells[i][0],
        currentTetromino.cells[i][1],
      ]);
    }

    let canDrop = true; //simula la caida de la pieza
    while (canDrop) {
      for (let i = 0; i < this.cells.length; i++) {
        let nextY = this.cells[i][1] + 1;
        // Si sale del tablero o toca una pieza ocupada...
        if (
          nextY >= NUMBLOCKS_Y ||
          this.tetris.scene[this.cells[i][0]][nextY] === OCCUPIED
        ) {
          canDrop = false;
          break;
        }
      }
      if (canDrop) {
        for (let i = 0; i < this.cells.length; i++) {
          this.cells[i][1]++;
        }
      }
    }

    for (let i = 0; i < this.cells.length; i++) {
      // se dibuja la pieza ghost
      let x = this.cells[i][0];
      let y = this.cells[i][1];
      let b = this.renderGhostBlock();
      b.x = x * BLOCKSIZE;
      b.y = y * BLOCKSIZE;
      this.blocks.push(b);
    }
  }
}

let gameState = {
  preload: loadGame,
  create: resetGame,
  update: updateGame,
};

function loadGame() {
  game.load.audio("GameOver", "assets/sounds/game_gameover.wav");
  game.load.audio("Theme", "assets/sounds/Defense Battle.mp3");
  game.load.audio("Done_Line", "assets/sounds/Done_Line.mp3");
  game.load.audio("Full_Tetris", "assets/sounds/Full_Tetris.mp3");
  game.load.audio("Piece_Fall", "assets/sounds/Piece_Falling.mp3");
  game.load.audio("Triple", "assets/sounds/se_game_triple.wav");
  loadLevel(levelToPlay);
}

function CreateSounds() {
  soundGameOver = game.add.audio("GameOver");
  soundTheme = game.add.audio("Theme");
  singleLine = game.add.audio("Done_Line");
  fulltetris = game.add.audio("Full_Tetris");
  triple = game.add.audio("Triple");
  p_fall = game.add.audio("Piece_Fall");
}

let soundGameOver, soundTheme, singleLine, fulltetris, triple, p_fall;
let bg;
let gameWidthExtra = BLOCKSIZE * 5; //Dibujar aquí elementos extra
let gameWidth = numblocks_x * BLOCKSIZE;
let gameHeight = NUMBLOCKS_Y * BLOCKSIZE;

let y_start = {
  0: 1,
  1: 1,
  2: 0,
  3: 1,
  4: 1,
  5: 0,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
};

let move_offsets = {
  left: [-1, 0],
  down: [0, 1],
  right: [1, 0],
};

// Dibuja el fondo de la zona de previsualización en negro
function unrenderBlockPreview() {
  // 1. Situamos el contenedor justo donde termina el área de juego
  let f = game.add.graphics(gameWidth, 0);

  // 2. Definimos el color negro
  f.beginFill(COLOR_GRIS, 1);

  // 3. Dibujamos desde el (0,0) LOCAL del objeto Graphics.
  // El ancho debe ser solamente el extra, no la suma.
  f.drawRect(0, 0, gameWidthExtra, gameHeight);

  f.endFill();
  return f;
}

// Elements for the game

let tetromino, theTetris, ghost;
let cursors, keyRotate, keyRestart, keyMenu;
let gameOverState = false;
let nextForma = null;
let timer, loop;
let isPaused = false;
let isMuted = false;
let currentMovementTimer = 0;
let timerLevel = 0;
let shade, centerText;
let points = 0,
  lines_done = 0,
  combo = 0;
const display_combo = document.getElementById("combo");
const display_points = document.getElementById("puntos");
const display_lines = document.getElementById("lines");
const display_timerLevel = document.getElementById("timerLevel");
const Player_name = document.getElementById("player");

Player_name.addEventListener("click", function () {
  let newName = prompt("Give new name: ", Player_name.textContent);
  if (newName !== null && newName.trim() !== "") {
    Player_name.textContent = newName;
  }
});
function loadLevel(level) {
  game.load.text("level", levelsData[level - 1], true);
}
function prepareLevelToPlay() {
  let nivelTexto = game.cache.getText("level");

  if (nivelTexto) {
    try {
      levelConfig = JSON.parse(nivelTexto);

      //n_block_types controla el limite superior del número aleatorio que se genera para elegir la forma de la pieza,
      // así que lo ajustamos al número de formas definidas en el nivel, para permitir niveles con menos o más formas segun queramos.
      //Dichas formas han de estar predefinidas en el constructor de Tetromino.
      n_block_types = levelConfig.NumeroTetrominos;
      fall_delay = levelConfig.timerFall;
      puntosNecesarios = levelConfig.puntosNecesarios;
      numblocks_x = levelConfig.bloquesAnchoJugable;
      gameWidth = numblocks_x * BLOCKSIZE;
      game.scale.setGameSize(gameWidth + gameWidthExtra, gameHeight);

      for (let id in levelConfig.coloresPiezas) {
        color_tetromino[parseInt(id)] = parseInt(levelConfig.coloresPiezas[id]);
      }
      console.log("Configuración del nivel cargada correctamente desde texto.");
    } catch (error) {
      console.error("Error al parsear el JSON del nivel:", error);
    }
  } else {
    console.error("No se encontró contenido en el caché para 'level'.");
  }
}
// Reinicia estado, tablero, HUD, input, temporizador y puntos para empezar una partida limpia.
function resetGame() {
  for (const h of HUD) {
    h.style.display = "block";
  }
  for (const c of CONTROLES) {
    c.style.display = "flex";
  }
  //Create the sounds themselves.
  CreateSounds();
  soundTheme.loop = true;
  soundTheme.play();
  soundTheme.volume = 0.3;
  // clear all blocks
  game.world.removeAll();

  // initialisation
  gameOverState = false;
  currentMovementTimer = 0;
  points = 0;
  lines_done = 0;
  combo = 0;
  timerLevel = 0;
  prepareLevelToPlay(); //Carga el nivel a jugar, dependiendo de lo que se haya seleccionado en el menu.
  display_points.textContent = points.toString();
  display_lines.textContent = lines_done.toString();
  display_combo.textContent = combo.toString();
  display_timerLevel.textContent = timerLevel.toString();
  nextForma = null;
  // Create Trellis and initialisation of its grid
  theTetris = new Tetris();
  theTetris.initGrid();

  // subtle grid background
  bg = game.add.graphics(0, 0);
  bg.beginFill(0x0e0e0e, 1);
  bg.drawRect(0, 0, gameWidth, gameHeight); // Draws the main game area background
  bg.endFill();
  bg.lineStyle(1, 0x1b1b1b, 1);
  for (let x = 0; x < numblocks_x; x++) {
    bg.moveTo(x * BLOCKSIZE, 0);
    bg.lineTo(x * BLOCKSIZE, gameHeight);
  }
  for (let y = 0; y < NUMBLOCKS_Y; y++) {
    bg.moveTo(0, y * BLOCKSIZE);
    bg.lineTo(gameWidth, y * BLOCKSIZE);
  } //Que hace este bucle?

  // input
  cursors = game.input.keyboard.createCursorKeys();
  keyRotate = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  keyRestart = game.input.keyboard.addKey(Phaser.Keyboard.R);
  keyMenu = game.input.keyboard.addKey(Phaser.Keyboard.T);
  keyHardDrop = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // timer
  // IMPORTANTE: si venimos de un game over, el Timer andará pausado.
  // Hay que reanudarlo explícitamente, o la caída se queda a 0 (no cae nunca).
  timer = game.time.events;
  timer.removeAll();
  timer.resume();
  loop = timer.loop(fall_delay, fall, this);
  ghost = new ghostTetromino(theTetris);
  spawn();
}

// Tick de caída automática: intenta bajar la pieza, o la fija si ya no puede.
function fall() {
  if (gameOverState) return;
  if (tetromino.canMove(tetromino.slide.bind(tetromino), "down")) {
    tetromino.move(
      tetromino.slide.bind(tetromino),
      tetromino.slideCenter.bind(tetromino),
      "down",
    );
  } else lockTetromino();
}

// Crea una nueva pieza en la parte superior; si colisiona al aparecer, termina la partida.
function spawn() {
  if (nextForma === null) {
    nextForma = Math.floor(Math.random() * n_block_types);
  }

  let shape = nextForma;
  let color = color_tetromino[nextForma];
  tetromino = new Tetromino(shape, color, theTetris);

  let start_x = Math.floor(numblocks_x / 2);
  let start_y = y_start[tetromino.shape];
  nextForma = Math.floor(Math.random() * n_block_types);

  // Destroy previous preview blocks
  unrenderBlockPreview();

  // Position preview in the extra area (gameWidth + offset for centering)
  let preview_x = numblocks_x + 2;
  let previweTetromino = new Tetromino(nextForma, color, theTetris);
  previweTetromino.createPreview(preview_x, 2);
  let conflict = tetromino.create(start_x, start_y);

  if (conflict) setGameOver(true);
  else if (ghost) ghost.updatePosition(tetromino);
}

function manageRanking() {
  let datosCargados = localStorage.getItem(`ranking_nivel_${levelToPlay}`);
  let lista;
  if (datosCargados !== null) {
    lista = JSON.parse(datosCargados);
    console.log("Cargando datos desde LocalStorage");
  } else {
    lista = [];
    console.log("No hay datos previos, creando lista nueva");
  }

  let nuevaEntrada = {
    nombre: Player_name.textContent,
    puntos: parseInt(display_points.textContent) || 0,
    nivel: levelToPlay,
    tiempo: Math.round(timerLevel), // Tiempo en segundos
  };

  lista.push(nuevaEntrada);
  lista.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }
    return a.tiempo - b.tiempo;
  });
  if (lista.length > 10) {
    lista.splice(10);
  }
  localStorage.setItem(`ranking_nivel_${levelToPlay}`, JSON.stringify(lista));
  console.log(`Guardado en ranking_nivel_${levelToPlay}`);
}

// Activa el estado de fin de partida y muestra un mensaje de reinicio.
function setGameOver(on) {
  gameOverState = on;
  if (gameOverState) {
    //console.log(timer);
    manageRanking();
    timer.pause();
    makeShade(0.65);
    if (puntosNecesarios <= points) {
      soundGameOver.play();
      soundGameOver.volume = 0.4;
      display_points.textContent = points.toString();

      centerText = game.add.text(
        game.world.centerX,
        game.world.centerY,
        "LEVEL COMPLETE!\nPress R to restart\nPress T to return\nto the Menu\n\nTotal Points: " +
          points.toString() +
          "\nLines Destroyed: " +
          lines_done.toString() +
          "\nPlayer: " +
          Player_name.textContent,
        {
          font: "bold 32px system-ui, -apple-system, Segoe UI, Roboto, Arial",
          fill: "#ffffff",
          align: "center",
        },
      );
    } else {
      display_points.textContent = points.toString();
      soundGameOver.play();
      soundGameOver.volume = 0.4;
      centerText = game.add.text(
        game.world.centerX,
        game.world.centerY,
        "GAME OVER\nPress R to restart\nPress T to return\nto the Menu\n\nTotal Points: " +
          points.toString() +
          "\nLines Destroyed: " +
          lines_done.toString() +
          "\nPlayer: " +
          Player_name.textContent,
        {
          font: "bold 32px system-ui, -apple-system, Segoe UI, Roboto, Arial",
          fill: "#ffffff",
          align: "center",
        },
      );
    }
    centerText.anchor.set(0.5);
    soundTheme.stop();
    soundTheme.loop = false;
    // soundGameOver.play();
    // soundGameOver.volume = 0.4;
  }
}

// Dibuja un velo oscuro encima del tablero para estados como 'game over'.
function makeShade(alpha) {
  shade = game.add.graphics(0, 0);
  shade.beginFill(0x000000, alpha);
  shade.drawRect(0, 0, gameWidth, gameHeight);
  shade.endFill();
}

// Bucle de actualización para leer input y mover la pieza
function updateGame() {
  if (points >= puntosNecesarios) {
    PartidaGanada();
  }
  if (isPaused) return;
  currentMovementTimer += this.time.elapsed;
  if (currentMovementTimer <= MOVEMENT_LAG) return;

  if (gameOverState) {
    if (keyRestart.isDown) resetGame();
    if (keyMenu.isDown) returnMenu();
    currentMovementTimer = 0;
    return;
  }
  if (!gameOverState && !isPaused) {
    timerLevel += game.time.elapsed / 148;
  }
  display_timerLevel.textContent = Math.round(timerLevel);

  let moved = false;
  if (
    cursors.left.isDown &&
    tetromino.canMove(tetromino.slide.bind(tetromino), "left")
  ) {
    tetromino.move(
      tetromino.slide.bind(tetromino),
      tetromino.slideCenter.bind(tetromino),
      "left",
    );
    moved = true;
  } else if (
    cursors.right.isDown &&
    tetromino.canMove(tetromino.slide.bind(tetromino), "right")
  ) {
    tetromino.move(
      tetromino.slide.bind(tetromino),
      tetromino.slideCenter.bind(tetromino),
      "right",
    );
    moved = true;
  } else if (
    cursors.down.isDown &&
    tetromino.canMove(tetromino.slide.bind(tetromino), "down")
  ) {
    tetromino.move(
      tetromino.slide.bind(tetromino),
      tetromino.slideCenter.bind(tetromino),
      "down",
    );
    moved = true;
  } else if (keyRotate.isDown) {
    // O piece rotation is pointless, but harmless
    if (tetromino.canMoveRotate(tetromino.rotate.bind(tetromino))) {
      tetromino.moveRotate(tetromino.rotate.bind(tetromino), null, "clockwise");
      moved = true;
    }
  } else if (keyHardDrop.isDown) {
    caidaTotal();
    moved = true;
  }

  if (moved && ghost) {
    ghost.updatePosition(tetromino);
  }

  currentMovementTimer = 0;
}

// Fija la pieza actual en el tablero, comprueba líneas completas y genera la siguiente.
function lockTetromino() {
  let touchedLines = [];
  for (let i = 0; i < tetromino.cells.length; i++) {
    let x = tetromino.cells[i][0];
    let y = tetromino.cells[i][1];

    theTetris.scene[x][y] = OCCUPIED;
    theTetris.sceneBlocks[x][y] = tetromino.blocks[i];

    if (touchedLines.indexOf(y) == -1) touchedLines.push(y);
  }
  const destroyed = checkLines(touchedLines);
  if (!destroyed) {
    p_fall.play();
    combo = 0;
    display_combo.textContent = combo.toString();
  }
  spawn();
}

// Revisa las filas tocadas por la pieza recién fijada y aplica limpieza/colapso/puntuación.
function checkLines(candidateLines) {
  let collapsed = [];
  for (let i = 0; i < candidateLines.length; i++) {
    let y = candidateLines[i];
    if (lineSum(y) == numblocks_x * OCCUPIED) {
      collapsed.push(y);
      cleanLine(y);
    }
  }
  if (collapsed.length) {
    animacionTablero(collapsed.length);
    collapse(collapsed);
    lines_done += collapsed.length;
    points += 10 * collapsed.length;
    if (collapsed.length == 1 || collapsed.length == 2) {
      singleLine.play();
      if (collapsed.length == 2) {
        points += 5;
        combo += 2;
      } else if (collapsed.length == 1 && combo != 0) {
        combo += 1;
      }
    } else if (collapsed.length == 4) {
      fulltetris.play();
      fulltetris.volume = 0.7;
      points += 25;
      combo += 4;
    } else if (collapsed.length == 3) {
      triple.play();
      triple.volume = 0.8;
      points += 15;
      combo += 3;
    }
  }
  if (combo != 0) {
    points += combo * 10;
  }
  display_lines.textContent = lines_done.toString();
  display_points.textContent = points.toString();
  display_combo.textContent = combo.toString();
  return collapsed.length > 0;
}

// Suma el estado de una fila para detectar si está completamente ocupada.
function lineSum(y) {
  let s = 0;
  for (let x = 0; x < numblocks_x; x++) s += theTetris.scene[x][y];
  return s;
}

// Borra una fila: destruye los Graphics de esa fila y marca las celdas como vacías.
function cleanLine(y) {
  for (let x = 0; x < numblocks_x; x++) {
    if (theTetris.sceneBlocks[x][y]) {
      theTetris.sceneBlocks[x][y].destroy();
      theTetris.sceneBlocks[x][y] = null;
    }
    theTetris.scene[x][y] = EMPTY;
  }
}

// Colapsa filas: baja todo lo que queda por encima de las líneas eliminadas.
function collapse(linesToCollapse) {
  // sort ascending so we collapse from bottom up
  linesToCollapse.sort(function (a, b) {
    return a - b;
  });
  for (let idx = 0; idx < linesToCollapse.length; idx++) {
    let y = linesToCollapse[idx];
    for (let yy = y; yy > 0; yy--) {
      for (let x = 0; x < numblocks_x; x++) {
        // shift occupancy
        theTetris.scene[x][yy] = theTetris.scene[x][yy - 1];
        theTetris.sceneBlocks[x][yy] = theTetris.sceneBlocks[x][yy - 1];
        if (theTetris.sceneBlocks[x][yy])
          theTetris.sceneBlocks[x][yy].y = yy * BLOCKSIZE;
      }
    }
    // clear top line
    for (let x2 = 0; x2 < numblocks_x; x2++) {
      theTetris.scene[x2][0] = EMPTY;
      theTetris.sceneBlocks[x2][0] = null;
    }
  }
}

function pausar() {
  if (gameOverState) return;
  if (!isPaused) {
    isPaused = true;
    timer.pause();
  } else {
    isPaused = false;
    timer.resume();
  }
}

function mutear() {
  if (!isMuted) {
    isMuted = true;
    game.sound.mute = true;
  } else {
    isMuted = false;
    game.sound.mute = false;
  }
}

window.onload = function () {
  const btnPausa = document.getElementById("btn_pausa");
  const btnMute = document.getElementById("btn-mute-html");
  if (btnPausa) {
    btnPausa.onclick = function () {
      pausar(); // Esta es la función que  detiene el timer y el update

      // Actualizamos el texto del botón según el estado
      if (isPaused) {
        this.innerText = "CONTINUE";
        this.style.backgroundColor = "#0d79ed";
      } else {
        this.innerText = "PAUSE";
        this.style.backgroundColor = "#f7eeee";
      }
    };
  }
  if (btnMute) {
    btnMute.onclick = function () {
      mutear();

      if (isMuted) {
        this.innerText = "MUSIC: OFF";
        this.style.backgroundColor = "#ff4444";
      } else {
        this.innerText = "MUSIC: ON";
        this.style.backgroundColor = "#f7eeee";
      }
    };
  }
};
function returnMenu() {
  for (const h of HUD) {
    h.style.display = "none";
  }
  for (const c of CONTROLES) {
    c.style.display = "none";
  }
  game.scale.setGameSize(window.innerWidth * 0.85, window.innerHeight * 0.85);
  game.state.start("Menu");
}

function animacionTablero(candidateLines) {
  let intensidad = 0;
  let duracion = 0;
  if (candidateLines == 1) {
    intensidad = 0.05;
    duracion = 100; //0.1 segundos
  } else if (candidateLines == 2) {
    intensidad = 0.1;
    duracion = 200;
  } else if (candidateLines >= 3) {
    intensidad = 0.12;
    duracion = 300;
  }
  game.camera.shake(intensidad, duracion);
}

function caidaTotal() {
  if (gameOverState || isPaused) return;
  let droppedLines = 0;

  while (tetromino.canMove(tetromino.slide.bind(tetromino), "down")) {
    tetromino.move(
      tetromino.slide.bind(tetromino),
      tetromino.slideCenter.bind(tetromino),
      "down",
    );
    droppedLines++;
  }
  lockTetromino();
}

function PartidaGanada() {
  if (!gameOverState) {
    setGameOver(true);
  }
}
