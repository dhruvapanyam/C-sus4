// --------------------------- TONES ---------------------------

var accompaniments = []
var leads = []

var CURRENT_ACCOMPANIMENT = 0
var CURRENT_LEAD = 0

// --------------------------- ACC TONES ---------------------------


const accompaniment_tone_paths = [['C3','C3vL']]

for(let path of accompaniment_tone_paths){

    let acc = new Tone.Sampler({
        'C3': './../samples/'+path[1]+'.wav'
    },{
        release: 80
    })
    let accGain = new Tone.Gain().toMaster()
    accGain.gain.value = 0.3
    acc.connect(accGain)   
    
    accompaniments.push({
        tone: acc,
        gain: accGain,
        name: path[1]
    })
}

// --------------------------- LEAD TONES ---------------------------

const lead_tone_paths = [['F#4','Fsharp4v60']]

for(let path of lead_tone_paths){

    let lead = new Tone.Sampler({
        'F#4': './../samples/'+path[1]+'.wav'
    },{
        release: 80
    })
    let leadGain = new Tone.Gain().toMaster()
    leadGain.gain.value = 0.3
    lead.connect(leadGain)   
    
    leads.push({
        tone: lead,
        gain: leadGain,
        name: path[1]
    })
}

// ---------------------------- METRONOME -----------------------------


metronome = new Tone.Sampler({
    C3: './../samples/hihat.wav'
},{
    release: 80
})
metronomeGain = new Tone.Gain().toMaster()
metronomeGain.gain.value = 0.3
metronome.connect(metronomeGain)



function changeLeadGain(val){
    for(let i=0;i<leads.length;i++)
        leads[i].gain.gain.value = val
}

function changeAccompanimentGain(val){
    for(let i=0;i<accompaniments.length;i++)
        accompaniments[i].gain.gain.value = val
}

// --------------------------- Transport ------------------------------


play_metronome = false

Tone.Transport.bpm.value = 90
Tone.Transport.loop = false
Tone.Transport.loopEnd = "4:0:0"



function tempo_to_time(tempo){
    // tempo = 120 bpm
    return 60 / tempo
}


function toggleMetronome(val){
    play_metronome = val
}

function toggleLoop(val){
    Tone.Transport.loop = val
}

function tempoSchedule(time){
    if (play_metronome){
        if(cursor_position % (100/16) == 0)
            metronome.triggerAttackRelease('C3','+0')
    }
    cursor_position += 100/(16 * regularity)
    
    // console.log(Tone.Transport.position)
    if (cursor_position >= 100) {
        cursor_position = 0
        if(PIANO_RECORDING == true){
            quantizeNotes()
            PIANO_RECORDING = null
        }
        if(Tone.Transport.loop == false) Tone.Transport.stop()
    }
}

let regularity = 32
var tempoEventID = Tone.Transport.scheduleRepeat(tempoSchedule,tempo_to_time(Tone.Transport.bpm.value)/regularity)


function changeTempo(tempo){
    // TEMPO = tempo;
    Tone.Transport.bpm.value = tempo
    document.getElementById('tempo-value').innerHTML = '&nbsp;'+String(tempo)+'&nbsp;'


}

function startMetronome(n){
    for (let i=0; i<n; i++){
        let waiting_time = i * tempo_to_time(Tone.Transport.bpm.value) // 2 seconds per chord
        // arr = chord_notes[chords[i]]
        metronome.triggerAttackRelease('C3',0.1,Tone.now() + waiting_time)
        
    }   
}



function playChord(chord) {
    if(chord == null) return
    let exp = getChordNotes(chord, STYLE,false)
    // console.log(exp)
    for(let note of exp) {
        accompaniments[CURRENT_ACCOMPANIMENT].tone.triggerAttackRelease(assignOctave(note%12,OCTAVE + parseInt(note/12)),0.5)
    }
}

