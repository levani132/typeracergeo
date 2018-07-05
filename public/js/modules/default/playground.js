var PlayGround = {
    init () {
        this.states = [GameState(this.text)];
        if (Router.innerRoute() == 'world') {

        } else if (Router.innerRoute() == 'friend') {

        } else if (Router.innerRoute() == 'practice') {

        }
    },
    players: [],
    states: [],
    text: `დაჯდა წერად ანდერძისა, საბრალოსა საუბრისად: "ჰე მეფეო, გავიპარე ძებნად ჩემგან საძებრისად! ვერ დავდგები შეუყრელად ჩემთა ცეცხლთა მომდებრისად; შემინდევ და წამატანე მოწყალება ღმრთეებრისად.`,
    onLoad () {
        PlayGround.raceInput = document.querySelector('.race-input');
        PlayGround.raceInput.oninput = PlayGround.input;
    },
    input () {
        if(PlayGround.raceInput.value.length < PlayGround.states[PlayGround.states.length - 1].lastInput.length){
            var n = PlayGround.states[PlayGround.states.length - 1].lastInput.length - PlayGround.raceInput.value.length;
            for(var i = 0; i < n; i++)
                PlayGround.states.splice(PlayGround.states.length - 1, 1);
        }else if(PlayGround.states[PlayGround.states.length - 1].text.length != PlayGround.states[PlayGround.states.length - 1].position){
            var c = PlayGround.raceInput.value[PlayGround.raceInput.value.length - 1];
            var newState = PlayGround.states[PlayGround.states.length - 1].step(c);
            if(newState.correct && c == ' '){
                PlayGround.raceInput.value = '';
            }
            newState.lastInput = PlayGround.raceInput.value;
            PlayGround.states.push(newState);
        }else{
            PlayGround.raceInput.value = PlayGround.states[PlayGround.states.length - 1].lastInput;
        }
        document.querySelector('.race-text').innerHTML = PlayGround.states[PlayGround.states.length - 1].raceText();
    },
    view () {
        Router.loadMe(this);
        return `
        <div class="race-section">
            <h1 class="race-state">რბოლა მალე დაიწყება!</h1>
            <!-- <h1 class="race-state">dაელოდეთ ოპონენტებს...</h1> -->
            <!-- <h1 class="race-state">თქვენ გახვედით მე-4 ადგილზე.</h1> -->
            <!-- <h1 class="race-state">რბოლა დასრულდა.</h1> -->
            <ul class="race-tracks">
                ${
                    this.players.map(player => {
                        `<li class="race-track${player.isMe ? ` me` : ``}">
                            <div class="race-track-left">
                                <div class="race-track-user">
                                    <div class="race-track-user-name">${player.name}</div>
                                    <span class="race-track-user-heli fas fa-helicopter"></span>
                                </div>
                                <div class="race-track-path"></div>
                            </div>
                            <div class="race-track-right">
                                <div class="race-track-place">${player.place}</div>
                                <div class="race-track-speed">${player.speed} ს/წმ</div>
                            </div>
                        </li>`
                    }).join('')
                }
            </ul>
            <div class="race-text">${this.states[this.states.length - 1].text}</div>
            <input type="text" class="race-input">
        </div class="race-section">
        `;
    }
};