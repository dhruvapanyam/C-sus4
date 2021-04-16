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

const chord_names = ['I','ii','iii','IV','V','vi']

chord_transitions = {
    //       I      ii      iii     IV      V       vi
    'I':   [20,     2.5,    2.5,    50,      50,      43],
    'ii':   [2,     4,      35,    3,      80,      3],
    'iii':   [3,     2,      4,      50,      4,      6],
    'IV':   [30,     4,      2.5,    4,      50,      30],
    'V':   [70,     2,      6,      35,    5,      65],
    'vi':   [56,   7,      6,      30,    40,      4],
}



class CFG2 {
    constructor(vars,alph,start){
        this.rules = {}
        this.variables = new Set(vars)
        this.alphabet = new Set(alph)
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

    /*

    Example input: 0 7 4 5
    0 7 4 5, I A A A, null


    */

    parse = (input_main,str=null,prev_chord=null) => {
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
        if(inp_joined == str_joined) return [str]



        if(this.alphabet.has(str[0])){

            if(str[0] != input[0]){
                return []
            }

            let res = this.parse(input.slice(1), str.slice(1), prev_chord)
            
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
                if (str[0] == 'A') {
                    temp_arr = reorder_rules(prev_chord).map(x=>[x])
                    // console.log(prev_chord, temp_arr)
                    shuf = true
                }
            }
            let next_chord
            if (chord_set.has(str[0])){
                next_chord = str[0]
            }
            else{
                next_chord = prev_chord
            }

            for(let rule of temp_arr){
                // console.log('at rule =',rule)
                let new_str = rule.concat(str.slice(1))     // if str = ['U'] and rule = ['B1','B2'] ... concatenated = ['B1','B2'] + str[1:]
                let res = this.parse(input, new_str, next_chord)

                if (res.length > 0) return [str].concat(res)
            }
        }


        return []

    }

    parse_master = (input) => {
        this.DP = {}


        let parsed = this.parse(input.split(' '),null,null)
        // console.log(parsed)

        let chords = []
        for(let i=1; i<parsed.length;i++){
            if(parsed[i].length < parsed[i-1].length)
                chords.push(parsed[i-2][0])
        }

        chords.push(parsed[parsed.length-2][0])

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


chord_set = new Set(['I','ii','iii','IV','V','vi'])
// ----------------------------------------------------------------------------
let temp_vars = ['U','B1','B2','B3','B4','A','I','ii','iii','IV','V','vi']
let temp_terminals = ['0','1','2','3','4','5','6','7','8','9','10','11','12']
let temp_rules = [
    ['U','B1 B2 B3 B4'],
    ['B1','I A A A'],
    ['B2','A A A A'],
    ['B3','A A A A'],
    ['B4','A A A I'],
    ['A','I'],
    ['A','ii'],
    ['A','iii'],
    ['A','IV'],
    ['A','V'],
    ['A','vi'],

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
    ['vi','4'],
    ['I','12'],
    ['ii','12'],
    ['iii','12'],
    ['IV','12'],
    ['V','12'],
    ['vi','12'],
]


G2 = new CFG2(temp_vars, temp_terminals, 'U')
G2.add_rules(temp_rules)