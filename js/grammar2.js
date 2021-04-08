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

B1 -> Chord1

Chord1 -> C1 

C1 -> I C2 | I C3 | I C4 .... 
C2 -> ii C1 | ...
..
..

I -> 0 | 4 | 7
..




*/

const chord_names = ['C1','C2','C3','C4','C5','C6']

chord_transitions = {
    //       I      ii      iii     IV      V       vi
    'C1':   [4,     2.5,    2.5,    5,      5,      4.3],
    'C2':   [2,     4,      3.5,    3,      8,      3],
    'C3':   [3,     2,      4,      5,      4,      6],
    'C4':   [6,     4,      2.5,    4,      7,      6],
    'C5':   [7,     2,      6,      5.5,    5,      6.5],
    'C6':   [5.6,   7,      6,      5.5,    5,      4],
}

const name_to_chord = {
    'C1':'I',
    'C2':'ii',
    'C3':'iii',
    'C4':'IV',
    'C5':'V',
    'C6':'vi',
}


class CFG2 {
    constructor(vars,alph,start){
        this.rules = {}
        this.vars = new Set(vars)
        this.alph = new Set(alph)
        this.start = start
        this.DP = {}
        this.counter = 0
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

    parse = (input_main,str=null) => {
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
        if(inp_joined == str_joined) return [str]



        if(this.alphabet.has(str[0])){

            if(str[0] != input[0]){
                return []
            }

            let res = this.parse(input.slice(1), str.slice(1))
            
            if (res.length > 0) return [str].concat(res)

        }

        else{
            
            let temp_arr;

            if (str[0] in chord_transitions){
                temp_arr = sample_shuffle(str[0])
            }
            else{
                temp_arr = this.rules[str[0]]
            }

            for(let rule of temp_arr){

                let new_str = rule.concat(str.slice(1))     // if str = ['U'] and rule = ['B1','B2'] ... concatenated = ['B1','B2'] + str[1:]
                let res = this.parse(input, new_str)

                if (res.length > 0) return [str].concat(res)
            }
        }


        return []

    }

    parse_master = (input) => {
        this.DP = {}


        let parsed = this.parse(input.split(' '),null,randomize)
        // console.log(parsed)

        let chords = []
        for(let i=1; i<parsed.length;i++){
            if(parsed[i].length < parsed[i-1].length)
                chords.push(parsed[i-2][0])
        }

        chords.push(parsed[parsed.length-2])

        return chords
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

function reorder_rules(chord){
    // chord = 'I'
    vect = chord_transitions[chord]

    return sample_shuffle(convert_vect_to_chord_pair(vect))
}


// ----------------------------------------------------------------------------

let temp_rules = [
    ['U','B1'],
    ['B1','C1'],
    ['C1','I'],
    ['C1','I'],
    ['T','vi'],
    ['S','IV'],
    ['S','ii'],
    ['D','iii'],
    ['D','III'],
    ['D','V'],

    ['I','0'],
    ['I','4'],
    ['I','7'],
    ['ii','2'],
    ['ii','5'],
    ['ii','9'],
    ['iii','4'],
    ['iii','7'],
    ['iii','11'],
    ['III','4'],
    ['III','8'],
    ['III','11'],
    ['IV','5'],
    ['IV','9'],
    ['IV','0'],
    ['V','7'],
    ['V','11'],
    ['V','2'],
    ['vi','9'],
    ['vi','0'],
    ['vi','4']
]