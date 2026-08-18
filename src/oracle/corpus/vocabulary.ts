/**
 * The vocabulary. Every table is keyed by an astrological fact and holds
 * interchangeable phrasings of it.
 *
 * GRAMMAR CONTRACT — templates rely on these shapes, so keep to them when you
 * add lines, or sentences will come out broken:
 *
 *   domain[planet]   noun phrase, carries its own article   "the tide under the ribs"
 *   quality[sign]    verb phrase, third person singular     "moves before it thinks"
 *   relation[aspect] transitive verb phrase, needs object   "sharpens itself against"
 *   motion[phase]    independent clause                     "the light is coming back"
 *   field[house]     noun phrase, carries its own article   "the house of the threshold"
 *   drift[planet]    independent clause                     "the message doubles back"
 *   temper[element]  independent clause                     "everything runs hot"
 *   cadence[modality] independent clause                    "the door is still opening"
 *   bank[*]          fragments; see each key's own note
 */

type Table<K extends string> = Record<K, string[]>;

// ---------------------------------------------------------------------------
// what each planet governs — noun phrases
// ---------------------------------------------------------------------------
export const domain: Table<string> = {
  Sun: [
    'the will', 'the visible self', 'the thing you are becoming',
    'what you cannot stop wanting', 'the centre that holds',
    'your name said aloud', 'the daylight in you', 'the part of you that insists',
  ],
  Moon: [
    "the body's weather", 'what you need before you know you need it',
    'the tide under the ribs', 'memory that arrives unasked',
    'the animal that sleeps in you', 'the private hunger',
    'the room behind the door', 'the instinct you keep talking over',
  ],
  Mercury: [
    'the errand', 'the message still in transit', 'the hand that sorts',
    'the argument you rehearse', 'the quick thought',
    'the road between two houses', 'what is waiting to be said', 'the ledger',
  ],
  Venus: [
    'what draws you', 'the terms of your wanting', 'the taste in your mouth',
    'what you would keep', 'the hand offered across the table',
    'sweetness and its price', 'the thing judged worth having', 'the attachment',
  ],
  Mars: [
    'the cut', 'the thing you would fight for', 'the heat under the skin',
    'the first move', 'the appetite for difficulty',
    'the blade', 'what refuses', 'the will to act now',
  ],
  Jupiter: [
    'the door left open', 'more than you asked for', 'the long view',
    'the appetite for the far', 'what expands', 'the generous excess',
    'the road out of town', 'the faith you have not examined',
  ],
  Saturn: [
    'the bill', 'what will not be hurried', 'the bone under the flesh',
    'the boundary that holds', 'the long labour', 'the closed door',
    'what time requires', 'the debt',
  ],
  Uranus: [
    'the break in the pattern', 'the thing you did not plan',
    'the sudden weather', 'the wire pulled loose', 'the shock that frees',
    'what will not be domesticated', 'the interruption', 'the live current',
  ],
  Neptune: [
    'the fog on the water', 'what dissolves', 'the dream that leaks',
    'longing with no object', 'the veil', 'what you cannot quite see',
    'the tide of forgetting', 'the mercy you did not earn',
  ],
  Pluto: [
    'what is buried', 'the thing under the floor', 'the slow ruin',
    'what must die first', 'the root', 'power that does not announce itself',
    'the compulsion', 'the ash and what grows from it',
  ],
};

// ---------------------------------------------------------------------------
// how each sign behaves — verb phrases, third person singular
// ---------------------------------------------------------------------------
export const quality: Table<string> = {
  Aries: [
    'moves before it thinks', 'wants it now and wants it first',
    'strikes the flint and does not wait for the fire',
    'has no patience left for the preamble', 'goes in without knocking',
    'burns off the hesitation', 'takes the ground rather than asks for it',
  ],
  Taurus: [
    'will not be rushed', 'digs in where it stands',
    'wants the weight of a real thing in the hand',
    'trusts only what it can touch', 'holds on past the point of reason',
    'takes the long slow road on purpose', 'settles like sediment',
  ],
  Gemini: [
    'is in two places at once', 'turns the thing over to see the other side',
    'talks its way toward the answer', 'cannot stop asking',
    'trades one certainty for two questions', 'moves quick and leaves the door open',
    'scatters into a dozen bright pieces',
  ],
  Cancer: [
    'goes home to think', 'guards what it loves with a hard shell',
    'remembers what everyone else agreed to forget',
    'moves sideways toward what it wants', 'feeds first and asks later',
    'builds a room around the tender thing', 'pulls the tide in behind it',
  ],
  Leo: [
    'wants to be seen doing it', 'gives more than is asked and needs it noticed',
    'takes the centre of the room', 'will not perform smallness',
    'burns steady and expects an audience', 'makes the gesture large enough to matter',
    'insists on its own warmth',
  ],
  Virgo: [
    'takes it apart to see how it works', 'notices the flaw first',
    'does the unglamorous necessary thing', 'measures twice',
    'serves the work rather than the applause', 'sorts the useful from the merely pleasant',
    'refuses to call it finished',
  ],
  Libra: [
    'weighs it against its opposite', 'will not move until the scale settles',
    'wants the room to be beautiful and the peace to be real',
    'sees the other side too clearly to strike', 'holds the door for the argument',
    'makes the fair thing look easy', 'delays the choice one more day',
  ],
  Scorpio: [
    'goes all the way down', 'wants the truth even if it costs the peace',
    'does not forget and does not say so', 'burns the letter and keeps the ash',
    'looks straight at the thing everyone is avoiding',
    'keeps its own counsel', 'would rather be destroyed than diluted',
  ],
  Sagittarius: [
    'aims past the horizon', 'says the unvarnished thing',
    'trades the near comfort for the far country', 'follows the meaning out the door',
    'laughs and keeps walking', 'wants the whole map, not the street',
    'believes the road knows where it is going',
  ],
  Capricorn: [
    'climbs whether or not anyone is watching', 'counts the cost first',
    'builds the thing to outlast the builder', 'does not spend what it has not earned',
    'takes the winter route because it holds', 'is patient in a way that looks like coldness',
    'carries the weight without mentioning it',
  ],
  Aquarius: [
    'stands outside and describes the room', 'wants it fixed at the root',
    'refuses the obvious loyalty', 'is loyal to the idea rather than the person',
    'goes cold in order to see clearly', 'breaks the rule it helped write',
    'is already living in the next decade',
  ],
  Pisces: [
    'lets the edges go soft', 'takes on the weather of whoever is nearest',
    'forgives before it has finished being wronged', 'dissolves the line it was defending',
    'knows without being able to say how', 'drifts toward the deeper water',
    'gives away the thing it needed',
  ],
};

// ---------------------------------------------------------------------------
// how two bodies meet — transitive verb phrases; a template supplies the object
// ---------------------------------------------------------------------------
export const relation: Table<string> = {
  conjunction: [
    'has folded into', 'is standing in the same doorway as',
    'can no longer be told apart from', 'has taken on the whole weight of',
    'burns at the same wick as', 'has agreed, for now, to be',
    'presses so close it becomes',
  ],
  sextile: [
    'is quietly offered', 'finds an unlocked door in',
    'leans easily toward', 'holds out a hand to',
    'makes a small opening for', 'is helped, if you let it, by',
    'runs a thin bright wire to',
  ],
  square: [
    'grinds against', 'sharpens itself against',
    'will not give way to', 'is caught at right angles to',
    'demands payment from', 'cannot get past',
    'keeps colliding with',
  ],
  trine: [
    'runs downhill into', 'flows without friction toward',
    'is carried effortlessly by', 'has always understood',
    'opens like a lock to', 'moves in step with',
    'is forgiven everything by',
  ],
  opposition: [
    'stands at the far end of the room from', 'is answered, hard, by',
    'is held in tension against', 'sees its own face in',
    'cannot be had without losing', 'pulls in the exact contrary direction to',
    'is weighed, and found wanting, against',
  ],
};

// ---------------------------------------------------------------------------
// the lunar hour — independent clauses
// ---------------------------------------------------------------------------
export const motion: Table<string> = {
  new: [
    'the dark moon keeps its own counsel',
    'nothing is visible yet and that is the point',
    'the seed is in the ground and the ground says nothing',
    'the sky has emptied itself to make room',
    'this is the hour before the first line is written',
    'the moon has gone under to be remade',
  ],
  'waxing crescent': [
    'the first thin blade of light has returned',
    'something has begun and has not yet been named',
    'the moon shows only as much as it must',
    'the intention has taken its first breath',
    'a small light is arguing with a large dark',
    'the thread has been picked up again',
  ],
  'first quarter': [
    'the moon stands at half and the cost is now visible',
    'the light has met its first real resistance',
    'this is where the beginning demands to be paid for',
    'half is lit and half is not, and both are true',
    'the work has reached the part that is only work',
    'the tension has come due',
  ],
  'waxing gibbous': [
    'the light is nearly full and impatient with itself',
    'almost everything is visible now',
    'the moon is swollen with what it is about to say',
    'the thing is close enough to touch and not yet in hand',
    'refinement is the only work left',
    'the last correction is being made',
  ],
  full: [
    'the moon is entirely lit and hiding nothing',
    'everything is illuminated, including what you preferred dark',
    'the sky has turned its whole face toward you',
    'this is the hour of no remaining excuses',
    'the tide is at its highest and will now turn',
    'what was hidden is standing in plain light',
  ],
  'waning gibbous': [
    'the light has begun to give itself back',
    'the moon is telling what it learned at the top',
    'the harvest is in and the counting has started',
    'something is being handed on rather than held',
    'the first grain of the light has been let go',
    'the story has started explaining itself',
  ],
  'last quarter': [
    'the moon stands at half again, going the other way',
    'the letting go has become deliberate',
    'this is the hour of the honest subtraction',
    'what is finished is being admitted to be finished',
    'the light is being taken apart in an orderly way',
    'the crisis now is one of release, not of effort',
  ],
  'waning crescent': [
    'only a rind of light is left',
    'the moon is emptying out before the dark',
    'the last of it is being spent',
    'this is the hour for rest and for nothing else',
    'the field is going fallow on purpose',
    'the year of this thing is nearly over',
  ],
};

// ---------------------------------------------------------------------------
// the twelve houses — noun phrases (whole-sign, counted from the ascendant)
// ---------------------------------------------------------------------------
export const field: Table<string> = {
  1: ['the house of the body', 'the house of the mask you wear at the door',
      'the first house, where you arrive', 'the house of how you are met',
      'the house of the visible edge of you'],
  2: ['the house of what you hold', 'the house of worth and its accounting',
      'the second house, where value is kept', 'the house of the full and empty hand',
      'the house of what you would not sell'],
  3: ['the house of the near road', 'the house of siblings and short errands',
      'the third house, all talk and traffic', 'the house of the message',
      'the house of what is said in passing'],
  4: ['the house of the foundation', 'the house of the root and the family ground',
      'the fourth house, at the bottom of the chart', 'the house of where you are from',
      'the house of the private room'],
  5: ['the house of the made thing', 'the house of play and risk and children',
      'the fifth house, where the heart shows its hand', 'the house of the game worth losing',
      'the house of what you make for the joy of it'],
  6: ['the house of the daily labour', 'the house of the body and its maintenance',
      'the sixth house, all routine and repair', 'the house of the unglamorous necessary',
      'the house of service and of small illnesses'],
  7: ['the house of the other', 'the house of the one across the table',
      'the seventh house, where you meet your opposite', 'the house of the contract',
      'the house of the partner and the open enemy'],
  8: ['the house of what is shared and what is buried', 'the house of debt, death and other appetites',
      'the eighth house, the deep water', 'the house of what you inherit',
      'the house of the thing that must be gone through'],
  9: ['the house of the far country', 'the house of meaning and the long road',
      'the ninth house, where the map runs out', 'the house of belief',
      'the house of the teacher and the foreign word'],
  10: ['the house of the public name', 'the house of the work you are known by',
       'the tenth house, at the top of the sky', 'the house of the summit',
       'the house of what the world says you are'],
  11: ['the house of the many', 'the house of friends and unlikely alliances',
       'the eleventh house, where the future is planned aloud', 'the house of the hoped-for thing',
       'the house of the crowd you chose'],
  12: ['the house of the undone and the unseen', 'the house of what works against you quietly',
       'the twelfth house, behind the curtain', 'the house of retreat and of the hidden cost',
       'the house of what you keep from yourself'],
};

// ---------------------------------------------------------------------------
// retrograde motion — independent clauses, one set per body
// ---------------------------------------------------------------------------
export const drift: Table<string> = {
  Sun: ['the light itself seems to hesitate'],
  Moon: ['the tide is refusing its own schedule'],
  Mercury: [
    'the message doubles back on the road', 'what was said will have to be said again',
    'the errand returns unfinished', 'the ledger will not balance on the first pass',
    'every conversation is having a second conversation underneath it',
  ],
  Venus: [
    'an old attachment is walking back into the room', 'the terms of your wanting are being renegotiated',
    'what you valued last year is asking to be re-examined', 'sweetness is arriving out of order',
  ],
  Mars: [
    'the blow lands behind you rather than ahead', 'the will has turned inward and is arguing with itself',
    'the attack is being withdrawn to be rebuilt', 'heat is going into the ground instead of the target',
  ],
  Jupiter: [
    'the far country is being reconsidered', 'the open door is being examined for its hinges',
    'faith has turned around to look at what it walked past',
  ],
  Saturn: [
    'the debt is being recalculated', 'the structure is being tested from the inside',
    'the boundary is being walked in the other direction',
  ],
  Uranus: [
    'the break is happening underground where it cannot be watched',
    'the loose wire is sparking somewhere out of sight',
  ],
  Neptune: [
    'the fog is being drawn back into the water it came from',
    'the dream is being read backwards',
  ],
  Pluto: [
    'the buried thing is turning over in its sleep',
    'the slow ruin has paused to look at its own work',
  ],
};

// ---------------------------------------------------------------------------
// the chart's centre of gravity
// ---------------------------------------------------------------------------
export const temper: Table<string> = {
  fire: ['everything runs hot', 'the sky is impatient today',
         'there is more fuel than there is hearth', 'the air smells of struck matches'],
  earth: ['everything is slow and has weight', 'the sky is asking for something you can hold',
          'nothing will move faster than the ground allows', 'the work today is made of hands'],
  air: ['everything is talk and thin bright wire', 'the sky is all argument and no ballast',
        'ideas are cheap today and plentiful', 'the wind has got into the conversation'],
  water: ['everything is running together at the edges', 'the sky is holding more feeling than it can name',
          'nothing is quite separate from anything else today', 'the tide is in the room'],
};

export const cadence: Table<string> = {
  cardinal: ['the door is still opening', 'this is a beginning whether or not you consented to it',
             'the season is turning under your feet'],
  fixed: ['the thing has set and will not be argued out of its shape',
          'you are in the middle of it now, past the point of an easy exit',
          'what is here is here to stay a while'],
  mutable: ['the shape is still loose', 'nothing has finished deciding what it is',
            'the ground is moving and that is not an emergency'],
};

// ---------------------------------------------------------------------------
// free banks — atmosphere, imperative, and closing
// ---------------------------------------------------------------------------
export const bank: Table<string> = {
  // portents; noun phrases
  omen: [
    'salt left on a doorstep', 'a bird striking a lit window', 'a door heard closing in an empty house',
    'the smell of rain on a road that stayed dry', 'a clock that stopped at the useful hour',
    'a key that fits a lock you do not own', 'three crows and then none',
    'a letter arriving for the previous tenant', 'the dog watching a corner where nothing is',
    'milk turning a day early', 'a match that will not stay lit',
    'the tide leaving something on the step', 'a name you have not thought of in years',
    'a stopped escalator you climb anyway', 'the smell of a room from your childhood',
  ],
  // when; adverbial phrases
  hour: [
    'before the light turns', 'by the third day', 'within the week',
    'at the hour you least expect it', 'sooner than is comfortable',
    'not yet, but soon', 'after the next full moon', 'once you stop watching for it',
    'on a Tuesday, unremarkably', 'when the season next changes',
  ],
  // imperatives; bare verb phrases
  gesture: [
    'open your hand', 'hold the line', 'say the true thing and then stop talking',
    'leave the room', 'pay the smaller debt first', 'ask once more, plainly',
    'put down what you have been carrying for someone else',
    'stop rehearsing the argument', 'go the long way',
    'let the silence do the work', 'take the first step badly rather than not at all',
    'refuse the flattering version', 'write it down before you lose it',
    'give the thing away', 'wait one more day', 'answer the letter you have been avoiding',
  ],
  // closing charges; full sentences
  charge: [
    'What is coming has already left where it was.',
    'You will know it by the way it costs you.',
    'The answer is older than the question.',
    'Nothing is being withheld from you that you are ready to hold.',
    'The door was never locked, only heavy.',
    'You have been told this before, in a language you were not yet fluent in.',
    'What you are waiting for is waiting for you to stop waiting.',
    'The next part is not harder, only less familiar.',
    'It will make sense in retrospect and not before.',
    'Take the omen, leave the interpretation.',
    'Some things are true whether or not you find them useful.',
    'The road does not require your approval to be the road.',
  ],
  // what witnesses; noun phrases
  witness: [
    'the water', 'the stone at the field edge', 'the old part of the house',
    'whatever is awake at this hour', 'the part of you that already knew',
    'the hinge', 'the long-lived trees', 'the record no one is keeping',
  ],
  // openers; short clauses
  opening: [
    'Attend.', 'The sky is speaking in its slow grammar.',
    'Here is what stands overhead.', 'Read it as you would read weather.',
    'The instruments agree.', 'This is the shape of the hour.',
    'What follows is not advice.', 'Look up, then look at your hands.',
  ],
};
