const ANCHO_MENU = window.innerWidth * 0.85;
const ALTO_MENU = window.innerHeight * 0.85;
const COLUMNA_1 = ANCHO_MENU * 0.35;
const COLUMNA_2 = ANCHO_MENU * 0.65;
const ALTURA_1 = ALTO_MENU * 0.5;
const ALTURA_2 = ALTO_MENU * 0.7;
const IMG = 300;
let levelToPlay = 1;
let button;
function SoundOK() {
  let SoundOK = game.add.sound("OK");
  SoundOK.volume = 0.2;
  SoundOK.play();
}

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
    game.load.audio("OK", "assets/sounds/se_sys_ok.wav");
    game.load.image("num3", "assets/num3.png");
    game.load.image("num4", "assets/num4.png");

    // this.load.json("datos_ranking", "assets/ranking.json");
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
    SoundOK();
    game.state.start("Creditos");
  },
  verNiveles: function () {
    SoundOK();
    game.state.start("Niveles");
  },
  verRanking: function () {
    SoundOK();
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
    let img2 = game.add.image(COLUMNA_1 + 180, ALTURA_1 + 30, "V");
    this.configurarImagen(img2);
    let img3 = game.add.image(COLUMNA_1 + 480, ALTURA_1 + 30, "A");
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
    SoundOK();
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
      COLUMNA_1 * 0.75,
      ALTURA_1,
      "num1",
      this.seleccionarNivel,
      this,
    );
    botonNiv1.numNivel = 1;
    botonNiv1.scale.setTo(0.5, 0.5);
    botonNiv1.anchor.setTo(0.5);

    let botonNiv2 = game.add.button(
      COLUMNA_1 * 1.2,
      ALTURA_1,
      "num2",
      this.seleccionarNivel,
      this,
    );
    botonNiv2.numNivel = 2;
    botonNiv2.scale.setTo(0.5, 0.5);
    botonNiv2.anchor.setTo(0.5);

    let botonNiv3 = game.add.button(
      COLUMNA_2 * 0.9,
      ALTURA_1,
      "num3",
      this.seleccionarNivel,
      this,
    );
    botonNiv3.numNivel = 3;
    botonNiv3.scale.setTo(0.5, 0.5);
    botonNiv3.anchor.setTo(0.5);

    let botonNiv4 = game.add.button(
      COLUMNA_2 * 1.15,
      ALTURA_1,
      "num4",
      this.seleccionarNivel,
      this,
    );
    botonNiv4.numNivel = 4;
    botonNiv4.scale.setTo(0.5, 0.5);
    botonNiv4.anchor.setTo(0.5);

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
    SoundOK();
    levelToPlay = boton.numNivel;
    document.getElementById("lvlSelected").textContent = levelToPlay;
  },
  volverMenu: function () {
    SoundOK();
    game.state.start("Menu");
  },
};

let rankingState = {
  create: function () {
    let fondo = game.add.sprite(0, 0, "fondoR");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;

    // let ChooseLevel = game.add.text(ANCHO_MENU * 0.5, ALTO_MENU * 0.35, 'Choose the level',{fill: "#000000", font: "bold 24px Arial",align: "center",},);
    // ChooseLevel.anchor.setTo(0.5);

    let Lev1 = game.add.button(
      COLUMNA_1 * 0.75,
      ALTURA_1,
      "num1",
      function () {
        ((button = 1), game.state.start("BP"));
      },
      this,
    );
    Lev1.anchor.setTo(0.5);
    Lev1.scale.set(0.5);

    let Lev2 = game.add.button(
      COLUMNA_1 * 1.2,
      ALTURA_1,
      "num2",
      function () {
        ((button = 2), game.state.start("BP"));
      },
      this,
    );
    Lev2.anchor.setTo(0.5);
    Lev2.scale.set(0.5);

    let Lev3 = game.add.button(
      COLUMNA_2 * 0.9,
      ALTURA_1,
      "num3",
      function () {
        ((button = 3), game.state.start("BP"));
      },
      this,
    );
    Lev3.scale.setTo(0.5, 0.5);
    Lev3.anchor.setTo(0.5);

    let Lev4 = game.add.button(
      COLUMNA_2 * 1.15,
      ALTURA_1,
      "num4",
      function () {
        ((button = 4), game.state.start("BP"));
      },
      this,
    );
    Lev4.scale.setTo(0.5, 0.5);
    Lev4.anchor.setTo(0.5);

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
    SoundOK();
    game.state.start("Menu");
  },
};
let ButtonState = {
  create: function () {
    SoundOK();
    let lista = [];
    let datosGuardados = localStorage.getItem(`ranking_nivel_${button}`);
    if (datosGuardados) {
      lista = JSON.parse(datosGuardados);
      console.log("Cargando datos desde LocalStorage");
    }

    let fondo = game.add.sprite(0, 0, "fondoR");
    fondo.width = ANCHO_MENU;
    fondo.height = ALTO_MENU;

    // let TextButton = game.add.text(
    //   ANCHO_MENU * 0.5,
    //   ALTO_MENU * 0.1,
    //   "Level " + String(button) + " data",
    //   { fill: "#000000", font: "bold 24px Arial", align: "center" },
    // );
    // TextButton.anchor.setTo(0.5);

    if (lista.length > 0) {
      lista.forEach((entrada, index) => {
        game.add.text(
          ANCHO_MENU * 0.3,
          ALTO_MENU * 0.4 + 40 * index,
          `${index + 1}. ${entrada.nombre}: ${entrada.puntos} pts en ${entrada.tiempo}s`,
          { fill: "#000000", font: "20px Arial" },
        );
      });
    } else {
      let noData = game.add.text(
        ANCHO_MENU * 0.5,
        ALTO_MENU * 0.5,
        "No hay datos para este nivel",
        { fill: "#000000", font: "bold 20px Arial", align: "center" },
      );
      noData.anchor.setTo(0.5);
    }

    let botonRanking = game.add.button(
      game.world.width * 0.5,
      game.world.height * 0.9,
      "volver",
      this.volverRanking,
      this,
    );
    botonRanking.anchor.setTo(0.5);
  },
  volverRanking: function () {
    SoundOK();
    game.state.start("Ranking");
  },
};

let game = new Phaser.Game(ANCHO_MENU, ALTO_MENU, Phaser.CANVAS, "game");
game.state.add("Menu", menuState);
game.state.add("Game", gameState);
game.state.add("Creditos", creditosState);
game.state.add("Niveles", nivelesState);
game.state.add("Ranking", rankingState);
game.state.add("BP", ButtonState);

game.state.start("Menu");
