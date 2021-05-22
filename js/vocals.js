const audioContext = new AudioContext()

var MIC = new Tone.UserMedia().toMaster()
const FFT_SIZE = 64
var mic_fft = new Tone.Analyser('fft',FFT_SIZE)
MIC.connect(mic_fft)




const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/'

var pitch;

function setupPitchDetection(){
    pitch = ml5.pitchDetection(
    model_url,
    audioContext,
    MIC._mediaStream.mediaStream,
    modelLoaded
    );
}

function modelLoaded(){
    console.log('ml5 pitch detection model loaded')
    // setInterval(detectPitch, 100)

}

function detectPitch(){
    pitch.getPitch(function(err, frequency) {
    // document.getElementById('pitch-label').innerHTML = parseInt(frequency)
        frequencies.push(frequency)
    });
}





var MIC_RECORDING = false

function openMic(){
    MIC.open().then(()=>{
        setupPitchDetection()
    })
}


function recordVoice(){
    recordedAudioPlayer.stop()
    let wait = tempo_to_time(Tone.Transport.bpm.value) * 4
    openMic()
    waveform = []
    frequencies = []
    startMetronome(4)
    setTimeout(function(){
        MIC_RECORDING = true
        RECORDER.start()
        playInputCanvas()
    },wait * 1000)
}


var vcanvas = document.getElementById('vocal-canvas')
var vctx = vcanvas.getContext('2d')


vcanvas.width = window.innerWidth * 0.5
vcanvas.height = canvas.width * (0.3)

var waveform = []
var frequencies = []

console.log('regularity:',regularity)
function drawWaveForm(ctx=vctx, canvas=vcanvas){
    let wid = canvas.width
    let hgt = canvas.height

    ctx.lineWidth = 0.8

    let wave_h = hgt/3

    ctx.fillStyle = '#AA6666'
    ctx.fillRect(0,0,wid,hgt/3)
    
    ctx.fillStyle = '#666666'
    ctx.fillRect(0,0,wid/17,hgt)

    let offset = wid*2/17
    let total = wid*14/17
    
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    
    let largest = Math.max(...waveform)

    for(let i=0;i < waveform.length; i++){
        let w = offset + i * total / (16 * regularity)
        ctx.moveTo(w, wave_h/2)
        let h = wave_h*3/8  * waveform[i] / largest
        ctx.lineTo(w, wave_h/2 - h)
        ctx.moveTo(w,wave_h/2)
        ctx.lineTo(w,wave_h/2 + h)
    }
    ctx.closePath()
    ctx.stroke()


    ctx.beginPath()
    ctx.moveTo(wid*3/34, wave_h/2)
    ctx.lineTo(wid*33/34,wave_h/2)
    // ctx.stroke()
    ctx.closePath()
    ctx.strokeStyle = '#AAAAAA'
    ctx.lineWidth = 0.4
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('dB', wid/34, wave_h/2)


}

function drawFrequencyForm(ctx=vctx, canvas=vcanvas){
    let wid = canvas.width
    let hgt = canvas.height

    ctx.fillStyle = '#AAAAAA'

    let offset_w = wid*2/17
    let offset_h = hgt/3 + hgt/32
    let tot_h = hgt*2/3 - hgt/16
    let tot_w = wid*14/17

    ctx.fillRect(offset_w, offset_h, tot_w, tot_h)


    ctx.beginPath()
    // 100Hz to 500Hz
    let num_divs = 40
    for(let i=0; i<num_divs; i++){
        ctx.moveTo(offset_w, offset_h + (i*tot_h/num_divs))
        ctx.lineTo(offset_w + wid*14/17, offset_h + (i*tot_h/num_divs))
    }
    for(let i=0;i<16;i++){
        ctx.moveTo(offset_w + i*tot_w/16, offset_h)
        ctx.lineTo(offset_w + i*tot_w/16, offset_h + tot_h)
    }
    ctx.closePath()
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()



    ctx.lineWidth = 1

    for(let i=0; i < frequencies.length; i++){
        if (frequencies[i] == null) continue

        let w = offset_w + (i * (wid*14/17) / (16 * regularity))
        // 500Hz means offset_h
        // 100Hz means offset_h + tot_h
        // XHz means offset_h + (tot_h * (500-X)/400)
        let h = offset_h + (tot_h * (500-frequencies[i]) / 400)

        ctx.beginPath()
        ctx.arc(w,h, 1, 0, 2*Math.PI)
        ctx.closePath()
        ctx.strokeStyle = '#000000'
        ctx.stroke()
    }

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Hz', wid/34, hgt*2/3)
    ctx.fillStyle = '#000000'
    ctx.fillText('500', wid*3/34, offset_h+tot_h/10)
    ctx.fillText('100', wid*3/34, offset_h+tot_h*9/10)
}

function vanimate(){
    if(APP_MODE == 'mic'){
        vctx.fillStyle = '#777777'
        vctx.fillRect(0,0,vcanvas.width,vcanvas.height)

        drawWaveForm()
        drawFrequencyForm()
    }
    requestAnimationFrame(vanimate)
}

vanimate()




const note_to_frequency = {
    'G2':	98.00,
    'G#2': 	103.83,
    'A2':	110.00,
    'A#2': 	116.54,
    'B2':	123.47,
    'C3':	130.81,
    'C#3': 	138.59,
    'D3':	146.83,
    'D#3': 	155.56,
    'E3':	164.81,
    'F3':	174.61,
    'F#3': 	185.00,
    'G3':	196.00,
    'G#3': 	207.65,
    'A3':	220.00,
    'A#3': 	233.08,
    'B3':	246.94,
    'C4':	261.63,
    'C#4': 	277.18,
    'D4':	293.66,
    'D#4': 	311.13,
    'E4':	329.63,
    'F4':	349.23,
    'F#4': 	369.99,
    'G4':	392.00,
    'G#4': 	415.30,
    'A4':	440.00,
    'A#4': 	466.16,
    'B4':	493.88,
    'C5':	523.25
}

function findClosestMusicalNote(freq){
    if(freq==null) return null
    let m = Infinity;
    let res = 'G2'
    for(let n in note_to_frequency){
        diff = Math.abs(note_to_frequency[n] - freq);
        if(diff < m){
            m = diff
            res = n
        }
    }
    return res
}


function mostCommon(arr){
    let d = {}
    for(let v of arr){
        if(d[v]) d[v]++
        else d[v] = 1
    }

    return Object.keys(d).sort((a,b)=>d[b]-d[a])[0]

}

function transcribe(n=16){
    let arr = frequencies.map(findClosestMusicalNote)
    let res = []
    for (let i = 0; i < n; i++){
        res.push(mostCommon(arr.slice(i*(16*regularity)/n, (i+1)*(16*regularity)/n)))
    }
    return res
}



function transcribeVocals(){
    let interval = parseInt(document.querySelector('input[name="transcribe-interval"]:checked').id.split('-')[1])
    let res = transcribe(interval)

    console.log(res)

    let cur = res[0]
    let cur_interval = [0,-1]
    for(let i=1; i<res.length; i++){
        if(cur == res[i]) continue

        let pos = i*100 / interval
        cur_interval[1] = pos

        let note = reverse_notenames[cur]
        if(note != undefined)
            addOnePlaybackNote(note, cur_interval)
        
        
        cur = res[i]
        cur_interval = [pos,-1]
    }
    let pos = 100
    cur_interval[1] = pos

    let note = reverse_notenames[cur]
    if(note)
        addOnePlaybackNote(note, cur_interval)

}








const RECORDER_SOURCE = Tone.context.createMediaStreamDestination()
const RECORDER = new MediaRecorder(RECORDER_SOURCE.stream)

MIC.connect(RECORDER_SOURCE)

var recordedAudioPlayer = new Tone.Player().toMaster()

function loadBuffer(buf,src){
    // recordedAudioPlayer.load('./../samples/Electric Piano-C4.wav')  
    recordedAudioPlayer.load(src)  
    recordedAudioPlayer.sync().start(0)
    recordedAudioPlayer.start()
}

var chunks = []

RECORDER.ondataavailable = evt => chunks.push(evt.data)
RECORDER.onstop = evt => {
    // console.log(RECORDER)
    let blob = new Blob(chunks, {type: 'audio/ogg; codecs=opus'})
    // console.log(blob.stream())
    src = URL.createObjectURL(blob)
    document.getElementById('recorded-audio').src = src
    // audioFile.src = src

    const audioContext = new AudioContext()
    const fileReader = new FileReader()

    // Set up file reader on loaded end event
    fileReader.onloadend = () => {

        const arrayBuffer = fileReader.result// as ArrayBuffer

        // Convert array buffer into audio buffer
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {

        // Do something with audioBuffer
        console.log(audioBuffer.getChannelData(0))
        
        var myBuf = new Tone.Buffer()
        myBuf.fromArray(audioBuffer.getChannelData(0))

        loadBuffer(myBuf,src)

        })

    }

    //Load blob
    fileReader.readAsArrayBuffer(blob)
      
}
