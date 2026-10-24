export type Puzzle = {
  word: string
  hint: string
}

export type Level = {
  id: number
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Master'
  puzzles: Puzzle[]
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Warm Up',
    difficulty: 'Easy',
    puzzles: [
      { word: 'CAT', hint: 'A pet that purrs' },
      { word: 'SUN', hint: 'Shines in the daytime sky' },
      { word: 'DOG', hint: "A loyal pet that barks" },
      { word: 'HAT', hint: 'You wear it on your head' },
      { word: 'CUP', hint: 'You drink tea from it' },
    ],
  },
  {
    id: 2,
    name: 'Getting Going',
    difficulty: 'Easy',
    puzzles: [
      { word: 'FISH', hint: 'It swims and has fins' },
      { word: 'TREE', hint: 'Tall plant with a trunk' },
      { word: 'MOON', hint: 'Glows in the night sky' },
      { word: 'BOOK', hint: 'You read its pages' },
      { word: 'CAKE', hint: 'Sweet treat with candles on birthdays' },
    ],
  },
  {
    id: 3,
    name: 'Five Alive',
    difficulty: 'Easy',
    puzzles: [
      { word: 'APPLE', hint: 'A red or green fruit' },
      { word: 'HOUSE', hint: 'A place where people live' },
      { word: 'WATER', hint: 'You drink it when thirsty' },
      { word: 'CHAIR', hint: 'You sit on it' },
      { word: 'TIGER', hint: 'Big striped cat' },
    ],
  },
  {
    id: 4,
    name: 'Stepping Up',
    difficulty: 'Medium',
    puzzles: [
      { word: 'BRIDGE', hint: 'It crosses over a river' },
      { word: 'JUNGLE', hint: 'Dense tropical forest' },
      { word: 'ROCKET', hint: 'Launches into space' },
      { word: 'MIRROR', hint: 'Shows your reflection' },
      { word: 'PENCIL', hint: 'Writing tool with an eraser' },
    ],
  },
  {
    id: 5,
    name: 'Seven Seas',
    difficulty: 'Medium',
    puzzles: [
      { word: 'KITCHEN', hint: 'Room where food is cooked' },
      { word: 'BLANKET', hint: 'Keeps you warm in bed' },
      { word: 'DOLPHIN', hint: 'Smart sea mammal that clicks' },
      { word: 'VOLCANO', hint: 'Mountain that erupts lava' },
      { word: 'LIBRARY', hint: 'Place full of books to borrow' },
    ],
  },
  {
    id: 6,
    name: 'Big Words',
    difficulty: 'Hard',
    puzzles: [
      { word: 'ELEPHANT', hint: 'Largest land animal with a trunk' },
      { word: 'MOUNTAIN', hint: 'Very tall landform' },
      { word: 'UMBRELLA', hint: 'Keeps you dry in the rain' },
      { word: 'DINOSAUR', hint: 'Prehistoric giant reptile' },
      { word: 'TREASURE', hint: 'Pirates bury it' },
    ],
  },
  {
    id: 7,
    name: 'Brain Bender',
    difficulty: 'Hard',
    puzzles: [
      { word: 'CHOCOLATE', hint: 'Sweet made from cocoa' },
      { word: 'BUTTERFLY', hint: 'Insect with colorful wings' },
      { word: 'ADVENTURE', hint: 'An exciting journey' },
      { word: 'TELESCOPE', hint: 'Used to look at stars' },
      { word: 'PINEAPPLE', hint: 'Spiky tropical fruit' },
    ],
  },
  {
    id: 8,
    name: 'Double Digits',
    difficulty: 'Expert',
    puzzles: [
      { word: 'HELICOPTER', hint: 'Flies with spinning rotor blades' },
      { word: 'WATERMELON', hint: 'Big green fruit, red inside' },
      { word: 'UNIVERSITY', hint: 'Place for higher education' },
      { word: 'TOOTHBRUSH', hint: 'You use it twice a day' },
      { word: 'BASKETBALL', hint: 'Sport with hoops' },
    ],
  },
  {
    id: 9,
    name: 'Word Wizard',
    difficulty: 'Expert',
    puzzles: [
      { word: 'IMAGINATION', hint: 'Ability to create ideas in your mind' },
      { word: 'PHOTOGRAPHY', hint: 'The art of taking pictures' },
      { word: 'TEMPERATURE', hint: 'How hot or cold something is' },
      { word: 'ELECTRICITY', hint: 'Powers your lights and devices' },
      { word: 'CELEBRATION', hint: 'A joyful party or festivity' },
    ],
  },
  {
    id: 10,
    name: 'Grandmaster',
    difficulty: 'Master',
    puzzles: [
      { word: 'ENCYCLOPEDIA', hint: 'Book of knowledge on many topics' },
      { word: 'HIPPOPOTAMUS', hint: 'Huge river animal from Africa' },
      { word: 'ARCHITECTURE', hint: 'The art of designing buildings' },
      { word: 'CONSTELLATION', hint: 'A pattern of stars' },
      { word: 'EXTRAORDINARY', hint: 'Very unusual or remarkable' },
    ],
  },
]

export type Tile = { id: number; letter: string }

export function scramble(word: string): Tile[] {
  const tiles = word.split('').map((letter, id) => ({ id, letter }))
  let result = tiles
  for (let attempt = 0; attempt < 20; attempt++) {
    result = [...tiles]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    if (result.map((t) => t.letter).join('') !== word) break
  }
  return result
}

export function wordPoints(word: string, hintsUsed: number) {
  return Math.max(word.length * 10 - hintsUsed * 15, 5)
}

export function starsFor(hintsUsed: number) {
  if (hintsUsed === 0) return 3
  if (hintsUsed <= 3) return 2
  return 1
}
