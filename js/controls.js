// --------------------------- TONES ---------------------------

let tone_paths = [
    'Lead Piano-C3.wav',
    'Synth Piano-Fsharp4.wav',
    'Acoustic Guitar-C3.wav',
    'Alto Sax-C4.wav',
    'Electric Piano-C4.wav',
    // 'Casio-VZ-10M-Piano-C2.wav',
    'Cello-C3.wav',
    'Choir Aah-C4.wav',
    'Choir Ooh-C4.wav',
    'Electric Guitar-C3.wav',
    'Organ-C3.wav',
    'Piano 2-C3.wav',
    'Piano-C4.wav',
    'Synth Pad-C4.wav',
    'Tenor Sax-C4.wav',
    'Violin-C4.wav'
]

var accompaniments = []
var leads = []

var accompaniment_tone_paths = tone_paths.map(x => {
    let t = x.split('.')[0].split('-')
    return [t[t.length - 1], x]
})
var lead_tone_paths = tone_paths.map(x => {
    let t = x.split('.')[0].split('-')
    return [t[t.length - 1], x]
})


var CURRENT_ACCOMPANIMENT = 0
var CURRENT_LEAD = 0


// --------------------------- ACC TONES ---------------------------



for(let path of accompaniment_tone_paths){
    let acc;
    switch(path[0]){
        case 'C3':
            acc = new Tone.Sampler({
                'C3': './../samples/'+path[1]
            },{
                release: 80
            })
            break
        
        case 'C4':
            acc = new Tone.Sampler({
                'C4': './../samples/'+path[1]
            },{
                release: 80
            })
            break

        case 'Fsharp4':
            acc = new Tone.Sampler({
                'F#4': './../samples/'+path[1]
            },{
                release: 80
            })

    }

    // console.log(acc)
    
    let accGain = new Tone.Gain().toMaster()
    accGain.gain.value = 0.3
    acc.connect(accGain)   
    
    accompaniments.push({
        tone: acc,
        gain: accGain,
        name: path[1].split('-')[0]
    })
}

// --------------------------- LEAD TONES ---------------------------


for(let path of lead_tone_paths){

    let lead;
    switch(path[0]){
        case 'C3':
            lead = new Tone.Sampler({
                'C3': './../samples/'+path[1]
            },{
                release: 80
            })
            break
        
        case 'C4':
            lead = new Tone.Sampler({
                'C4': './../samples/'+path[1]
            },{
                release: 80
            })
            break

        case 'Fsharp4':
            lead = new Tone.Sampler({
                'F#4': './../samples/'+path[1]
            },{
                release: 80
            })

    }

    // console.log(lead)

    let leadGain = new Tone.Gain().toMaster()
    leadGain.gain.value = 0.3
    lead.connect(leadGain)   
    
    leads.push({
        tone: lead,
        gain: leadGain,
        name: path[1].split('-')[0]
    })
}

let leadToneDOM = document.getElementById('lead-tone-select')
let accToneDOM = document.getElementById('accompaniment-select')

leadToneDOM.innerHTML = '<option value="" disabled selected>Choose tone</option>'
for (let i=0;i<leads.length;i++) {
    leadToneDOM.innerHTML += '<option value="'+String(i)+'">'+leads[i].name+'</option>'
}

function changeLeadTone(val){
    let i = parseInt(val);
    CURRENT_LEAD = i;
    leads[CURRENT_LEAD].tone.triggerAttackRelease('C3',0.001)
}

accToneDOM.innerHTML = '<option value="" disabled selected>Choose tone</option>'
accToneDOM.innerHTML += '<option value="'+String(1)+'">'+accompaniments[1].name+'</option>'
accToneDOM.innerHTML += '<option value="'+String(0)+'">'+accompaniments[0].name+'</option>'
for (let i=2;i<accompaniments.length;i++) {
    accToneDOM.innerHTML += '<option value="'+String(i)+'">'+accompaniments[i].name+'</option>'
}

function changeAccompanimentTone(val){
    let i = parseInt(val);
    CURRENT_ACCOMPANIMENT = i;
    accompaniments[CURRENT_ACCOMPANIMENT].tone.triggerAttackRelease('C3',0.001)
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
        accompaniments[CURRENT_ACCOMPANIMENT].tone.triggerAttackRelease(assignOctave(note%12,OCTAVE + parseInt(note/12)),0.001)
    }
}

