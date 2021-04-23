chord_types = {
    'm': [0, 3, 7],
    'm7': [0, 3, 7, 10],
    'M': [0, 4, 7],
    'M7': [0, 4, 7, 11],
    '7': [0, 4, 7, 10],
    'aug7': [0, 4, 8, 10],
    'o7': [0, 3, 6, 9],
    'b5,7': [0, 4, 6, 10],
    'sus4,7': [0, 5, 7, 10],
    '%7': [0, 3, 6, 10]


}

function transposeChord(chord, root) {
    for(let i = 0; i < chord.length; i++) {
        chord[i] += root;
    }
}

function playJazzChord(root, type) {
    chord = chord_types[type];
    transposeChord(chord, notes_idx[root]);
    playChord(chord, tempo_to_time(TEMPO));
}   

