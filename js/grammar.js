/*



Weight matrix:

        I       ii      iii     IV      V       vi
I:      0.2     0.2     0.2     0.3     0.3     0.3
ii: 
iii:    ..      ..      ..      ..      ..      ..
...
...


Grammar:

U -> B1

B1 -> I A A A
A -> I | ii | iii | IV | V | vi






*/

const chord_names = {
    'happy': ['I','ii', 'III', 'iii','IV','V','vi'], 
    'sad': ['I','ii', 'III', 'iii','IV','V','vi'], 
    'jazz_major': ['7-7', '2-m7', '0-M', '0-M7', '0-7', '9-m7', '9-7', '2-7', '4-m7', '5-7', '4-7', '10-7', '5-M7', '7-m7', '3-o7', '5-m7', '2-%7', '3-7', '5-M', '8-M7'],
    'jazz_minor': ['0-m7', '7-7', '2-%7', '0-m', '5-m7', '7-aug7', '2-7', '0-7', '8-7', '10-7', '3-7', '5-m', '8-M7', '2-m7', '9-%7', '3-M7', '10-m7', '9-aug7', '0-#5,m7', '0-M7']
}


chord_transitions = [{
    //       I      ii      iii     IV      V       vi
    // 'I':   [2.0,     2.5,    2.5,    5.0,      5.0,      4.3],
    // 'ii':   [2.0,     4,      3.5,    3,      8,      3],
    // 'iii':   [3,     2,      4,      5,      4,      6],
    // 'IV':   [3,     4,      2.5,    4,      5,      3],
    // 'V':   [7,     2,      6,      3,    5,      6],
    // 'vi':   [5,   7,      6,      3,    4,      4],

    'I':   [20,     2.5,    2.5,    5,      5,      50],
    'ii':   [2,     4,      35,    3,      80,      3],
    'iii':   [3,     2,      4,      50,      4,      6],
    'IV':   [30,     4,      2.5,    4,      50,      30],
    'V':   [70,     2,      6,      35,    5,      65],
    'vi':   [56,   7,      6,      30,    40,      4],
},
{
    'I':   [20,     2.5,    2.5,    50,      50,      43],
    'ii':   [2,     4,      35,    3,      80,      3],
    'iii':   [3,     2,      4,      50,      4,      6],
    'IV':   [30,     4,      2.5,    4,      50,      30],
    'V':   [70,     2,      6,      35,    5,      65],
    'vi':   [56,   0,      6,      60,    4,      4],
},
{
    'I':   [20,     2.5,    2.5,    50,      50,      43],
    'ii':   [2,     4,      35,    3,      80,      3],
    'iii':   [3,     2,      4,      50,      4,      6],
    'IV':   [3,     4,      2.5,    4,      50,      3],
    'V':   [70,     2,      6,      35,    5,      65],
    'vi':   [56,   0,      6,      6,    4,      4],
},
{
    'I':   [20,     2.5,    2.5,    50,      50,      43],
    'ii':   [2,     4,      35,    3,      80,      3],
    'iii':   [3,     2,      4,      50,      4,      6],
    'IV':   [30,     4,      2.5,    4,      50,      30],
    'V':   [70,     2,      6,      3,    5,      6],
    'vi':   [56,   0,      6,      30,    40,      4],
}

]
// I IV vi I...
// I IV V I or vi...
// I V 



class CFG2 {
    constructor(vars,alph,start){
        this.rules = {}
        this.variables = vars
        this.alphabet = new Set(alph)
        this.start = start
        this.DP = {}
        this.counter = 0
        this.threshold = 0
        this.score = 0
        console.log(this)

    }
    
    add_rules = (rules) => {
        // format = [('S','B1 B2 B3 B4'),...]
        rules = [...rules.values()]
        //console.log(rules)
        for(let i=0; i < rules.length; i++){
            let rule = rules[i]
            if(rule[0] in this.rules) this.rules[rule[0]].push(rule[1].split(' '))
            else this.rules[rule[0]] = [rule[1].split(' ')]
        }
        console.log(this.rules)

    }


    /*

    Example input: 0 7 4 5
    0 7 4 5, I A A A, null


    */

    parse = (input_main,str=null,prev_chord=null, score=0, pos=0) => {
        //console.log(input_main,str,prev_chord)
        let input = input_main
        //console.log('.')
        // format: 
        // input = ['I', 'III', 'IV', 'I']
        // str = ['T','S','D','T','B2']
        if(str == null) str = [this.start] // ['U']

        let inp_joined = input.join(' ')
        let str_joined = str.join(' ')

        if(str_joined in this.DP) {
            // console.log(this.DP[str.join(' ')])
            return this.DP[str_joined]
        }

        if(str.length > input.length) {
            this.DP[str_joined] = []
            return []
        }
        // console.log(str,str.length)
        if(inp_joined == str_joined && score > this.threshold) {
            //console.log("Score: ", score);
            this.score = score
            return [str]
        }


        // console.log(str)
        if(this.alphabet.has(str[0])){

            if(str[0] != input[0]){
                return []
            }

            let res = this.parse(input.slice(1), str.slice(1), prev_chord, score, pos)
            
            if (res.length > 0) return [str].concat(res)

        }

        else{
            
            // let temp_arr;

            // if (str[0] in chord_transitions){
            //     temp_arr = sample_shuffle(str[0])
            // }
            // else{
            //     temp_arr = this.rules[str[0]]
            // }
            let shuf = false
            let temp_arr = this.rules[str[0]]
            if (prev_chord != null) {
                let all_var_name = "All" + style_id[STYLE]
                if (str[0] == all_var_name && prev_chord != null) {
                    temp_arr = reorder_rules(pos, prev_chord).map(x=>[x])
                    //console.log("Here 2: ", temp_arr)
                    // if(prev_chord == 'vi') 
                    //     console.log(temp_arr.join(' '))
                    shuf = true
                }
            }
            let next_chord
            if (chord_set.has(str[0])){
                next_chord = str[0]

                if(prev_chord != null) {
                    pos ++
                    pos %= 4
                    let next_chord_pos = 0;
                    for(; next_chord_pos < chord_names.length && chord_names[next_chord_pos] != next_chord; next_chord_pos++);
                    //alert(prev_chord)
                    
                    score += transition_prob[STYLE]['4/4'][pos][prev_chord][next_chord_pos];
                }
                
            }
            else{
                next_chord = prev_chord
            }

            //console.log(str[0], temp_arr)
            // console.log(temp_arr)
            for(let rule of temp_arr){
                // console.log('at rule =',rule)
                let new_str = rule.concat(str.slice(1))     // if str = ['U'] and rule = ['B1','B2'] ... concatenated = ['B1','B2'] + str[1:]
                let res = this.parse(input, new_str, next_chord, score, pos)

                if (res.length > 0) return [str].concat(res)
            }
        }


        return []

    }

    parse_master = (input) => {
        let stylevalue = document.getElementById('style-select').value
        console.log('style:',stylevalue)
        if (stylevalue != ''){
            STYLE = stylevalue
        }
        this.DP = {}

        let max_score = 0

        input = STYLE.concat(" 4/4 ".concat(input))
        let parsed = []
        let trials =parseInt(document.getElementById('trials-input').value)
        for(let i = 0; i < trials; i++){

            let parsed2 = this.parse(input.split(' '),null,null)
            if(this.score > max_score) {
                max_score = this.score
                parsed = parsed2
            }
        }
        console.log("Max Score: ", max_score)


        let chords = []
        
        if (parsed.length == 0){
            alert('Could not compute a valid chord progression for this melody!')
            return null;
        }

        for(let i=1; i<parsed.length;i++){
            if(parsed[i].length < parsed[i-1].length)
                chords.push(parsed[i-2][0])
        }

        
        chords.push(parsed[parsed.length-2][0])

        return [chords.slice(2), this.score]
    }
}

function convert_vect_to_chord_pair(arr){
    return [...Array(arr.length).keys()].map(x=>[chord_names[STYLE][x],arr[x]])
}


function sample_shuffle(arr){
    // [[0,4],[1,2.5],2.5,5,5,4.3]

    if (arr.length == 1) return arr[0][0]

    sum = 0
    temp = []
    for(let i = 0; i < arr.length; i++){
        temp.push(arr[i][1] + sum)
        sum = temp[i]
    }

    rand = Math.random() * sum

    i = 0
    while (temp[i] < rand){
        i += 1
    }

    ans = arr[i][0]

    // arr[ans] = 0


    arr = arr.slice(0,i).concat(arr.slice(i+1))

    return [ans].concat(sample_shuffle(arr))

}

function reorder_rules(pos, chord){
    // chord = 'I'

    vect = transition_prob[STYLE]['4/4'][pos][chord]
    //console.log("Here: ", chord, vect)

    return sample_shuffle(convert_vect_to_chord_pair(vect))
}

var STYLE = 'happy'

style_id = {'happy': 'H', 'sad': 'S', 'jazz_major': 'JM', 'jazz_minor':'Jm'}

chord_set = new Set()
for(let style in chord_names){
    for(let c of chord_names[style]){
        chord_set.add(c)
    }
}

// chord_set = new Set(['I','ii','III', 'III','IV','V','vi', "7-7", "2-m7", "0-M7", "0-M", "0-7", "2-7", "9-m7", "9-7", "0-m7", "4-m7", "5-7", "2-%7", "5-m7", "10-7", "4-7", "5-M7", "0-m", "7-aug7", "8-7", "3-7"])
// ----------------------------------------------------------------------------
let temp_vars = new Set('U','B1H','B1S', 'B1JM', 'B1Jm', 'B2','B3','B4H','B4S', 'B4JM', 'B4Jm', 'AllH', 'AllS', 'AllJ', 'Happy', 'Sad', 'JazzM', 'Jazzm', '4//4', 'StartH','StartS', 'StartJM', 'StartJm')
let temp_terminals = ['0','1','2','3','4','5','6','7','8','9','10','11','12', 'happy', 'sad', 'jazz_minor', 'jazz_major', '4/4']
let temp_rules = new Set([...[
    ['U', 'Happy'],
    ['U', 'Sad'],
    ['U', 'JazzM'],
    ['U', 'Jazzm'],
    ['Happy', 'happy 4/4 StartH'],
    ['Sad', 'sad 4/4 StartS'],
    ['JazzM', 'jazz_major 4/4 StartJM'],
    ['Jazzm', 'jazz_minor 4/4 StartJm'],
]])

for (style in chord_names) {
    //console.log(...chord_names[style])
    for (let chord of chord_names[style])
        temp_vars.add(chord)
}

console.log(temp_vars)

const chord_expansions = {
    'm': [0, 3, 7],
    'm7': [0, 3, 7, 10],
    'M': [0, 4, 7],
    'M7': [0, 4, 7, 11],
    '7': [0, 4, 7, 10],
    'aug7': [0, 4, 8, 10],
    'o7': [0, 3, 6, 9],
    'b5,7': [0, 4, 6, 10],
    'sus4,7': [0, 5, 7, 10],
    '%7': [0, 3, 6, 10],
    '#5,m7': [0, 3, 8, 10],
    'I' : [0, 4, 7],
    'ii' : [2, 5, 9],
    'iii' : [4, 7, 11],
    'III' : [4, 8, 11],
    'IV' : [5, 9, 0],
    'V' : [7, 11, 2],
    'vi' : [9, 0, 4]
}

function transposeChord(chord, root, contain) {
    //console.log("here, ", chord)
    if(!contain)
        return chord.map(x => x+root)
    else
        return chord.map(x => (x+root)%12)
    
}

function getChordNotes(chord, style, contain=true) {
    // console.log(chord)
    if(style == 'happy' || style == 'sad')  {
        return chord_expansions[chord]
    }
    else {
        let root = parseInt(chord.split('-')[0])
        let type = chord.split('-')[1]

        //console.log(type, chord_expansions[type]) 
        let chord_new = chord_expansions[type];
        chord_new = transposeChord(chord_new, root, contain)
        return chord_new
    }
}

function init_rules() {

    
    for (style in style_id) {
        // Adding Start rules
        let start_rule_res = ""
        let start_var_name = "Start" + style_id[style]
        for (let beat = 1; beat <= 4; beat++) {
            start_rule_res += "B" + String(beat) + style_id[style] + (beat < 4 ? " ": "")
        }
        temp_rules.add([start_var_name, start_rule_res])

        let all_var_name = 'All' + style_id[style]

        
        // Adding bar rules
        for (let beat = 1; beat <= 4; beat++) {
            let bar_var_name = 'B' + String(beat) + style_id[style]
            
            let rule_result
            if(beat == 1) {
                if(style == 'happy') {
                    rule_result = 'I ' + all_var_name + ' ' + all_var_name + ' ' + all_var_name
                }
                else if(style == 'sad') {
                    rule_result = 'vi ' + all_var_name + ' ' + all_var_name + ' ' + all_var_name
                }
                else if(style == 'jazz_major') {
                    rule_result = '0-M7 ' + all_var_name + ' ' + all_var_name + ' ' + all_var_name
                }
                else if(style == 'jazz_minor') {
                    rule_result = '0-m7 ' + all_var_name + ' ' + all_var_name + ' ' + all_var_name
                }
            }
            else if(beat == 4) {
                if(style == 'happy') {
                    rule_result = all_var_name + ' ' + all_var_name + ' ' + all_var_name + ' I'
                }
                else if(style == 'sad') {
                    rule_result = all_var_name + ' ' + all_var_name + ' ' + all_var_name + ' vi'
                }
                else if(style == 'jazz_major') {
                    rule_result = all_var_name + ' ' + all_var_name + ' ' + all_var_name + ' 0-M7'
                }
                else if(style == 'jazz_minor') {
                    rule_result = all_var_name + ' ' + all_var_name + ' ' + all_var_name + ' 0-m7'
                }
                
            }
            else {
                rule_result = all_var_name + ' ' + all_var_name + ' ' + all_var_name + ' ' + all_var_name
            }
            temp_rules.add([bar_var_name, rule_result])

        }

        //
        

        // Adding AllS, AllH, AllJ rules and adding rules for each chord
        for(let chord of chord_names[style]) {

            temp_rules.add([all_var_name, chord])

            if(style != 'sad') {
                let expanded_chord = getChordNotes(chord, style)
                for (note of expanded_chord) {
                    temp_rules.add([chord, String(note)])
                }
            }
            
        }
        

    }


}

init_rules()


G2 = new CFG2(temp_vars, temp_terminals, 'U')
G2.add_rules(temp_rules)

//console.log(G2.parse_master('0 0 0 0'))

//console.log(temp_rules)
