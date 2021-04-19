// Style, time sginature, position in bar


transition_prob = {
    'happy': {
        '4/4': [{
            'I':   [40,     10,    10,    10,      10,      50],
            'ii':   [2,     4,      35,    3,      80,      3],
            'iii':   [3,     2,      4,      50,      4,      6],
            'IV':   [30,     4,      2.5,    4,      50,      30],
            'V':   [70,     2,      6,      35,    5,      65],
            'vi':   [56,   7,      6,      30,    40,      4],
        }, 
        {
            'I':   [20,     2.5,    2.5,    5,      5,      50],
            'ii':   [2,     4,      35,    3,      80,      3],
            'iii':   [3,     2,      4,      50,      4,      6],
            'IV':   [30,     4,      2.5,    4,      50,      30],
            'V':   [70,     2,      6,      35,    5,      65],
            'vi':   [56,   7,      6,      30,    40,      4],
        }, 
        {
            'I':   [20,     2.5,    2.5,    5,      5,      50],
            'ii':   [2,     4,      35,    3,      80,      3],
            'iii':   [3,     2,      4,      50,      4,      6],
            'IV':   [30,     4,      2.5,    4,      50,      30],
            'V':   [70,     2,      6,      35,    5,      65],
            'vi':   [56,   7,      6,      30,    40,      4],
        }, 
        {
            'I':   [20,     2.5,    2.5,    5,      5,      50],
            'ii':   [2,     4,      35,    3,      80,      3],
            'iii':   [3,     2,      4,      50,      4,      6],
            'IV':   [30,     4,      2.5,    4,      50,      30],
            'V':   [70,     2,      6,      35,    5,      65],
            'vi':   [56,   7,      6,      30,    40,      4],
        }
    ]
    },
    'sad': {
        '4/4': [{


        }, {

        }, {

        }, {

        }]
    }
}

let transitions_string = 		
`40	10	0	10	50	50	20
50	10	0	10	40	50	10
0	0	0	0	0	0	0
40	10	0	10	50	50	10
50	10	0	10	50	40	10
60	10	0	10	40	50	10
50	10	0	10	40	40	10
						
20	10	0	10	60	60	10
50	10	0	10	40	70	10
0	0	0	0	0	0	0
30	10	0	10	60	70	10
50	10	0	10	50	60	10
40	10	0	10	50	40	10
30	10	0	10	50	70	10
						
40	10	0	10	30	50	10
60	10	0	10	10	60	10
0	0	0	0	0	0	0
60	10	0	10	30	60	10
60	10	0	10	30	60	10
60	10	0	10	30	60	10
60	10	0	10	20	60	10
						
30	20	0	10	60	60	10
50	10	0	10	50	50	10
0	0	0	0	0	0	0
50	10	0	10	50	50	10
60	10	0	10	50	40	10
60	10	0	10	50	30	20
50	10	0	10	50	50	10`

chord_trans = transitions_string.split(/[\t \n]+/)
console.log(chord_trans)
trans_len = parseInt(chord_trans.length/4)
chord_trans = [...Array(4).keys()].map(i => chord_trans.slice(i*trans_len, (i+1)*trans_len))
console.log(chord_trans)

c_names = ['I', 'ii', 'III', 'iii', 'IV', 'V', 'vi']
for(let i = 0; i < 4; i++) {
    for(let j = 0; j < c_names.length; j++) {
        transition_prob['happy']['4/4'][i][c_names[j]] = chord_trans[i].slice(j * c_names.length, (j + 1) * c_names.length).map(x => parseInt(x))
    }
}
console.log(transition_prob)


transition_prob['happy']['4/4'][3]['V'][4] = 10

let sad_probs = 
`30	40	10	40	40	30	50
30	10	10	40	40	50	40
20	10	30	10	40	20	40
30	30	10	20	50	40	40
40	40	20	40	30	50	40
40	20	10	30	40	20	40
50	50	30	40	40	40	30
						
10	30	40	30	20	40	40
20	10	50	40	20	80	30
20	10	30	10	40	20	40
20	30	30	30	40	40	40
30	40	30	30	20	40	30
20	40	40	30	30	40	30
30	40	40	40	30	40	20
						
10	10	30	20	10	40	50
30	10	40	30	20	60	70
20	10	30	10	30	50	70
20	30	30	20	10	50	50
20	10	30	30	20	60	60
40	30	30	30	20	40	70
20	30	40	30	20	60	70
						
10	10	10	10	30	10	70
20	10	10	30	40	60	70
20	10	10	10	40	10	80
30	20	10	20	40	40	80
40	10	20	20	30	40	80
40	20	30	20	20	40	80
40	20	30	20	40	40	80
`

chord_trans = sad_probs.split(/[\t \n]+/)
console.log(chord_trans)
trans_len = parseInt(chord_trans.length/4)
chord_trans = [...Array(4).keys()].map(i => chord_trans.slice(i*trans_len, (i+1)*trans_len))
console.log(chord_trans)

for(let i = 0; i < 4; i++) {
    for(let j = 0; j < c_names.length; j++) {
        transition_prob['sad']['4/4'][i][c_names[j]] = chord_trans[i].slice(j * c_names.length, (j + 1) * c_names.length).map(x => parseInt(x))
    }
}
console.log(transition_prob)