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

MIC = new Tone.UserMedia()
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


function startMetronome(n=16){
    
    for (let i = 0; i < n; i++){
        metronome.triggerAttackRelease('C3','8n',Tone.now() + i*tempo_to_time(TEMPO))
    }
}

function maxIndex(arr){
    return arr.indexOf(Math.max(...arr))
}


detect_notes = undefined

var recorded = []
counter = 0
function recordMelodyInput(){
    recorded = []
    countdown = document.getElementById('countdown')
    countdown.innerHTML = '3'
    setTimeout(()=>{
        countdown.innerHTML = '2'
        setTimeout(()=>{
            countdown.innerHTML = '1'
            setTimeout(()=>{
                countdown.innerHTML = 'GO!'
                start_recording()
            },1000)
        },1000)
    },1000)
    
}

function start_recording(){
    MIC.open()
    startMetronome()
    detect_notes = setInterval(function(){
        alx = micALX.getValue()
        temp = []
        for(id in alx_note){
            temp.push(alx[id])
        }
        // recorded.push(temp)
        // i = 0
        // for(id in alx_note){
        //     if (alx[id] > -100)
        //         chart.data[0].dataPoints[i].y = parseInt(alx[id]) + 100
        //     i++
        // }
        // chart.render()
        detected = maxIndex(temp)
        document.getElementById('detected-note-display').innerHTML = notes[detected%12]
        recorded.push(detected%12)
    },1)
}

function stopRecordingMelodyInput(){
    MIC.close()
    clearInterval(detect_notes)
    runlength = array_to_runlength(recorded)
    // console.log(runlength)
    melody = getNotesUsingTempo(16)
    document.getElementById('melody-input').value = melody.join(' ')
    document.getElementById('countdown').innerHTML = ''
}


function getNotesUsingTempo(intervals){
    recorded = recorded.slice(10)
    console.log(recorded.length / intervals)
    let window = parseInt(recorded.length / intervals)

    res = []
    for (i=0;i<intervals;i++){
        freqs = notes.map(x=>0)
        for(j=i*window;j<(i+1)*window;j++){
            if(recorded[j] == 1 || recorded[j] == 3 || recorded[j] == 6 || recorded[j] == 8 || recorded[j] == 10) continue
            freqs[recorded[j]] ++
        }
        res.push(maxIndex(freqs))
        // console.log(freqs)
    }

    return res

}

// Alternate way to get the melody using runlength
const noteSecond = 500;
function getNoteLengthFromTempo(tempo) {
    return 60/tempo * noteSecond
}

const negligibleLen = 100


function cleanRunLength(runlength) {
    if(runlength.length <= 1) {
        return runlength
    }
    let i = 0
    for(; i < runlength.length && runlength[i][1] <= negligibleLen; i ++) 

    if(i > runlength.length) {
        return []
    }

    res = []
    prev = runlength[i][0]
    totalLength = runlength[i][1]
    for(; i < runlength.length; i ++) {
        if(runlength[i][1] < negligibleLen) {
            continue;
        }
        if(runlength[i][0] == prev) {
            totalLength += runlength[i][1]
        }
        else {
            res.push([prev, totalLength])
            prev = runlength[i][0]
            totalLength = runlength[i][1]
        }    
    }
    res.push([prev, totalLength])
    return res

}


// var chart = new CanvasJS.Chart("chartContainer", {
// 	theme: "light1", // "light2", "dark1", "dark2"
// 	animationEnabled: false, // change to true		
// 	title:{
// 		text: "Basic Column Chart"
// 	},
// 	data: [
// 	{
// 		// Change type to "bar", "area", "spline", "pie",etc.
// 		type: "column",
// 		dataPoints: [
// 		]
// 	}
// 	]
// });
// chart.render()
// i = 0
// colours = ['green','blue','red','yellow','purple','grey','cyan','pink','brown','orange','lightblue','maroon']
// for(id in alx_note){
//     chart.data[0].dataPoints.push({label: alx_note[id], y:0,color:colours[i%12]})
//     i+=1
// }
// chart.data[0].dataPoints.push({label:'die',y:99,color:'black'})
// chart.render()
