piano = new Tone.Sampler({
    C3: './../samples/C3vL.wav'
},{
    release: 80
})
pianoGain = new Tone.Gain().toMaster()
pianoGain.gain.value = 0.6
piano.connect(pianoGain)

// before connecting to master, we can connect it to filters and gains and other effects

// ------------- BASIC GRAMMAR --------------

const chord_notes = {

    'I' : [0,4,7],
    'ii' : [2,5,9],
    'iii' : [4,7,11],
    'III' : [4,8,11],
    'IV' : [5,9,0],
    'V' : [7,11,2],
    'vi' : [9,0,4]
}

const all_chords = ['I','ii','iii','III','IV','V','vi']

var OCTAVE = 3
const bar_length = 4
const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
var TEMPO = 120

function assignOctave(num,oct = OCTAVE){
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
        piano.triggerAttackRelease(assignOctave(tone,OCTAVE+1),"8n",Tone.now() + waittime)
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

function createAccompaniment(melody){
    // cuurent format of melody: 4 notes
    // output format: 4 chords -> eg. [I,IV,vi,I]

    // get input notes
    input = document.getElementById('melody-input')
    // input_nums = input.value.split(' ')

    // if (input_nums.length != 4 * bar_length){
    //     alert('Please enter '+String(bar_length)+' numbers (0..11)!')
    //     return
    // }

    // input_nums = input_nums.map(x=>parseInt(x))

    // generate chords using the melody notes in input_nums

    progression = G.parse_master(input.value,true)




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

function triggerChordOutput(){
    output = document.getElementById('chords-output')
    output_nums = output.value.split(' ')
    input = document.getElementById('melody-input')
    input_nums = input.value.split(' ')
    playChordProgression(output_nums,input_nums)
}

function triggerMelodyInput(){
    input = document.getElementById('melody-input')
    input_nums = input.value.split(' ')
    for (let i=0; i<input_nums.length; i++){
        waiting_time = i * tempo_to_time(TEMPO) // 2 seconds per chord
        // arr = chord_notes[chords[i]]
        playChord([],waiting_time,input_nums[i])
    }
}


function changeTempo(tempo){
    TEMPO = tempo;
    document.getElementById('tempo-display').innerHTML = TEMPO
}


