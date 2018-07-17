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
    step (newInput) {
        var c = newInput[newInput.length - 1];
        var gameState = this.copy();
        var correctNewChar = true;
        var textIncorrectStart = gameState.green.b;
        var newInputIncorrectStart;
        for(newInputIncorrectStart = 0;
            newInputIncorrectStart < newInput.length;
            newInputIncorrectStart++, textIncorrectStart++){
            if(newInput[newInputIncorrectStart] != gameState.text[textIncorrectStart]){
                correctNewChar = false;
                break;
            }
        }
        var correctNewWord = c == ' ' && correctNewChar;

        // Green Line
        gameState.greenLine.a = gameState.green.b;
        gameState.greenLine.b = textIncorrectStart;

        // Red Line
        gameState.redLine.a = textIncorrectStart;
        var spaceIdx = gameState.text.indexOf(' ', textIncorrectStart);
        gameState.redLine.b = Math.min(
                                spaceIdx == -1 ? gameState.text.length : spaceIdx, 
                                this.green.b + newInput.length
                            );

        // Line
        gameState.line.a = gameState.redLine.b;
        gameState.line.b = gameState.text.indexOf(' ', gameState.line.a);
        if(gameState.line.b == -1){
            gameState.line.b = gameState.text.length;
        }

        // Red
        // if (!correctNewChar) {
        //     if (gameState.text[gameState.position] == ' ' && gameState.currentWord){
        //         gameState.red.a = gameState.position;
        //         gameState.red.b = gameState.position + 1;
        //     }
        //     if(!gameState.currentWord)
        //         gameState.red.b = gameState.position + 1;
        // }
        gameState.red.a = gameState.line.b;
        gameState.red.b = Math.max(this.green.b + newInput.length, gameState.red.a);
        
        // Rest
        gameState.rest.a = gameState.red.b;

        gameState.currentWord = textIncorrectStart + newInput.length - newInputIncorrectStart < 
                                gameState.text.indexOf(' ', textIncorrectStart - newInputIncorrectStart);
        gameState.correct = correctNewChar;
        gameState.position = this.green.b + newInput.length;
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
         ${this.position != this.text.length ? `--><span class="race-text-cursor"></span><!--` : ''}
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