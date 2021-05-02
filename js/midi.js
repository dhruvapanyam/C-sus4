// input canvas
var icanvas = document.getElementById('input-canvas')
var ictx = icanvas.getContext('2d')

icanvas.width = window.innerWidth * 0.7
icanvas.height = icanvas.width * 0.27

// chord canvas
ccanvas = document.getElementById('chord-canvas')
cctx = ccanvas.getContext('2d')
ccanvas.width = window.innerWidth * 0.7
ccanvas.height = icanvas.height / 17

// melody canvas
mcanvas = document.getElementById('melody-canvas')
mctx = mcanvas.getContext('2d')
mcanvas.width = window.innerWidth * 0.7
mcanvas.height = icanvas.height / 17

const NUM_ROWS = 32
const NUM_COLS = 17



var melody_notes = new Set()
var computed_chords = []

var notenames = ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5','F#5','G5']
var reverse_notenames = {}
for(let i=0;i<notenames.length;i++)
    reverse_notenames[notenames[i]] = i

var melodyID = {}   // stores Transport event IDs for melody notes
var chordsID = []

var cursor_position = 0


function drawGrid(ctx=ictx,canvas=icanvas) {
    let R = NUM_ROWS
    let C = NUM_COLS
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

        if(i==0) continue
        cctx.beginPath()
        cctx.moveTo(i*canvas.width/C,0)
        cctx.lineTo(i*canvas.width/C,ccanvas.height)
        cctx.stroke()

        mctx.beginPath()
        mctx.moveTo(i*canvas.width/C,0)
        mctx.lineTo(i*canvas.width/C,ccanvas.height)
        mctx.stroke()
    }
    ctx.stroke()


    cctx.beginPath()
    cctx.moveTo(canvas.width/C,0)
    cctx.lineTo(ccanvas.width,0)
    cctx.lineTo(ccanvas.width,ccanvas.height)
    cctx.lineTo(canvas.width/C,ccanvas.height)
    cctx.lineTo(canvas.width/C,0)
    cctx.stroke()

    mctx.beginPath()
    mctx.moveTo(canvas.width/C,0)
    mctx.lineTo(ccanvas.width,0)
    mctx.lineTo(ccanvas.width,ccanvas.height)
    mctx.lineTo(canvas.width/C,ccanvas.height)
    mctx.lineTo(canvas.width/C,0)
    mctx.stroke()


}


function writeNotes(ctx=ictx,canvas=icanvas){
    let R = NUM_ROWS
    let C = NUM_COLS
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
    let R = NUM_ROWS
    let C = NUM_COLS

    let w = icanvas.width / C
    let h = icanvas.height / R

    let col = parseInt(x/w)
    let row = parseInt(y/h)

    // console.log(col,row)
    let num = row * C + col

    if (col == 0) return

    if(melody_notes.has(num)){
        Tone.Transport.clear(melodyID[num])
        delete melodyID[num]
        melody_notes.delete(num)
        return
    }
    col--;
    let ticks = String(parseInt(col/4)) + ':' + String(col%4) + ':0'
    console.log(ticks)

    leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[R-row-1],500)
    melody_notes.add(num)
    melodyID[num] = Tone.Transport.schedule(function(time){
        leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[R-row-1],0.5)
        console.log(ticks)
    },ticks)
}

function interact(x,y){
    tryAddingMelodyNote(x,y)
}


function fillNotes(ctx=ictx, canvas=icanvas) {
    let R = NUM_ROWS
    let C = NUM_COLS

    let w = canvas.width / C
    let h = canvas.height / R
    ctx.fillStyle = '#db6969'
    for(let i=0;i<computed_chords.length;i++){
        if(computed_chords[i] == null) continue
        let rows = getChordNotes(computed_chords[i], STYLE, false)
        if(i == 7){
            // console.log(computed_chords[i])
            // console.log(getChordNotes('2-m7',STYLE))
        }
        let col = i+1
        // console.log(obj)
        // console.log(rows)
        for(let row of rows)
            ctx.fillRect(col*w,(R-1-row)*h,w,h)
        
        cctx.fillStyle = '#FFFFFF'
        cctx.textAlign = 'center'
        // cctx.
        // console.log(computed_chords[i])
        cctx.fillText(computed_chords[i],(col + 0.5)*w,h)   
    }

    ctx.fillStyle = '#3f9da6'
    for(let num of melody_notes.values()){
        let row = parseInt(num/C)
        let col = num%C
        // console.log(obj)
        ctx.fillRect(col*w,row*h,w,h)

        mctx.fillStyle = '#FFFFFF'
        mctx.textAlign = 'center'
        mctx.fillText(notenames[R-1-row],(col + 0.5)*w,h)   
    }

    for(let pair of recorded_piano){
        let wid = w + pair[1] * (canvas.width - w) / 100
        let i=0;
        for(;notenames[i]!=pair[0];i++);
        i = R-1-i
        ctx.fillRect(wid,i*h,w,h)
    }
}


function ianimate(){
    ictx.fillStyle = '#BBBBBB'
    ictx.fillRect(0,0,icanvas.width, icanvas.height)

    cctx.fillStyle = '#676767'
    cctx.fillRect(ccanvas.width/NUM_COLS,0,ccanvas.width*(NUM_COLS-1)/NUM_COLS, ccanvas.height)
    cctx.fillStyle = '#6ac4cc'
    cctx.fillRect(0,0,ccanvas.width/NUM_COLS, ccanvas.height)

    mctx.fillStyle = '#676767'
    mctx.fillRect(ccanvas.width/NUM_COLS,0,ccanvas.width*(NUM_COLS-1)/NUM_COLS, ccanvas.height)
    mctx.fillStyle = '#6ac4cc'
    mctx.fillRect(0,0,ccanvas.width/NUM_COLS, ccanvas.height)
    drawGrid()
    writeNotes()
    fillNotes()
    if (1 ||cursor_moving){
        if(cursor_position >= 100){
            // cursor_position = 0
            
        }
        ictx.strokeStyle = '#222222'
        ictx.beginPath()
        let w = icanvas.width / NUM_COLS
        w = w + cursor_position * (icanvas.width - w) / 100
        ictx.moveTo(w,0)
        ictx.lineTo(w,icanvas.height)
        ictx.stroke()

    }
    requestAnimationFrame(ianimate)
}

ianimate()

function saveInputCanvas(){
    let R = NUM_ROWS
    let C = NUM_COLS
    let res = [...Array(16).keys()].map(x=>null)
    for(let num of melody_notes){
        let row = parseInt(num/C)
        let col = (num % C) - 1
        res[col] = notenames[R-1-row]
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
    Tone.Transport.start()
}


function quantizeNotes(ctx=ictx,canvas=icanvas) {
    for (let i=0;i<recorded_piano.length;i++){
        let move = recorded_piano[i][1] % 6.25 >= 3.125 ? 1 : 0 // 6.25 = 1/16 %
        let quantizedcol = parseInt(recorded_piano[i][1] / 6.25) + move
        if(quantizedcol == NUM_COLS - 1) quantizedcol--;
        // recorded_piano[i][1] = 6.25 * (quantizedcol)
        let num
        let j=0;
        for(;notenames[j]!=recorded_piano[i][0];j++);
        let row = NUM_ROWS-1-j;
        num = row * NUM_COLS + quantizedcol + 1
        melody_notes.add(num)

        let col = num % NUM_COLS
        col--
        let ticks = String(parseInt(col/4)) + ':' + String(col%4) + ':0'
        console.log(recorded_piano[i][0])
        melodyID[num] = Tone.Transport.schedule(function(time){
            leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[NUM_ROWS-1-row],0.5)
        },ticks)
    }
    recorded_piano = []
    saveInputCanvas()
    
}

function clearInputCanvas() {
    melody_notes = new Set()
    computed_chords = []
    for(let num of Object.keys(melodyID)){
        Tone.Transport.clear(melodyID[num])
    }
    melodyID = {}
    for(let num of chordsID){
        // console.log(num)
        Tone.Transport.clear(num)
    }
    chordsID = []
    document.getElementById('melody-input').value = ''
}



function computeCanvas() {
    saveInputCanvas()
    clearChords()
    computed_chords = createAccompaniment()
    // console.log(computed_chords.length == 0)
    let reg = parseInt(document.querySelector('input[name="regularity"]:checked').id.split('-')[1])
    console.log(reg)

    for(let i=0;i<computed_chords.length;i++){
        if(i%reg>0) computed_chords[i] = null
    }

    console.log(computed_chords)

    for(let i=0;i<computed_chords.length;i++){
        if(computed_chords[i] == null) continue
        let ticks = String(parseInt(i/4)) + ':' + String(i%4) + ':0'
        chordsID.push(Tone.Transport.schedule(function(time){
            playChord(computed_chords[i])
        },ticks))
    }
}



function pauseInputCanvas(){
    Tone.Transport.pause()
}

function stopInputCanvas(){
    Tone.Transport.stop()
    cursor_position = 0
    quantizeNotes()
    PIANO_RECORDING = null
}

function readMelodyInput() {
    let melody = document.getElementById('melody-input').value.split(' ').slice(0,16)
    clearInputCanvas()
    for(let i=0; i<melody.length; i++){
        let note = melody[i]
        let row = NUM_ROWS - 1 - reverse_notenames[note]
        let col = i+1
        let num = row*NUM_COLS + col
        melody_notes.add(num)
        col--
        let ticks = String(parseInt(col/4)) + ':' + String(col%4) + ':0'
        melodyID[num] = Tone.Transport.schedule(function(time){
            leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[NUM_ROWS-1-row],0.5)
            // console.log(ticks)
        },ticks)
        // console.log(notenames[23-row])
    }
    document.getElementById('melody-input').value = melody.join(' ')
}


function clearChords(){
    for(let num of chordsID){
        // console.log(num)
        Tone.Transport.clear(num)
    }
    chordsID = []
    computed_chords = []
}

