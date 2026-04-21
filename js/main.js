let menuState={
    preload: function(){
        
        game.load.image("fondo","assets/fondo.jpg");
        game.load.image("play1","assets/play1.png");
    },
    create: function(){
        game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = game.width;
        fondo.height = game.height;
        let boton1 = game.add.button(game.world.centerX, game.world.centerY, 'play1', this.iniciarJuego, this);
        boton1.anchor.setTo(0.5,0.5);
        
        let boton2=game.add.button(game.world.centerX, game.world.centerY + 100, 'play1', this.verCreditos, this);
        boton2.anchor.setTo(0.5,0,5);


        
        let estitulo = {font: "100px Arial", fill:"#FF00FF" , align:"center"}
        let titulo= game.add.text(game.world.centerX - 100, 100,"TETRIS",estitulo);
        titulo.anchor.setTo(0.2, 0.5);

    },
    iniciarJuego : function(){
        game.scale.setGameSize(gameWidth, gameHeight);
        game.state.start('Game');
    },
    verCreditos: function(){
        game.state.start('Creditos');
    }
};
let creditosState={
    create : function(){
        game.scale.setGameSize(window.innerWidth, window.innerHeight);
        let fondo = game.add.sprite(0, 0, "fondo");
        fondo.width = game.width;
        fondo.height = game.height;
        let estitulo = {font: "100px Arial", fill:"#1be6f5" , align:"center"}
        let titulo= game.add.text(game.world.centerX - 100, 100,"CREDITOS",estitulo);
        titulo.anchor.setTo(0.2, 0.5);
        let botonVolver = game.add.button(game.world.centerX, game.world.centerY+250, 'play1', this.volverMenu, this);
        botonVolver.anchor.setTo(0.5,0.5);
        let txtCred = game.add.text(game.world.centerX, game.world.centerY, "Nombres: jsjdjwjoew\n jskfwfjs \n dsjdqhdhahdoa", { font: "20px Arial", fill: "#000" });
        txtCred.anchor.setTo(0.5,0.5);
    },
    volverMenu : function(){
        game.state.start('Menu'); 
    }
}

let game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
game.state.add("Menu",menuState);
game.state.add('Game', gameState);
game.state.add("Creditos",creditosState);

game.state.start("Menu");

