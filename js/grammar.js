function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

class CFG{
    
    constructor(variables,alphabet,start){
        this.variables = new Set(variables)
        this.alphabet = new Set(alphabet)
        this.start = start
        this.rules = {}
        // Format:
        // this.rules = {
        //  'V' : [
        //     ['.','.',...],
        //     ['.',...]
        // ]}

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


    parse = (input_main,str=null,randomize=true) => {
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

            if(randomize) this.rules[str[0]] = shuffle(this.rules[str[0]])

            for(let rule of this.rules[str[0]]){

                let new_str = rule.concat(str.slice(1))     // if str = ['U'] and rule = ['B1','B2'] ... concatenated = ['B1','B2'] + str[1:]
                let res = this.parse(input, new_str)

                if (res.length > 0) return [str].concat(res)
            }
        }


        return []











        // // console.log(this.counter++)
        // // console.log(input,str)
        // // console.log(str)
        // for(let i=0;i<str.length;i++){
        //     let symbol = str[i]
        //     // symbol = 'T' or 'III', etc.
        //     if(this.alphabet.has(symbol)) {
        //         // console.log('alphabet found')
        //         if(i==0) {
        //             if(input.split(' ')[0] != symbol)   
        //                 return []
        //             // input = input_main.slice(1)
        //             // str = str.slice(1)
        //         }
        //         continue
        //     }

        //     // console.log(symbol,this.rules[symbol])
        //     for(let rule of this.rules[symbol]){
        //         // rule = ['T A A A'], etc
        //         // console.log(rule)
        //         let new_str = str.slice(0,i).concat(rule).concat(str.slice(i+1))
        //         // console.log(new_str)
        //         let res = this.parse(input,new_str)
        //         // console.log(input,new_str,res)
        //         if(res.length > 0) return [str].concat(res)
        //     }
        // }

        // this.DP[str.join(' ')] = []
        // return []

    }

    parse_master = (input,randomize=false) => {
        this.DP = {}


        let parsed = this.parse(input.split(' '),null,randomize)
        // console.log(parsed)

        let chords = []
        for(let i=1; i<parsed.length;i++){
            if(parsed[i].length < parsed[i-1].length)
                chords.push(parsed[i-2][0])
        }

        chords.push(parsed[parsed.length-2])
        console.log(parsed)
        return chords
    }

    shuffle_rules = () => {
        for (let v in this.rules){
            this.rules[v] = shuffle(this.rules[v])
        }
        console.log('shuffled')
    }


}

const variables = ['U','B1','B2','B3','B4','T','S','D','A','I','ii','iii','III','IV','V','vi']
const alphabet = ['0','1','2','3','4','5','6','7','8','9','10','11']
const start = 'U'

G = new CFG(variables,alphabet,start)

const rules = [
    ['U','B1 B2 B3 B4'],
    ['B1','T A A A'],
    ['B2','A A A A'],
    ['B3','A A A A'],
    ['B4','A A A T'],
    ['A','T'],
    ['A','S'],
    ['A','D'],
    ['T','I'],
    ['T','vi'],
    ['S','IV'],
    ['S','ii'],
    ['D','iii'],
    // ['D','III'],
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
    // ['III','4'],
    // ['III','8'],
    // ['III','11'],
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


G.add_rules(rules)


// ans = G.parse_master('I V V V V V V I')

// console.log(ans)