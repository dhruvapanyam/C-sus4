piano = new Tone.Sampler({
    C3: './../samples/C3vL.wav'
},{
    release: 80
})
pianoGain = new Tone.Gain().toMaster()
pianoGain.gain.value = 0.2
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
    release: 3

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


