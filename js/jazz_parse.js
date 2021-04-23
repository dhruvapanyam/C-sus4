chord_expansions = {
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
    'I' : [0, 4, 7],
    'ii' : [2, 5, 9],
    'iii' : [4, 7, 11],
    'III' : [4, 8, 11],
    'IV' : [5, 9, 0],
    'V' : [7, 11, 2],
    'vi' : [9, 0, 4]
}

function transposeChord(chord, root) {
    for(let i = 0; i < chord.length; i++) {
        chord[i] += root;
        chord[i] %= 12;
    }
    
}

function getChordNotes(chord, style) {
    if(style == 'happy' || style == 'sad')  {
        return chord_expansions[chord]
    }
    else {
        let root = parseInt(chord.split('-')[0])
        let type = chord.split('-')[1]
        let chord_new = chord_expansions[type];
        transposeChord(chord_new, root)
        return chord_new
    }
}

function playJazzChord(root, type) {
    chord = chord_types[type];
    transposeChord(chord, notes_idx[root]);
    playChord(chord, tempo_to_time(TEMPO));
}   

