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

const chord_names = ['I','ii', 'III', 'iii','IV','V','vi']


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
        this.variables = new Set(vars)
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
        // console.log(input_main,str,prev_chord)
        let input = input_main
        // console.log('.')
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
                if (str[0] == 'A' && prev_chord != null) {
                    temp_arr = reorder_rules(pos, prev_chord).map(x=>[x])
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

            // console.log(str[0], temp_arr)
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

        console.log(parsed)

        let chords = []
        for(let i=1; i<parsed.length;i++){
            if(parsed[i].length < parsed[i-1].length)
                chords.push(parsed[i-2][0])
        }

        chords.push(parsed[parsed.length-2][0])

        return [chords.slice(2), this.score]
    }
}

function convert_vect_to_chord_pair(arr){
    return [...Array(arr.length).keys()].map(x=>[chord_names[x],arr[x]])
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


    return sample_shuffle(convert_vect_to_chord_pair(vect))
}

var STYLE = 'happy'


chord_set = new Set(['I','ii','III', 'III','IV','V','vi'])
// ----------------------------------------------------------------------------
let temp_vars = ['U','B01','B11', 'B2','B3','B04','B14', 'A','I','ii','iii','IV','V','vi','Happy', 'Sad', '4//4', 'Start1','Start2']
let temp_terminals = ['0','1','2','3','4','5','6','7','8','9','10','11','12', 'happy', 'sad', '4/4']
let temp_rules = [
    ['U', 'Happy'],
    ['U', 'Sad'],
    ['Happy', 'happy 4/4 Start1'],
    ['Sad', 'sad 4/4 Start2'],
    // ['4//4', '4/4 Start'],
    ['Start1','B01 B2 B3 B04'],
    ['Start2','B11 B2 B3 B14'],
    ['B01','I A A A'],
    ['B01','A A A A'],
    ['B11','vi A A A'],
    ['B11','A A A A'],
    ['B2','A A A A'],
    ['B3','A A A A'],
    ['B04','A A A I'],
    ['B04','A A A A'],
    ['B14','A A A vi'],
    ['B14','A A A A'],
    ['A','I'],
    ['A','ii'],
    ['A','iii'],
    ['A', 'III'],
    ['A','IV'],
    ['A','V'],
    ['A','vi'],

    ['I','0'],
    ['I','4'],
    ['I','7'],
    //['I','11'],

    ['ii','2'],
    ['ii','5'],
    ['ii','9'],
    //['ii','0'],

    ['iii','4'],
    ['iii','7'],
    ['iii','11'],
    //['iii','2'],

    ['III','4'],
    ['III','8'],
    ['III','11'],

    ['IV','5'],
    ['IV','9'],
    ['IV','0'],
    //['IV','4'],

    ['V','7'],
    ['V','11'],
    ['V','2'],
    //['V','5'],

    ['vi','9'],
    ['vi','0'],
    ['vi','4'],
    //['vi','4'],

]


G2 = new CFG2(temp_vars, temp_terminals, 'U')
G2.add_rules(temp_rules)