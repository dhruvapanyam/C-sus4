var recorded_piano = []
var last_piano_note = null
var playing = new Set()
var PIANO_RECORDING = null

function reset_playback_notes(){
    for(let i=0;i<32;i++){
        playback_notes[notenames[i]] = []
    }
}

reset_playback_notes()

document.addEventListener('keydown',function(k){
    k = k.key

    if(document.getElementById('piano-enabled').checked == false) return

    if (document.getElementById('piano-canvas').style.display == 'none') return

    let allKeys = whiteKeys.concat(...blackKeys)

    for(let i = 0; i<allKeys.length; i++){
        let key = allKeys[i]
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            if (!playing.has(key.key))
            {
                leads[CURRENT_LEAD].tone.triggerAttack(key.key, "+0")
                playing.add(key.key)
                if(PIANO_RECORDING == false){
                    startRecordingPiano()
                    recorded_piano = []
                    PIANO_RECORDING = true
                    Tone.Transport.start()
                }
                if(PIANO_RECORDING == true){
                    last_piano_note = key.key
                    // console.log(last_piano_note,cursor_position)
                    recorded_piano.push([last_piano_note,cursor_position])
                    playback_notes[key.key].push([cursor_position,-1]);

                }
            }
            return
        }
    }
})


document.addEventListener('keyup',function(k){
    if(document.getElementById('piano-enabled').checked == false) return

    if (document.getElementById('piano-canvas').style.display == 'none') return
    k = k.key

    let allKeys = whiteKeys.concat(...blackKeys)

    for(let i = 0; i<allKeys.length; i++){
        let key = allKeys[i]
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            leads[CURRENT_LEAD].tone.triggerRelease(key.key)
            playing.delete(key.key)
            if(PIANO_RECORDING) {
                playback_notes[key.key][playback_notes[key.key].length - 1][1] = cursor_position;
            }
            return
        }
    }
})



var canvas = document.getElementById("piano-canvas");
canvas.style.border = '1px solid'
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.5
canvas.height = canvas.width * (0.325)

document.getElementById('choose-tone').style.height = String(canvas.height)+'px'


let img = document.getElementById('piano-img')
ctx.drawImage(img,0,0,canvas.width,canvas.height)


let whiteNote = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5']
let binding =   ['Z' ,'X' ,'C' ,'V' ,'B' ,'N' ,'M' ,'Q' ,'W' ,'E' ,'R' ,'T' ,'Y' ,'U' ,'I' ,'O' ,'P' ,'[' ,']' ]

var whiteKeys = []
for (let i=0;i<whiteNote.length;i++){
    whiteKeys.push({key:whiteNote[i], bind: binding[i]})
}

let blackNote = ['C#3','D#3','F#3','G#3','A#3','C#4','D#4','F#4','G#4','A#4','C#5','D#5','F#5']
binding =       ['S'  ,'D'  ,'G'  ,'H'  ,'J'  ,'2'  ,'3'  ,'5'  ,'6'  ,'7'  ,'9'  ,'0'  ,'='  ]


var blackKeys = []
for (let i=0;i<blackNote.length;i++){
    blackKeys.push({key:blackNote[i], bind: binding[i]})
}

function drawKeys(set){
    let widths = {13:0.0523, 18:0.039}
    let s = 0
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    for(let i=0;i<whiteKeys.length;i++){
        if (set.has(whiteKeys[i].key)) ctx.globalAlpha = 0.3
        else ctx.globalAlpha = 0
        ctx.fillStyle = '#888888'
        let w = widths[i] ? widths[i] : 0.0535
        ctx.fillRect(s,0,w*canvas.width,canvas.height)
        ctx.globalAlpha = 1
        
        ctx.fillStyle = '#000000'
        ctx.fillText(whiteKeys[i].bind,s + w*canvas.width / 2, canvas.height * 0.9)
        s += w * canvas.width
    }

    s = 0
    let diffs = [0.035,0.0535,0.102,0.0595,0.0595, 0.102, 0.0535, 0.102, 0.0595,0.0595,0.098,0.0535,0.102]
    let w = 0.035 * canvas.width
    let h = canvas.height * 0.66
    for(let i=0;i<blackKeys.length;i++){
        if (playing.has(blackKeys[i].key)) ctx.globalAlpha = 0.3
        else ctx.globalAlpha = 0
        s += diffs[i] * canvas.width
        ctx.fillStyle = '#EEEEEE'
        ctx.fillRect(s,0,w,h)
        ctx.globalAlpha = 1
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(blackKeys[i].bind,s + w/ 2, canvas.height * 0.55)
    }
    ctx.globalAlpha = 1
}


// drawKeys()

function drawImage(){
    ctx.drawImage(img,0,0,canvas.width,canvas.height)
}

function animate(){
    if(APP_MODE == 'midi') {

        drawImage()
        drawKeys(playing)
    }
    requestAnimationFrame(animate)
}

animate()


function recordInputCanvas() {
    document.getElementById('record-icon').style.color = 'red'

    if(APP_MODE == 'midi'){
        PIANO_RECORDING = false
    }
    else
        recordVoice()
}

function startRecordingPiano() {
    PIANO_RECORDING = true
}



var playback_ids = {}

function addPlaybackNotes(){
    console.log('adding note events')
    console.log(playback_notes)
    for(let i=0;i<NUM_ROWS;i++){
        for(let j=0;j<playback_notes[notenames[i]].length; j++){
            let hit = playback_notes[notenames[i]][j]
            if(hit[1] == -1) playback_notes[notenames[i]][j][1] = 100;
            addOnePlaybackNote(i, hit)
        }
    }
    console.log(playback_ids)
}

function addOnePlaybackNote(i, hit) {
    let t = (hit[0] / 100) * (16 * 60 / Tone.Transport.bpm.value)
    let t2 = (hit[1] / 100) * (16 * 60 / Tone.Transport.bpm.value)
    // console.log(t, notenames[i], hit)
    let id = Tone.Transport.schedule(function(time){
        // console.log(notenames[i],t,t2)
        // console.log('attacking '+notenames[i])
        leads[CURRENT_LEAD].tone.triggerAttack(notenames[i])
    }, t)
    let id2 = Tone.Transport.schedule(function(time){
        // console.log(notenames[i],t,t2)
        // console.log('releasing '+notenames[i])
        leads[CURRENT_LEAD].tone.triggerRelease(notenames[i])
    }, t2)
    playback_ids[id] = {
        note: i,
        timestamp: hit,
        end: id2
    }
}


function clearPlaybackNotes(reset=true){
    console.log('clearing')
    if(reset) reset_playback_notes()
    for(let id in playback_ids){
        clearOnePlaybackNote(id)
    }
    playback_ids = {}
}

function clearOnePlaybackNote(id){
    Tone.Transport.clear(id)
    Tone.Transport.clear(playback_ids[id].end)
    delete playback_ids[id]
}