# The Oracle

A reading drawn from the actual position of the planets. No question is asked and
no answer is looked up — the sky is measured, turned into signals, and spoken
through a corpus of interchangeable fragments.

```bash
npm run dev              # the web app, on http://localhost:5280
npm run read             # one reading, in the terminal
npm run read -- 40.7 -74 # ...from a given latitude and longitude
npm run check            # corpus QA: malformed lines, determinism, capacity
```

## How a reading is made

```
ephemeris  →  signals  →  fragments  →  reading
```

**Ephemeris** ([src/astro/](src/astro/)) — [astronomy-engine](https://github.com/cosmicds/astronomy-engine)
gives geocentric positions; we derive zodiac sign, retrograde motion (from the
sign of the daily drift), aspects, and lunar phase. With a latitude and longitude
we also compute the ascendant and midheaven and assign whole-sign houses. The
ascendant formula is checked against the sunrise invariant — at sunrise the Sun
sits on the eastern horizon, so the ascendant must equal the Sun's longitude.

**Signals** ([src/oracle/signals.ts](src/oracle/signals.ts)) — the sky becomes a
ranked list of weighted tokens: `aspect:square:Moon:Jupiter`, `retrograde:Mercury`,
`phase:full`. Weighting is the whole game. Two rules matter most:

- *Tight orbs speak louder.* An aspect 0.5° from exact outranks one 7° away.
- *Slow planets are muffled.* Uranus and Neptune sit in the same signs for years
  and aspect each other for a decade at a time. Left unweighted they dominate
  every reading and the oracle says the same thing all season. The Moon, which
  changes sign every two and a half days, is what makes a daily reading move.

**Fragments** ([src/oracle/corpus/](src/oracle/corpus/)) — the writing. See below.

**Assembly** ([src/oracle/assemble.ts](src/oracle/assemble.ts)) — a reading is a
fixed run of roles (*invocation, omen, ground, tension, current, counsel, charge*).
Each role picks a signal by weighted sample without replacement, picks a sentence
frame that fits it, and fills the frame's slots.

## Determinism

The same sky must give the same reading. The seed is a hash of the hour plus a
fingerprint of every active signal, so a refresh never changes the answer — but
the reading renews on the hour as the Moon and the horizon move. An oracle that
says something different every time you look is visibly a random number generator.

## Writing more

Two files hold all the content. [WRITING.md](WRITING.md) is the full reference;
what follows is the summary.

**[vocabulary.ts](src/oracle/corpus/vocabulary.ts)** — tables keyed by an
astrological fact, each holding interchangeable phrasings. Adding a line to
`domain.Mars` gives every frame that mentions Mars another way to say it.
Each table has a required grammatical shape, documented at the top of the file:

| table | shape | example |
|---|---|---|
| `domain[planet]` | noun phrase with article | `the tide under the ribs` |
| `quality[sign]` | verb phrase, 3rd person | `moves before it thinks` |
| `relation[aspect]` | transitive verb phrase | `sharpens itself against` |
| `motion[phase]` | independent clause | `the light is coming back` |
| `field[house]` | noun phrase with article | `the house of the threshold` |
| `drift[planet]` | independent clause | `the message doubles back` |

Keep to the shape and every frame that uses the table stays grammatical.

**[templates.ts](src/oracle/corpus/templates.ts)** — the sentence frames. Slots are
`{table:binding}`, where `binding` is a field of the signal (`planet`, `other`,
`sign`, `aspect`, `phase`, `house`, `element`, `modality`) or a literal key.
`{raw:sign}` prints the bound value itself. Capitalisation is handled for you.

```ts
{ role: 'omen', kinds: ['aspect'], text: '{domain:planet} {relation:aspect} {domain:other}.' }
```

A frame is only used when every slot it opens can actually be filled, so an
unfillable combination is skipped rather than rendered broken.

`npm run check` samples two thousand skies, fails on any malformed line, and
reports **capacity** — how many distinct readings the corpus can produce for a
single fixed sky, per role. The lowest number is where the oracle will start
repeating itself, and is where the next writing should go.

## Location

Requested automatically on arrival. Denied or unavailable, the reading simply
draws on fewer signals — the ascendant and house frames never match and the
remaining roles carry it. Stored coordinates are rounded to two decimals: far
more precision than the sky needs, far less than an address.

The waiting is arranged so nobody stares at a blank page:

- **Permission already granted, or a position remembered** — the reading paints
  at once and quietly corrects itself if the position has moved.
- **First visit** — the page holds on *Finding the horizon…* only while the
  browser dialog is genuinely on screen.
- **Dialog ignored** — after ten seconds it gives up and casts an unlocated
  reading, then folds the position in if the answer ever arrives. The spec
  excludes permission time from `getCurrentPosition`'s own `timeout`, so
  without this clock the page would wait forever.
- **Forget where I stand** — persists as an opt-out, so the automatic request on
  the next visit does not silently overturn the choice. Pressing *attune* opts
  back in.
