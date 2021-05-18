
// ------------- BASIC GRAMMAR --------------


var OCTAVE = 3
const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

notes_idx = {"C": 0,"C#": 1,"D": 2,"D#": 3,"E": 4,"F":5,"F#":6 ,"G":7,"G#":8 ,"A":9 ,"A#":10 ,"B": 11}

function notesToNums(notes) {
    return notes.split(' ').map(x=>notes_idx[x.slice(0, x.length - 1)]).join(' ')
    
}

function assignOctave(num,oct = OCTAVE){
    oct += parseInt(num/ 12)
    num %= 12
    return notes[num] + String(oct)
}

function createAccompaniment(){
    // get input notes
    input = document.getElementById('melody-input')
    input = notesToNums(input.value)
    // console.log(input)

    // generate chords using the melody notes in input_nums
    // console.log('computing')
    progression = G2.parse_master(input,true)

    if(progression === null) {
        return []
    }

    progression = progression[0]
    // console.log(progression)
    return progression

}


window.addEventListener('resize',function(e){
    canvas.width = window.innerWidth * 0.5
    canvas.height = canvas.width * (0.325)

    icanvas.width = window.innerWidth * 0.7
    icanvas.height = icanvas.width * (0.27)

    ccanvas.width = window.innerWidth * 0.7
    ccanvas.height = icanvas.height /17

    mcanvas.width = window.innerWidth * 0.7
    mcanvas.height = icanvas.height /17

    // console.log(canvas.height)
    document.getElementById('choose-tone').style.height = String(canvas.height)+'px'

})

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // console.log("Coordinate x: " + x, "Coordinate y: " + y);
    return [x,y]
}

window.addEventListener('mousedown',(e) => {
    let [x,y] = getMousePosition(icanvas,e)
    // console.log(x,y)
    interact(x,y)
})

