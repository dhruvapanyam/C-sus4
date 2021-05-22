// APP MODE

var APP_MODE = 'midi'
function changeAppMode(val){
    APP_MODE = val;

    if(APP_MODE == 'midi'){
        vcanvas.style.display = 'none'
        canvas.style.display = 'block'
        document.getElementById('transcribe-div').style.display = 'none'
        document.getElementById('record-icon').innerHTML = 'fiber_manual_record'
    }
    else if(APP_MODE == 'mic'){
        vcanvas.style.display = 'block'
        canvas.style.display = 'none'
        document.getElementById('transcribe-div').style.display = 'block'
        document.getElementById('record-icon').innerHTML = 'mic'
    }
}




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

const release_amt_lead = 10;
const release_amt_acc = 100;

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
                release: release_amt_acc
            })
            break
        
        case 'C4':
            acc = new Tone.Sampler({
                'C4': './../samples/'+path[1]
            },{
                release: release_amt_acc
            })
            break

        case 'Fsharp4':
            acc = new Tone.Sampler({
                'F#4': './../samples/'+path[1]
            },{
                release: release_amt_acc
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
                release: release_amt_lead
            })
            break
        
        case 'C4':
            lead = new Tone.Sampler({
                'C4': './../samples/'+path[1]
            },{
                release: release_amt_lead
            })
            break

        case 'Fsharp4':
            lead = new Tone.Sampler({
                'F#4': './../samples/'+path[1]
            },{
                release: release_amt_lead
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

    if(MIC_RECORDING){
        let vals = mic_fft.getValue()
        let thresh = 70;
        let s = 0
        for(let val of vals){
            s += Math.abs(Math.max(val,-thresh))
        }
        s = thresh * FFT_SIZE - s;

        waveform.push(s)


        detectPitch()
        // let detected_pitch = detectPitch();
        // console.log(detected_pitch)
        // frequencies.push(detected_pitch)
    }
    
    // console.log(Tone.Transport.position)
    if (cursor_position >= 100) {
        cursor_position = 0
        if(PIANO_RECORDING == true){
            stopInputCanvas()
        }
        if(MIC_RECORDING == true){
            MIC_RECORDING = false
            RECORDER.stop()
            MIC.close()
            document.getElementById('record-icon').style.color = 'white'

        }
        if(Tone.Transport.loop == false) Tone.Transport.stop()
    }
}

var regularity = 32
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





const NUM_ROWS = 32
const NUM_COLS = 17


var notenames = ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5','F#5','G5']
var reverse_notenames = {}
for(let i=0;i<notenames.length;i++)
    reverse_notenames[notenames[i]] = i




// Contains set of notes and when they are played
var playback_notes = {}


// Contains resulting melody to feed to Grammar
var melody_result = []

