piano = new Tone.Sampler({
    C3: './../samples/C3vL.wav'
},{
    release: 80
})
pianoGain = new Tone.Gain().toMaster()
pianoGain.gain.value = 0.6
piano.connect(pianoGain)

metronome = new Tone.Sampler({
    C3: './../samples/hihat.wav'
},{
    release: 80
})
metronomeGain = new Tone.Gain().toMaster()
metronomeGain.gain.value = 0.3
metronome.connect(metronomeGain)

lead = new Tone.Sampler({
    'F#4': './../samples/Fsharp4v60.wav'
},{
    release: 3,
    attack:0.1

})

leadGain = new Tone.Gain().toMaster()
leadGain.gain.value = 0.6
lead.connect(leadGain)

// before connecting to master, we can connect it to filters and gains and other effects

// ------------- BASIC GRAMMAR --------------

const chord_notes = {

    'I' : [0,4,7],
    'ii' : [2,5,9],
    'iii' : [4,7,11],
    'III' : [4,8,11],
    'IV' : [5,9,0],
    'V' : [7,11,2],
    'vi' : [9,0,4],

    // 'I' : [0,4,7,11],
    // 'ii' : [2,5,9,12],
    // 'iii' : [4,7,11,14],
    // // 'III' : [4,8,11],
    // 'IV' : [5,9,12,16],
    // 'V' : [7,11,14,17],
    // 'vi' : [9,12,16,19]
}

const all_chords = ['I','ii','iii','IV','V','vi']

var OCTAVE = 3
const bar_length = 4
const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
var TEMPO = 120

function assignOctave(num,oct = OCTAVE){
    oct += parseInt(num/ 12)
    num %= 12
    return notes[num] + String(oct)
}

// for (let i=0; i<12; i++) notes[i] += String(octave)

function tempo_to_time(tempo){
    // tempo = 120 bpm
    return 60 / tempo
}


// ------------------------------------------

function playChord(chord,waittime=0,tone=null){
    // format: chord = array
    // trigger piano to play the 3 notes at the same time
    for (note of chord){
        piano.triggerAttackRelease(assignOctave(note),"8n",Tone.now() + waittime)
    }
    if (tone != null){
        //alert(tone)
        lead.triggerAttackRelease(tone,"8n",Tone.now() + waittime)
    }
}

function playChordProgression(chords,tones=null){
    // format: chords = ['I','ii',...]
    // trigger piano to play the chords
    for (let i=0; i<chords.length; i++){
        waiting_time = i * tempo_to_time(TEMPO) // 2 seconds per chord
        arr = chord_notes[chords[i]]
        playChord(arr,waiting_time,tones[i])
    }

}

function createAccompaniment(){
    // cuurent format of melody: 4 notes
    // output format: 4 chords -> eg. [I,IV,vi,I]

    // get input notes
    input = document.getElementById('melody-input')
    input = notesToNums(input.value)
    console.log(input)

    // input_nums = input.value.split(' ')

    // if (input_nums.length != 4 * bar_length){
    //     alert('Please enter '+String(bar_length)+' numbers (0..11)!')
    //     return
    // }

    // input_nums = input_nums.map(x=>parseInt(x))

    // generate chords using the melody notes in input_nums
    console.log('computing')
    progression = G2.parse_master(input,true)[0]

    console.log(progression)

    if(progression === undefined) {
        alert('The grammar could not compute a valid derivation. (Make sure there are 16 notes)')
        return
    }




    // -------------------------------------------
    // for now: generate random chords

    // progression = []
    // for (let i=0; i<bar_length; i++){
    //     cur = all_chords[Math.floor(Math.random() * all_chords.length)]
    //     progression.push(cur)
    // }

    output = document.getElementById('chords-output')
    output.value = progression.join(' ')

    // --------------------------------------------

}

notes_idx = {"C": 0,"C#": 1,"D": 2,"D#": 3,"E": 4,"F":5,"F#":6 ,"G":7,"G#":8 ,"A":9 ,"A#":10 ,"B": 11}

function notesToNums(notes) {
    return notes.split(' ').map(x=>notes_idx[x.slice(0, x.length - 1)]).join(' ')
    
}

function triggerChordOutput(){
    output = document.getElementById('chords-output')
    output_nums = output.value.split(' ')
    input = document.getElementById('melody-input')
    //input = notesToNums(input.value)
    input_nums = input.value.split(' ')
    playChordProgression(output_nums,input_nums)
}

function triggerMelodyInput(){
    input = document.getElementById('melody-input')
    //input = notesToNums(input.value)
    input_notes = input.value.split(' ')
    for (let i=0; i<input_notes.length; i++){
        waiting_time = i * tempo_to_time(TEMPO) // 2 seconds per chord
        // arr = chord_notes[chords[i]]
        lead.triggerAttackRelease(input_notes[i],"8n",Tone.now() + waiting_time)
        
    }
}



function changeTempo(tempo){
    TEMPO = tempo;
    document.getElementById('tempo-display').innerHTML = TEMPO
}

function startMetronome(n){
    for (let i=0; i<n; i++){
        let waiting_time = i * tempo_to_time(TEMPO) // 2 seconds per chord
        // arr = chord_notes[chords[i]]
        metronome.triggerAttackRelease('C3',0.1,Tone.now() + waiting_time)
        
    }   
}



// ------------------------------------------- PIANO CANVAS ---------------------------------------
{

var recorded_piano = []
var last_piano_note = null
document.addEventListener('keydown',function(k){
    k = k.key
    if (k == ' '){
        playInputCanvas()
        return
    }


    if (document.getElementById('piano-canvas').style.display == 'none') return

    for(let i = 0; i<whiteKeys.length; i++){
        let key = whiteKeys[i]
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            if (!playing.has(key.key))
            {
                piano.triggerAttack(key.key, "+0")
                playing.add(key.key)
                if(PIANO_RECORDING == false){
                    startRecordingPiano()
                    recorded_piano = []
                    PIANO_RECORDING = true
                }
                if(PIANO_RECORDING == true){
                    last_piano_note = key.key
                    // console.log(last_piano_note,cursor_position)
                    recorded_piano.push([last_piano_note,cursor_position])
                }
            }
            return
        }
    }
    for(let i = 0; i<blackKeys.length; i++){
        let key = blackKeys[i]
        // console.log(key)
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            if (!playing.has(key.key))
            {
                piano.triggerAttack(key.key)
                playing.add(key.key)
                if(PIANO_RECORDING == false){
                    startRecordingPiano()
                    PIANO_RECORDING = true
                }
                if(PIANO_RECORDING == true){
                    last_piano_note = key.key
                    // console.log(last_piano_note,cursor_position)
                    recorded_piano.push([last_piano_note,cursor_position])
                }
            }
            return
        }
    }
})

var playing = new Set()

document.addEventListener('keyup',function(k){
    if (document.getElementById('piano-canvas').style.display == 'none') return
    k = k.key
    for(let i = 0; i<whiteKeys.length; i++){
        let key = whiteKeys[i]
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            piano.triggerRelease(key.key)
            playing.delete(key.key)
            return
        }
    }
    for(let i = 0; i<blackKeys.length; i++){
        let key = blackKeys[i]
        if (key.bind.toLowerCase() == k.toLowerCase())
        {
            piano.triggerRelease(key.key)
            playing.delete(key.key)
            return
        }
    }
})



function switchFormat(chosen) {
    console.log('switching')
    let main = document.getElementById('main-format')
    let temp = main.innerHTML
    main.innerHTML = chosen.innerHTML
    chosen.innerHTML = temp

    if (main.innerHTML == 'piano') {
        document.getElementById('piano-canvas').style.display = 'block'
    }
    else {
        document.getElementById('piano-canvas').style.display = 'none'
    }
}


var canvas = document.getElementById("piano-canvas");
canvas.style.border = '1px solid'
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.6
canvas.style.marginLeft = '7.5%'
canvas.height = canvas.width * (0.325)



let whiteNote = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5']
let binding =   ['Z' ,'X' ,'C' ,'V' ,'B' ,'N' ,'M' ,'Q' ,'W' ,'E' ,'R' ,'T' ,'Y' ,'U' ,'I' ,'O' ,'P' ,'[' ,']' ]

var whiteKeys = []
for (let i=0;i<19;i++){
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

let img = document.getElementById('piano-img')
ctx.drawImage(img,0,0,canvas.width,canvas.height)

// drawKeys()

function drawImage(){
    ctx.drawImage(img,0,0,canvas.width,canvas.height)
}



function animate(){
    drawImage()
    drawKeys(playing)
    requestAnimationFrame(animate)
}

animate()
}
// -------------------------------------------------------------------------------------------------------------
PIANO_RECORDING = null
// ------------------------------------------- INPUT CANVAS ---------------------------------------

var icanvas = document.getElementById('input-canvas')
var ictx = icanvas.getContext('2d')

icanvas.width = window.innerWidth * 0.7
icanvas.height = icanvas.width * 0.3

var melody_notes = new Set()

var cursor_moving = false
var cursor_position = 0

function pushCursor(time=10){
    // depending on the time, need to adjust
    // TEMPO = 120 => 2 beat in 1 seconds = 1/8 progress
    // so for 100ms, 1/80
    let res = document.getElementById('melody-input').value.split(' ')
    let dx = 1/80 * time * (1.02*TEMPO) / 120
    cursor_position += dx

}
var cursor_movement;
// var cursor_movement = setInterval(pushCursor,100)


// Draw grid with 30 rows, and 16 columns

function drawGrid(ctx=ictx,canvas=icanvas) {
    let R = 24
    let C = 17
    ctx.lineWidth = 3
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(0,0)
    ctx.lineTo(0,canvas.height)
    ctx.lineTo(canvas.width,canvas.height)
    ctx.lineTo(canvas.width,0)
    ctx.lineTo(0,0)
    ctx.stroke()

    ctx.lineWidth = 1
    ctx.strokeStyle = '#DDDDDD'
    ctx.beginPath()
    for (let i = 0; i<R;i ++){
        ctx.moveTo(0,canvas.height*i/R)
        ctx.lineTo(canvas.width,canvas.height*i/R)
    }
    ctx.stroke()
    for (let i = 0; i<C;i ++){
        if ((i-1)%4 == 0) ctx.strokeStyle = '#555555'
        else ctx.strokeStyle = '#DDDDDD'
        ctx.beginPath()
        ctx.moveTo(i*canvas.width/C,0)
        ctx.lineTo(i*canvas.width/C,canvas.height)
        ctx.stroke()
    }
    ictx.stroke()
}

var notenames = ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4']
function writeNotes(ctx=ictx,canvas=icanvas){
    let R = 24
    let C = 17
    let w = canvas.width / C
    let h = canvas.height / R
    w /= 2
    ctx.textAlign = 'center'
    for(let i=0;i<R;i++){
        ctx.fillStyle = '#6ac4cc'
        ctx.fillRect(0,i*canvas.height/R, w*2, h)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(notenames[R-i-1],w,i*h + 3*h/4)
    }

}

function tryAddingMelodyNote(x,y){
    if (x > icanvas.width || y > icanvas.height) return
    if (x < 0 || y < 0) return
    // console.log('trying for:',x,y)
    let R = 24
    let C = 17

    let w = icanvas.width / C
    let h = icanvas.height / R

    let col = parseInt(x/w)
    let row = parseInt(y/h)

    // console.log(col,row)
    let num = row * C + col

    if (col == 0) return

    if(melody_notes.has(num)){
        melody_notes.delete(num)
        return
    }
    piano.triggerAttackRelease(notenames[R-row-1],500)
    melody_notes.add(num)
    

}

function fillNotes(ctx=ictx, canvas=icanvas) {
    let R = 24
    let C = 17

    let w = canvas.width / C
    let h = canvas.height / R
    ctx.fillStyle = '#3f9da6'
    for(let num of melody_notes.values()){
        let row = parseInt(num/C)
        let col = num%C
        // console.log(obj)
        ctx.fillRect(col*w,row*h,w,h)
    }

    for(let pair of recorded_piano){
        let wid = w + pair[1] * (canvas.width - w) / 100
        let i=0;
        for(;notenames[i]!=pair[0];i++);
        i = 23-i
        ctx.fillRect(wid,i*h,w,h)
    }
}


function ianimate(){
    ictx.fillStyle = '#BBBBBB'
    ictx.fillRect(0,0,icanvas.width, icanvas.height)
    drawGrid()
    writeNotes()
    fillNotes()
    if (cursor_moving){
        if(cursor_position >= 100){
            clearInterval(cursor_movement)
            cursor_moving = false
            cursor_position = 0
            if(PIANO_RECORDING == true){
                quantizeNotes()
                PIANO_RECORDING = null
            }
        }
        ictx.strokeStyle = '#222222'
        ictx.beginPath()
        let w = icanvas.width / 17
        w = w + cursor_position * (icanvas.width - w) / 100
        ictx.moveTo(w,0)
        ictx.lineTo(w,icanvas.height)
        ictx.stroke()

        // let wid = icanvas.width / 17
        // for (let num of melody_notes){
        //     col = (num % 17) - 1
        //     row = parseInt(num/17)

        //     if (Math.abs(wid * col - w) < 1) {
        //         console.log(w,wid*col)
        //         piano.triggerAttackRelease(notenames[24-row-1],0.1)
        //     }
        // }
    }
    requestAnimationFrame(ianimate)
}

ianimate()

function saveInputCanvas(){
    let res = [...Array(16).keys()].map(x=>null)
    for(let num of melody_notes){
        let row = parseInt(num/17)
        let col = (num % 17) - 1
        res[col] = notenames[23-row]
    }
    if (res[0] == null) return false
    let cur = res[0]
    for(let i=1;i<16;i++){
        if(res[i] == null) res[i] = cur
        else cur = res[i]
        // console.log(res[i])
    }
    console.log(res)
    res = res.join(' ')
    document.getElementById('melody-input').value = res
    return true
}

function playInputCanvas() {
    
    saveInputCanvas()
    triggerMelodyInput()
    cursor_moving = true
    cursor_movement = setInterval(pushCursor,10)
}


function recordInputCanvas() {
    PIANO_RECORDING = false
}

function startRecordingPiano() {
    PIANO_RECORDING = true
    cursor_moving = true
    cursor_movement = setInterval(pushCursor,10)
    
    // startMetronome(16)

}


function quantizeNotes(ctx=ictx,canvas=icanvas) {
    for (let i=0;i<recorded_piano.length;i++){
        let move = recorded_piano[i][1] % 6.25 >= 3.125 ? 1 : 0
        let quantizedcol = parseInt(recorded_piano[i][1] / 6.25) + move
        // recorded_piano[i][1] = 6.25 * (quantizedcol)
        let num
        let j=0;
        for(;notenames[j]!=recorded_piano[i][0];j++);
        let row = 23-j;
        num = row * 17 + quantizedcol + 1
        melody_notes.add(num)
    }
    recorded_piano = []
    saveInputCanvas()
    
}

function interact(x,y){
    tryAddingMelodyNote(x,y)
}

function clearInputCanvas() {
    melody_notes = new Set()
    document.getElementById('melody-input').value = ''
}


// ----------------------------------------------------------

window.addEventListener('resize',function(e){
    canvas.width = window.innerWidth * 0.6
    canvas.height = canvas.width * (0.325)

    icanvas.width = window.innerWidth * 0.7
    icanvas.height = icanvas.width * (0.325)
})

window.addEventListener('mousedown',(e) => {
    let [x,y] = getMousePosition(icanvas,e)
    // console.log(x,y)
    interact(x,y)
})

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // console.log("Coordinate x: " + x, "Coordinate y: " + y);
    return [x,y]
}