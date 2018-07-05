var GameState = (text) => {return {
    text, 
    position: 0,
    currentWord: true,
    correct: true,
    lastInput: '',
    green: {a:0, b:0},
    greenLine: {a:0, b:0},
    redLine: {a:0, b:0},
    red: {a:0, b:0},
    line: {a:0, b:text.indexOf(' ', 0)},
    rest: {a:text.indexOf(' ', 0), b:text.length},
    step (c) {
        var gameState = this.copy();
        var correctNewChar = gameState.correct && gameState.text[gameState.position] == c;
        var correctNewWord = c == ' ' && correctNewChar;

        // Green
        if(correctNewWord){
            gameState.green.b = gameState.position + 1;
        }

        // Green line
        if(correctNewWord){
            gameState.greenLine.a = gameState.position + 1;
            gameState.greenLine.b = gameState.position + 1;
        }else if(correctNewChar){
            gameState.greenLine.b = gameState.position + 1;
        }

        // Red Line
        if(!correctNewChar && gameState.text[gameState.position] != ' ' && gameState.currentWord) {
            if(!gameState.correct){
                gameState.redLine.b++;
            }else{
                gameState.redLine.a = gameState.position;
                gameState.redLine.b = gameState.position + 1;
            }
        }

        // Line
        if(gameState.currentWord){
            if(gameState.text[gameState.position] != ' '){
                gameState.line.a++;
            }else if(correctNewChar){
                gameState.line.a = gameState.position + 1;
                gameState.line.b = gameState.text.indexOf(' ', gameState.line.a);
                if(gameState.line.b == -1){
                    gameState.line.b = gameState.text.length;
                }
            }
        }

        // Red
        if (!correctNewChar) {
            if (gameState.text[gameState.position] == ' ' && gameState.currentWord){
                gameState.red.a = gameState.position;
                gameState.red.b = gameState.position + 1;
            }
            if(!gameState.currentWord)
                gameState.red.b = gameState.position + 1;
        }
        
        // Rest
        gameState.rest.a = gameState.text.indexOf(' ', gameState.position + 1);
        if(gameState.rest.a == -1){
            gameState.rest.a = gameState.text.length;
        }
        if(!correctNewChar && (gameState.text[gameState.position] == ' ' || !gameState.currentWord))
            gameState.rest.a = gameState.position + 1;

        gameState.currentWord = !(!gameState.currentWord || !correctNewChar && gameState.text[gameState.position] == ' ');
        gameState.correct = correctNewChar;
        gameState.position++;
        return gameState;
    },
    getPart (place) {
        return this.text.substring(this[place].a, this[place].b);
    },
    raceText () {
        return `
            <span class="race-text-correct">${this.getPart('green')}</span><!--
         --><span class="race-text-correct race-text-current">${this.getPart('greenLine')}</span><!--
         --><span class="race-text-incorrect race-text-current">${this.getPart('redLine')}</span><!--
         --><span class="race-text-incorrect">${this.getPart('red')}</span><!--
         --><span class="race-text-cursor"></span><!--
         --><span class="race-text-current">${this.getPart('line')}</span><!--
         --><span class="race-text-rest">${this.getPart('rest')}</span>
        `;
    },
    copy () {
        return {
            text: this.text,
            position: this.position,
            currentWord: this.currentWord,
            correct: this.correct,
            lastInput: this.lastInput,
            green: {a:this.green.a, b:this.green.b},
            greenLine: {a:this.greenLine.a, b:this.greenLine.b},
            redLine: {a:this.redLine.a, b:this.redLine.b},
            line: {a:this.line.a, b:this.line.b},
            red: {a:this.red.a, b:this.red.b},
            rest: {a:this.rest.a, b:this.rest.b},
            step: this.step,
            getPart: this.getPart,
            raceText: this.raceText,
            copy: this.copy
        }
    }
}}