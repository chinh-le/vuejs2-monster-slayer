new Vue({
    el: "#app", // connect to DOM
    // KIM: all usages of data property and methods in templates get re-rendered/executed at every data property changes       
    data: { // store data to be used
        playerHealth: 100,
        monsterHealth: 100,
        isGameStarted: false,
        attackDamage: {
            player: {
                min: 5,
                max: 12
            },
            monster: {
                min: 3,
                max: 10
            },
            special: {
                min: 10,
                max: 20
            }
        },
        healDamage: 10,
        turns: []
    },
    // KIM: computed (cached), if being used in templates, gets executed ONLY if dependent data property changes
    computed: {}, // dependent properties - synchronous tasks
    // KIM: watch gets executed at every data property changes - use as scarcely as possible (performance perspective)
    watch: { // execute upon data changes - asynchronous tasks
        // watchers are to be used as scarcely as possible - performance perspective
        /* playerHealth: function (attackDamage) {
            if (attackDamage <= 0) {
                this.endGame('player');
            }
        },
        monsterHealth: function (attackDamage) {
            if (attackDamage <= 0) {
                this.endGame('monster');
            }
        } */
    },
    methods: { // methods of this Vue Instance
        startNewGame: function () {
            this.isGameStarted = true;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.turns = [];
        },
        attack: function () {
            var damage = this.calculateDamage(this.attackDamage.monster.min, this.attackDamage.monster.max);
            this.monsterHealth -= damage;
            this.logTurn(true, damage);
            if (this.isGameEnded(this.monsterHealth)) {
                this.endGame('monster');
                return; // to not continue with playerHealth calculation if game is ended
            }

            damage = this.calculateDamage(this.attackDamage.player.min, this.attackDamage.player.max);
            this.playerHealth -= damage;
            this.logTurn(false, damage);
            if (this.isGameEnded(this.playerHealth)) {
                this.endGame('player');
            }
        },
        specialAttack: function () {
            var damage = this.calculateDamage(this.attackDamage.special.min, this.attackDamage.special.max);
            this.monsterHealth -= damage;
            this.logTurn(true, damage, true);
            if (this.isGameEnded(this.monsterHealth)) {
                this.endGame('monster');
                return; // to not continue with playerHealth calculation if game is ended
            }

            damage = this.calculateDamage(this.attackDamage.player.min, this.attackDamage.player.max);
            this.playerHealth -= damage;
            this.logTurn(false, damage, true);
            if (this.isGameEnded(this.playerHealth)) {
                this.endGame('player');
            }
        },
        heal: function () {
            var damage = this.calculateDamage(this.attackDamage.player.min, this.attackDamage.player.max);

            if (this.playerHealth <= 90) {
                this.playerHealth += this.healDamage;
            }

            this.playerHealth -= damage;
            this.logTurn(false, damage);
            if (this.isGameEnded(this.playerHealth)) {
                this.endGame('player');
            }
        },
        giveUp: function () {
            this.isGameStarted = false;
        },
        calculateDamage: function (min, max) {
            // Math.random(): 0...1 (1 exclusive)
            // Math.floor(): largest integer less or equal to given number
            // Math.max(): largest of 0 or more numbers
            return Math.max(Math.floor(Math.random() * max), min);
        },
        isGameEnded: function (damage) {
            if (damage <= 0) {
                return true;
            }

            return false;
        },
        endGame: function (type) {
            var msg = type === 'player' ? 'You lost!' : 'You won!';
            if (confirm(msg + ' New game?')) {
                this.startNewGame();
            } else {
                this.isGameStarted = false;
            }
        },
        logTurn: function (isPlayer, damage, isHardAttack) {
            var hardAttackText = isHardAttack ? 'hard ' : '';
            var logText = isPlayer ? 'Player hits Monster ' + hardAttackText + 'for ' : 'Monster hits Player ' + hardAttackText + 'for ';
            this.turns.unshift({
                isPlayer: isPlayer,
                text: logText + damage
            });
        }
    }
});