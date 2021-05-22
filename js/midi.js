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


var hovering_row = null

var melody_notes = new Set()
var computed_chords = []


var melodyID = {}   // stores Transport event IDs for melody notes
var chordsID = []

var cursor_position = 0


function drawGrid(ctx=ictx,canvas=icanvas) {
    let R = NUM_ROWS
    let C = NUM_COLS

    if(hovering_row != null){
        ctx.fillStyle = '#888888'
        ctx.fillRect(canvas.width*hovering_row[1]/C, hovering_row[0]*(canvas.height/R),canvas.width/C, canvas.height/R)
    }


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
        if(hovering_row != null && hovering_row[0] == i){
            ctx.fillStyle = '#000000'
            ctx.font = '13px sans-serif'
        }
        else{
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '8px sans-serif'
        }
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

    if (x <= w) return

    for(let id in playback_ids){
        let sh = R - 1 - playback_ids[id].note
        let sw = 1 + (playback_ids[id].timestamp[0] * 16/100)
        let sw2 = 1 + (playback_ids[id].timestamp[1] * 16/100)
        if(y >= sh * h && y <= (sh+1) * h && x >= sw * w && x <= (sw2) * w){
            console.log('YES')
            Tone.Transport.clear(id)
            delete playback_ids[id]
            return
        }
    }

    // here => not hit a melody note, so need to add it


    let col = parseInt(x/w)
    let row = parseInt(y/h)

    leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[R-row-1],0.001)

    addOnePlaybackNote(R-row-1, [(col-1)*100/16, col*100/16])


    // // console.log(col,row)
    // let num = row * C + col

    // if (col == 0) return

    // if(melody_notes.has(num)){
    //     Tone.Transport.clear(melodyID[num])
    //     delete melodyID[num]
    //     melody_notes.delete(num)
    //     return
    // }
    // col--;
    // let ticks = String(parseInt(col/4)) + ':' + String(col%4) + ':0'
    // // console.log(ticks)

    // leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[R-row-1],0.001)
    // melody_notes.add(num)
    // melodyID[num] = Tone.Transport.schedule(function(time){
    //     leads[CURRENT_LEAD].tone.triggerAttackRelease(notenames[R-row-1],0.001)
    //     // console.log(ticks)
    // },ticks)
}

function interact(x,y){
    if(document.activeElement.tagName != 'LI')
    tryAddingMelodyNote(x,y)
}

function interact_hover(x,y){
    if(document.activeElement.tagName == 'LI'){
        hovering_row = null;
        return;
    }
    if (x <= icanvas.width/NUM_COLS || y < 0 || x > icanvas.width || y > icanvas.height) {
        hovering_row = null;
        return;
    }

    hovering_row = [parseInt(y / (icanvas.height/NUM_ROWS)), parseInt(x / (icanvas.width/NUM_COLS))]
    // console.log('hovering at:',hovering_row)
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

    // for(let num of melody_notes.values()){
    //     let row = parseInt(num/C)
    //     let col = num%C
    //     // console.log(obj)
    //     ctx.fillRect(col*w,row*h,w,h)

    //     mctx.fillStyle = '#FFFFFF'
    //     mctx.textAlign = 'center'
    //     mctx.fillText(notenames[R-1-row],(col + 0.5)*w,h)   
    // }

    if(PIANO_RECORDING != true)
    {
        let chrono = Object.keys(playback_ids).sort((a,b) => playback_ids[a].timestamp[0] - playback_ids[b].timestamp[0])
        // if(chrono.length) console.log(chrono)
        for(let id of chrono){
            let row = R - 1 - playback_ids[id].note;
            let col = 1 + (playback_ids[id].timestamp[0] * 16 / 100)
            let col2 = 1 + (playback_ids[id].timestamp[1] * 16 / 100)
            let len = col2-col

            ctx.fillStyle = '#1d7b84'
            ctx.fillRect(col*w, row*h, w*len, h)
            ctx.fillStyle = '#3f9da6'
            ctx.fillRect(col*w + 1, row*h + 1, w*len - 2, h - 2)

        }

    }

    else {
        for(let i=0;i<NUM_ROWS;i++){
            let notename = notenames[i]
            for(let hit of playback_notes[notename]){
                let row = R - 1 - i;
                let col = 1 + (hit[0] * 16 / 100)
                let end = hit[1] < 0 ? cursor_position : hit[1]
                let col2 = 1 + (end * 16 / 100)
                let len = col2-col

                ctx.fillStyle = '#1d7b84'
                ctx.fillRect(col*w, row*h, w*len, h)
                ctx.fillStyle = '#3f9da6'
                ctx.fillRect(col*w + 1, row*h + 1, w*len - 2, h - 2)

            }
        }
    }

    // for(let pair of recorded_piano){
    //     let wid = w + pair[1] * (canvas.width - w) / 100
    //     let i=0;
    //     for(;notenames[i]!=pair[0];i++);
    //     i = R-1-i
    //     ctx.fillRect(wid,i*h,w,h)
    // }
}


function ianimate(){
    ictx.fillStyle = '#BBBBBB'
    if(PIANO_RECORDING == true) ictx.fillStyle = '#EEBBBB'
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
    calculateMelody()
    return;
}

function playInputCanvas() {
    // saveInputCanvas()
    Tone.Transport.start()
}


function quantizeNotes(ctx=ictx,canvas=icanvas) {
    let quantInt = parseInt(document.getElementById('quantize-select').value)

    let queue = []
    for(let id in playback_ids){
        let start = playback_ids[id].timestamp[0]
        let col = Math.round(start / (100/quantInt))
        if(col * 100 / quantInt == 100) col--;
        let new_start = col * 100 / quantInt
        let new_end = playback_ids[id].timestamp[1] + new_start - start
        new_end = Math.min(new_end, 100)

        let note = playback_ids[id].note

        queue.push([id, note, [new_start, new_end]])
        
    }

    for(let args of queue){
        let [id,note,timestamp] = args
        clearOnePlaybackNote(id)
        addOnePlaybackNote(note, timestamp)
    }

    // clearPlaybackNotes(reset=false);
    // for(let i=0;i<NUM_ROWS;i++)
    //     for(let j=0;j<playback_notes[notenames[i]].length; j++){
    //         let start = playback_notes[notenames[i]][j][0]
    //         let col = Math.round(start / (100/quantInt))
    //         if(col * 100 / quantInt == 100) col--;
    //         let prev = playback_notes[notenames[i]][j][0]
    //         playback_notes[notenames[i]][j][0] = col * 100 / quantInt
    //         playback_notes[notenames[i]][j][1] += playback_notes[notenames[i]][j][0] - prev
    //         playback_notes[notenames[i]][j][1] = Math.min(playback_notes[notenames[i]][j][1], 100)
    //     }    
    // addPlaybackNotes()
    
}

function clearInputCanvas() {
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
    clearPlaybackNotes()
    // document.getElementById('melody-input').value = ''
}



function computeCanvas() {
    saveInputCanvas()
    clearChords()

    computed_chords = createAccompaniment()
    // console.log(computed_chords.length == 0)
    let reg = parseInt(document.querySelector('input[name="regularity"]:checked').id.split('-')[1])
    // console.log(reg)

    for(let i=0;i<computed_chords.length;i++){
        if(i%reg>0) computed_chords[i] = null
    }

    // console.log(computed_chords)

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
    document.getElementById('record-icon').style.color = 'white'
    Tone.Transport.stop()
    cursor_position = 0
    if(PIANO_RECORDING == true){
        PIANO_RECORDING = null
        addPlaybackNotes()
    }

    if(MIC_RECORDING == true){
        MIC_RECORDING = false
        RECORDER.stop()
        MIC.close()
    }
    
}

function calculateMelody(){
    let mel = [...Array(16).keys()].map(x=>[null, Infinity])
    for(let id in playback_ids){
        let hit = playback_ids[id].timestamp
        let col = Math.round(hit[0] / 100 * 16)
        let dist = Math.abs(hit[0] - col * 100 / 16)
        if(dist < mel[col][1])
            mel[col] = [playback_ids[id].note, dist]
    }
    // console.log(mel)
    if(mel[0][0] == null) return

    let cur = mel[0][0]
    for(let i=1;i<mel.length;i++){
        if (mel[i][0] == null) mel[i][0] = cur;
        else cur = mel[i][0]
    }

    document.getElementById('melody-input').value = mel.map(x=>notenames[x[0]]).join(' ')
}

function readMelodyInput() {
    let melody = document.getElementById('melody-input').value.split(' ').slice(0,16)
    clearPlaybackNotes()

    for(let i=0;i<melody.length;i++){
        let start = i*100/16
        let end = (i+1)*100/16
        playback_notes[melody[i]].push([start,end])
    }
    addPlaybackNotes()
}


function clearChords(){
    for(let num of chordsID){
        // console.log(num)
        Tone.Transport.clear(num)
    }
    chordsID = []
    computed_chords = []
}

