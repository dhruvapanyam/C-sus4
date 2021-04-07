const alx_note = {
    // 24:'C1',26:'C#1',27:'D1',29:'D#1',31:'E1',32:'F1',34:'F#1',36:'G1',39:'G#1',41:'A1',43:'A#1',46:'B1',
    49:'C2',51:'C#2',55:'D2',58:'D#2',61:'E2',65:'F2',69:'F#2',73:'G2',77:'G#2',82:'A2',87:'A#2',92:'B2',
    97:'C3',103:'C#3',109:'D3',114:'D#3',122:'E3',130:'F3',137:'F#3',146:'G3',154:'G#3',163:'A3',173:'A#3',183:'B3',
    194:'C4',206:'C#4',218:'D4',231:'D#4',245:'E4',259:'F4',275:'F#4',291:'G4',309:'G#4',327:'A4',346:'A#4',367:'B4',
    389:'C5',412:'C#5',436:'D5',462:'D#5',490:'E5',519:'F5',550:'F#5',583:'G5',617:'G#5',654:'A5',693:'A#5',734:'B5'
}   // for alx size of fft, 16384

function getLoudestNote(arr){
    m = -Infinity
    ans = undefined
    loudest = notes.map(x=>0)

    for (let i = 0; i < Object.keys(alx_note).length; i += 1){
        loudest[i%12] += parseInt(arr[Object.keys(alx_note)[i]]) + 100
    }

    // if (Math.max(...loudest) < -60) return '' 

    ans = 0
    for (let i=0;i<12;i++){
        if (loudest[i] > loudest[ans]) ans = i
    }
    return notes[ans]
}

MIC = new Tone.UserMedia().toMaster()
var micALX = new Tone.Analyser('fft',16384)
MIC.connect(micALX)


function array_to_runlength(arr){
    if (arr.length == 0) return arr
    count = 1
    prev = arr[0]
    res = []
    for (let i=1; i<arr.length; i++){
        if (arr[i] == prev)
            count ++;
        else{
            res.push([prev,count])
            count = 1
            prev = arr[i]
        }
    }
    res.push([prev,count])
    return res

}


detect_notes = undefined

var recorded = []
function recordMelodyInput(){
    recorded = []
    MIC.open()
    detect_notes = setInterval(function(){
        alx = micALX.getValue()
        detected = getLoudestNote(alx)
        document.getElementById('detected-note-display').innerHTML = detected
        recorded.push(detected)
    },1)
}

function stopRecordingMelodyInput(){
    MIC.close()
    clearInterval(detect_notes)
    runlength = array_to_runlength(recorded)
    console.log(runlength)
}