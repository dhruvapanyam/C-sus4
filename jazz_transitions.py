import csv 

transition_frequency = [{}, {}, {}, {}]

songs = []

with open('./songs.csv') as songs_file:
  songs_reader = csv.reader(songs_file, delimiter=',')
  line_count = 0
  for row in songs_reader:

    if(line_count == 0):
      line_count += 1
      continue
    
    if(row[2] == '4'):

      if(row[1].split(' ')[1] == "major"):
        songs.append([int(row[2]), int(row[3]), 'M'])
      # else:
      #   songs.append([int(row[2]), int(row[3]), 'm'])

# for row in songs:
#   print(row)

#print("Here ", songs[0][1], songs[1][1])

chords_data = []


with open('./chords.csv') as csv_file:
  csv_reader = csv.reader(csv_file, delimiter=',')
  
  line_count = 0
  prev_chord = "0"
  curr_chord = "0"
  
  lc = 0
  for row in csv_reader:
    if(lc == 0):
      lc += 1
      continue
    chords_data.append(row)

  


  #num_songs = 0
  for i in range(len(songs) - 1):
    if(songs[i][0] == 4):
      #num_songs += 1

      #if(songs[i][2] == 'M'):
      bar_pos = 0
      #print(songs[i][1], songs[i + 1][1])
      for line_count in range(songs[i][1], songs[i + 1][1]):

        if(line_count == songs[i][1]):

          prev_chord = chords_data[line_count][0]
          #print("Prev: ", prev_chord)

          if(chords_data[line_count][1] != ""):
            prev_chord += '-' + chords_data[line_count][1]
            #print("Prev: ", prev_chord)

        else:
          

          for count in range(int(chords_data[line_count][4])):
            if(prev_chord not in transition_frequency[bar_pos]):
              transition_frequency[bar_pos][prev_chord] = {}
              transition_frequency[bar_pos][prev_chord][prev_chord] = 1
            else:
              if(prev_chord not in transition_frequency[bar_pos][prev_chord]):
                transition_frequency[bar_pos][prev_chord][prev_chord] = 1
              else:
                transition_frequency[bar_pos][prev_chord][prev_chord] += 1
            bar_pos += 1
            bar_pos %= 4


          curr_chord = chords_data[line_count][0]
          if(chords_data[line_count][1] != ""):
            curr_chord += '-' + chords_data[line_count][1]
          if(prev_chord not in transition_frequency[bar_pos]):
            transition_frequency[bar_pos][prev_chord] = {}
            transition_frequency[bar_pos][prev_chord][curr_chord] = 1
            bar_pos += 1
            bar_pos %= 4


            prev_chord = curr_chord

          else:
            curr_chord = str(curr_chord)
            prev_chord = str(prev_chord)
            
            if(curr_chord not in transition_frequency[bar_pos][prev_chord]):
              transition_frequency[bar_pos][prev_chord][curr_chord] = 1
              bar_pos += 1
              bar_pos %= 4

            else:
              transition_frequency[bar_pos][prev_chord][curr_chord] += 1
              bar_pos += 1
              bar_pos %= 4

            

            prev_chord = curr_chord


          


#print("Num: ", num_songs)
for bar_pos in range(4):
  for chord1 in transition_frequency[bar_pos]:
    for chord2 in transition_frequency[bar_pos]:
      if(chord2 not in transition_frequency[bar_pos][chord1]):
        transition_frequency[bar_pos][chord1][chord2] = 0

num_chords = 0
for chord in transition_frequency[0]:
  num_chords += 1

#print("Num chords: ", num_chords)
chord_freqs = {}

for row in chords_data:
  chord = str(row[0])
  if(row[1] != ""):
    chord += '-' + str(row[1])

  #print("CH: ", chord)
  if(chord not in chord_freqs):
    chord_freqs[chord] = 1
  else:
    chord_freqs[chord] += 1


#dict(sorted(chord_freqs.items(), key=lambda item: item[1]))

arr = [chord for chord in chord_freqs]
arr.sort(key = lambda chord: chord_freqs[chord], reverse=True)

arr = arr[:20]


total_transitions = 0

for bar_pos in range(4):
  for chord1 in transition_frequency[bar_pos]:
    for chord2 in transition_frequency[bar_pos]:
      total_transitions += transition_frequency[bar_pos][chord1][chord2]
      if(transition_frequency[bar_pos][chord1][chord2] > 50):
        print("Beat ", bar_pos, ": ", chord1, " ", chord2, " ", transition_frequency[bar_pos][chord1][chord2])

print("\n\n")

for chord in arr: 
  print(chord, end = " ")

print("\n\n")


for bar_pos in range(4):
  for chord1 in arr:
    for chord2 in arr:
      print(transition_frequency[bar_pos][chord1][chord2], end=" ")
    print()
  print("\n")




print(total_transitions, " total transitions")



        

