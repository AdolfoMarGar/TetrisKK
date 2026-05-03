const ANCHO_MENU = window.innerWidth * 0.85;
const ALTO_MENU = window.innerHeight * 0.85;
const COLUMNA_1 = ANCHO_MENU * 0.35;
const COLUMNA_2 = ANCHO_MENU * 0.65;
const ALTURA_1 = ALTO_MENU * 0.5;
const ALTURA_2 = ALTO_MENU * 0.7;
const IMG = 300;
let levelToPlay = 1;

let menuState = {
  preload: function () {
    game.load.image("fondo", "assets/fondo.jpg");
    game.load.image("fondoC", "assets/fondoC.jpg");
    game.load.image("fondoN", "assets/fondoN.jpg");
    game.load.image("fondoR", "assets/fondoR.jpg");
    game.load.image("play", "assets/play.png");
    game.load.image("cred", "assets/cred.png");
    game.load.image("rank", "assets/rank.png");
    game.load.image("nivel", "assets/nivel.png");
    game.load.image("nom", "assets/nom.png");
    game.load.image("volver", "assets/volver1.png");
    game.load.image("num1", "assets/num1.png");
    game.load.image("num2", "assets/num2.png");
  },
  create: function () {
    // game.scale.setGameSize(window.innerWidth, window.innerHeight);
    let fondo = game.add.sprite(0, 0, "fondo");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;
    // fondo.scale.setTo()
    let botonplay = game.add.button(
      COLUMNA_1,
      ALTURA_1,
      "play",
      this.iniciarJuego,
      this,
    );
    botonplay.anchor.setTo(0.5, 0.5);
    let botonniv = game.add.button(
      COLUMNA_2,
      ALTURA_1,
      "nivel",
      this.verNiveles,
      this,
    );
    botonniv.anchor.setTo(0.5, 0.5);
    let botoncred = game.add.button(
      COLUMNA_1,
      ALTURA_2,
      "cred",
      this.verCreditos,
      this,
    );
    botoncred.anchor.setTo(0.5, 0.5);

    let botonrank = game.add.button(
      COLUMNA_2,
      ALTURA_2,
      "rank",
      this.verRanking,
      this,
    );
    botonrank.anchor.setTo(0.5, 0.5);

    let botonnom = game.add.button(COLUMNA_2 + 300, ALTURA_2 + 78, "nom");
    botonnom.anchor.setTo(0.5, 0.5);
  },
  iniciarJuego: function () {
    // game.scale.setGameSize(gameWidth + gameWidthExtra, gameHeight);
    game.state.start("Game");
  },
  verCreditos: function () {
    game.state.start("Creditos");
  },
  verNiveles: function () {
    game.state.start("Niveles");
  },
  verRanking: function () {
    game.state.start("Ranking");
  },
};
let creditosState = {
  preload: function () {
    game.load.image("I", "assets/I.png");
    game.load.image("V", "assets/V.png");
    game.load.image("A", "assets/A.png");
  },
  create: function () {
    //game.scale.setGameSize(window.innerWidth, window.innerHeight);
    let fondo = game.add.sprite(0, 0, "fondoC");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;
    let img1 = game.add.image(COLUMNA_1 - 150, ALTURA_1 + 30, "I");
    this.configurarImagen(img1);
    let img2 = game.add.image(COLUMNA_1 + 130, ALTURA_1 + 30, "V");
    this.configurarImagen(img2);
    let img3 = game.add.image(COLUMNA_1 + 400, ALTURA_1 + 30, "A");
    this.configurarImagen(img3);

    let botonVolver = game.add.button(
      game.world.width * 0.5,
      game.world.height * 0.9,
      "volver",
      this.volverMenu,
      this,
    );
    botonVolver.anchor.setTo(0.5, 0.5);
  },
  volverMenu: function () {
    game.state.start("Menu");
  },
  configurarImagen: function (img) {
    img.width = IMG;
    img.height = IMG;
    img.anchor.setTo(0.5, 0.5);
  },
};
let nivelesState = {
  create: function () {
    let fondo = game.add.sprite(0, 0, "fondoN");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;
    let botonNiv1 = game.add.button(
      COLUMNA_1,
      ALTURA_1,
      "num1",
      this.seleccionarNivel,
      this,
    );
    botonNiv1.numNivel = 1;
    botonNiv1.scale.setTo(0.1, 0.1);
    botonNiv1.anchor.setTo(0.5, 0.5);
    let botonNiv2 = game.add.button(
      COLUMNA_2,
      ALTURA_1,
      "num2",
      this.seleccionarNivel,
      this,
    );
    botonNiv2.numNivel = 2;
    botonNiv2.scale.setTo(0.1, 0.1);
    botonNiv2.anchor.setTo(0.5, 0.5);
    let botonVolver2 = game.add.button(
      game.world.width * 0.5,
      game.world.height * 0.9,
      "volver",
      this.volverMenu,
      this,
    );
    botonVolver2.anchor.setTo(0.5, 0.5);
  },
  seleccionarNivel: function (boton) {
    levelToPlay = boton.numNivel;
    document.getElementById("lvlSelected").textContent = levelToPlay;
  },
  volverMenu: function () {
    game.state.start("Menu");
  },
};
let rankingState = {
  create: function () {
    let datosGuardados = localStorage.getItem("ranking_local");
    let lista;

    if (datosGuardados) {
      lista = JSON.parse(datosGuardados);
      console.log("Cargando datos desde LocalStorage");
    } else {
      lista = game.cache.getJSON("datos_ranking");
      console.log("Cargando datos desde el archivo JSON");
    }

    let fondo = game.add.sprite(0, 0, "fondoR");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;

    if (lista) {
      lista.forEach((entrada, index) => {
        game.add.text(
          100,
          50 + 50 * index,
          `${index + 1}. ${entrada.nombre}: ${entrada.puntos}`,
          {
            fill: "#000000",
            font: "bold 24px Arial",
            align: "center",
          },
        );
      });
    }

    // let estitulo = { font: "100px Arial", fill: "#671bf5", align: "center" };
    // let titulo = game.add.text(
    //   game.world.width * 0.5,
    //   game.world.height * 0.15,
    //   "RANKING",
    //   estitulo,
    // );
    // titulo.anchor.setTo(0.5, 0.5);
    let botonVolver2 = game.add.button(
      game.world.width * 0.5,
      game.world.height * 0.8548387096774194,
      "volver",
      this.volverMenu,
      this,
    );
    botonVolver2.anchor.setTo(0.5, 0.5);
  },
  volverMenu: function () {
    game.state.start("Menu");
  },
};

let game = new Phaser.Game(ANCHO_MENU, ALTO_MENU, Phaser.CANVAS, "game");
game.state.add("Menu", menuState);
game.state.add("Game", gameState);
game.state.add("Creditos", creditosState);
game.state.add("Niveles", nivelesState);
game.state.add("Ranking", rankingState);

game.state.start("Menu");
