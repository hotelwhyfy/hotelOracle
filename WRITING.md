# Writing the corpus

How to give the oracle more to say. The short version: **you edit
[vocabulary.ts](src/oracle/corpus/vocabulary.ts) and nothing else.**

## The mental model

Two files hold all the content, and they do different jobs:

| file | holds | how often you touch it |
|---|---|---|
| [vocabulary.ts](src/oracle/corpus/vocabulary.ts) | interchangeable **ways of saying** an astrological fact | constantly |
| [templates.ts](src/oracle/corpus/templates.ts) | the **sentence shapes** those phrasings drop into | rarely |

Vocabulary multiplies. Templates only add. That asymmetry is why almost all
writing happens in one file.

## Adding a line

Find the table, find the key, add a string to the array. To give Mars another
voice, open `vocabulary.ts` and find `domain.Mars`:

```ts
  Mars: [
    'the cut',
    'the thing you would fight for',
    'the heat under the skin',
    'the will to act now',
    'the thing that will not be talked out of it',   // ← your new line
  ],
```

That is the whole edit. No code, no registration, no rebuild — the dev server
hot-reloads it. Every array is formatted one entry per line so a new line is
always a clean single-line diff.

## The one rule: the grammar contract

Each table has a required grammatical shape. The test:

> **Your new line must be swappable with any existing line in the same array.**

That is literally what happens — the engine picks one at random and drops it
into a sentence assembled from other tables. Get the shape wrong and you don't
break that line, you break every sentence that ever selects it.

| table | keyed by | shape | ✓ | ✗ |
|---|---|---|---|---|
| `domain` | planet | noun phrase, **carries its own article** | `the blade` | `blade` |
| `quality` | sign | verb phrase, **third person singular** | `moves before it thinks` | `impatient and hot` |
| `relation` | aspect | transitive verb, **an object follows it** | `sharpens itself against` | `is in conflict` |
| `motion` | moon phase | independent clause | `the light is coming back` | `returning light` |
| `field` | house 1–12 | noun phrase with article | `the house of the threshold` | `threshold` |
| `drift` | planet | independent clause | `the message doubles back` | `doubling back` |
| `temper` | element | independent clause | `everything runs hot` | `hot and restless` |
| `cadence` | modality | independent clause | `the door is still opening` | `an opening door` |

Write everything **lowercase**. Capitalisation is applied automatically wherever
a fragment lands at the start of a sentence, so a capital letter written by hand
will show up mid-sentence as a mistake.

### `bank` is the exception

`bank` is a set of free word-banks whose shape varies **per key**. Each key has
its own note in the file:

| key | shape | example |
|---|---|---|
| `omen` | noun phrase, a portent | `salt left on a doorstep` |
| `hour` | adverbial phrase, when | `by the third day` |
| `gesture` | bare imperative | `open your hand` |
| `witness` | noun phrase, something that observes | `the stone at the field edge` |
| `opening` | short clause, **a complete sentence** | `The instruments agree.` |
| `charge` | **a complete sentence**, capital and full stop | `The answer is older than the question.` |

`opening` and `charge` are the two that carry their own capital and punctuation,
because they always land at a sentence boundary.

## Why templates don't need updating

40 of the 55 templates reference `{domain:...}`. A line added to `domain.Mars`
therefore propagates into all of them, combined against every other slot.
Measured on a real sky:

```
capacity before          4.708e+25
after +1 phrase to Mars  4.991e+25   ×1.06
```

One sentence of writing bought 2.8×10²⁴ additional readings.

## When you *would* edit templates

Three cases, all structural rather than about wording:

1. **A new sentence shape** — you want the omen to sometimes read
   `Because {domain:planet} {quality:sign}, {domain:other} cannot hold.`
   Existing vocabulary, new arrangement.
2. **Changing a role's character** — more variety in the closing line, say.
3. **A new astrological fact** — speaking about, for instance, a planet at the
   final degree of a sign. This one also needs a signal emitted in
   [signals.ts](src/oracle/signals.ts), and probably a new vocabulary table.

Template slots are `{table:binding}`, where `binding` is a field of the signal —
`planet`, `other`, `sign`, `aspect`, `phase`, `house`, `element`, `modality` —
or a literal key. `{raw:sign}` prints the bound value itself, e.g. `Scorpio`.

```ts
{ role: 'omen', kinds: ['aspect'], text: '{domain:planet} {relation:aspect} {domain:other}.' }
```

A frame is only used when every slot it opens can actually be filled, so an
unfillable combination is skipped rather than rendered broken.

## Checking your work

```bash
npm run check    # fails on broken grammar, confirms determinism, reports capacity
npm run read     # one reading in the terminal — the fastest loop while writing
```

`check` samples 2000 skies and catches contract violations: unfilled slots,
doubled spaces, a lowercase letter after a full stop, orphaned punctuation.
Run it before committing.

## Where the writing is most needed

`check` prints **capacity** — how many distinct readings the corpus can produce
for a single fixed sky, per role. The smallest number is where the oracle will
start repeating itself first:

```
invocation   172        ← thinnest
charge       336        ← next thinnest
ground     3,603
tension   13,468
current   15,015
omen      30,878
counsel   36,208
```

`invocation` and `charge` are the two to grow. They are fed by `motion`,
`temper`, `cadence`, and `bank.charge` — and `cadence` (3 phrasings per key) and
`temper` (4 per key) are the leanest tables in the file.

### One dead end

`drift.Sun` and `drift.Moon` have a single entry each. **Don't fill them.** Seen
from Earth the Sun and Moon never retrograde, so those lines can never fire.
They exist only so the table covers all ten bodies.
