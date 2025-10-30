# Sora Prompt Engineering Knowledge Base

## Table of Contents

1. [Core Philosophy and Fundamentals](#section-1-core-philosophy-and-fundamentals)
2. [Technical Specifications and Constraints](#section-2-technical-specifications-and-constraints)
3. [Prompt Complexity Levels](#section-3-prompt-complexity-levels)
4. [Key Prompting Principles](#section-4-key-prompting-principles)
5. [Special Elements](#section-5-special-elements)
6. [Iteration and Refinement](#section-6-iteration-and-refinement)
7. [Prompt Examples](#section-7-prompt-examples)
8. [Quick Reference Checklist](#section-8-quick-reference-checklist)

---

<!-- SECTION: CORE PHILOSOPHY -->
## SECTION 1: CORE PHILOSOPHY AND FUNDAMENTALS

### Primary Principle
**Prompting is like briefing a cinematographer who has never seen your storyboard.** If you leave out details, they'll improvise -- and you may not get what you envisioned. By being specific about what the "shot" should achieve, you give the model more control and consistency to work with.

### Key Fundamental Principles

- Detailed prompts give control and consistency, while lighter prompts allow creative freedom
- The same prompt will produce different results each time (this is a feature, not a bug)
- Iteration and small changes can dramatically shift outcomes
- Treat your prompt as a creative wish list, not a contract
- All videos are 15 seconds in duration
- Video resolution influences visual fidelity - higher resolutions generate more detail and texture

<!-- SECTION: TECHNICAL SPECIFICATIONS -->
## SECTION 2: TECHNICAL SPECIFICATIONS AND CONSTRAINTS

### Video Resolution Guidelines

- Higher resolutions generate more detail, texture, and lighting transitions accurately
- Lower resolutions compress visual information, often introducing softness or artifacts
- Consider resolution when planning your visual fidelity needs

### Video Length

- All videos are 15 seconds in duration
- Structure actions and dialogue to fit within this timeframe

<!-- SECTION: PROMPT COMPLEXITY LEVELS -->
## SECTION 3: PROMPT COMPLEXITY LEVELS

### Light Prompt (Creative Freedom)

**Use when:** You want surprising, creative results and don't need precise control

**Structure:**

- Brief, evocative descriptions
- Focus on core concept and style
- Let Sora fill in many details

**Example:**

```
In a 90s documentary-style interview, an old Swedish man sits in a study and says, "I still remember when I was young."
```

### Standard Prompt (Balanced Control)

**Use when:** You want specific results with some creative interpretation

**Structure:**

```
[Prose scene description in plain language. Describe characters, costumes, scenery, weather and other details.]

Cinematography:
Camera: [framing and angle, e.g. wide establishing shot, eye level]
Lens: [optional lens specification for detailed prompts]
Mood: [overall tone, e.g. cinematic and tense, playful and suspenseful]
Lighting: [description of light quality and sources]

Actions:
- [Action 1: a clear, specific beat or gesture]
- [Action 2: another distinct beat within the clip]
- [Action 3: another action or dialogue line]

Dialogue:
[Speaker]: "[If the shot has dialogue, add short natural lines here. Keep them brief and natural.]"

Background Sound:
[Optional: describe ambient sounds or rhythm cues]
```

**CRITICAL FORMATTING RULES:**
- **Blank line after scene description** - Separate the prose description from the Cinematography section
- **Blank line after "Cinematography:" heading** - Each cinematography item (Camera, Lens, Lighting, Mood) should be on its own line
- **Blank line after Cinematography section** - Before Actions section
- **Blank line after "Actions:" heading** - Each action bullet point on its own line
- **Blank line after Actions section** - Before Dialogue section (if present)
- **Blank line after "Dialogue:" heading** - Each speaker's line on its own line
- **Blank line after Dialogue section** - Before Background Sound section (if present)
- **Blank line after "Background Sound:" heading** - Sound description follows

**Example of proper spacing:**
```
Scene description here.

Cinematography:
Camera: description
Lens: description
Lighting: description
Mood: description

Actions:
- Action 1
- Action 2

Dialogue:
Speaker: "line"

Background Sound:
Sound description
```

### Ultra-Detailed Prompt (Maximum Control)

**Use when:** You need precise cinematic control or professional production quality

**Structure:**

```
Format & Look
180° shutter; digital capture emulating 65 mm photochemical contrast; fine grain; subtle halation on speculars; no gate weave.

Lenses & Filtration
32 mm / 50 mm spherical primes; Black Pro-Mist 1/4; slight CPL rotation to manage glass reflections.

Grade / Palette
Highlights: clean morning sunlight with amber lift.
Mids: balanced neutrals with slight teal cast in shadows.
Blacks: soft, neutral with mild lift for haze retention.

Lighting & Atmosphere
Natural sunlight from camera left, low angle (07:30 AM).
Bounce: 4×4 ultrabounce silver from trackside.
Negative fill from opposite wall.
Practical: sodium platform lights on dim fade.
Atmos: gentle mist; train exhaust drift through light beam.

Location & Framing
Urban commuter platform, dawn.
Foreground: yellow safety line, coffee cup on bench.
Midground: waiting passengers silhouetted in haze.
Background: arriving train braking to a stop.

Wardrobe / Props / Extras
Main subject: mid-30s traveler, navy coat, backpack slung on one shoulder.
Extras: commuters in muted tones; one cyclist pushing bike.
Props: paper coffee cup, rolling luggage, LED departure board.

Sound
Diegetic only: faint rail screech, train brakes hiss, distant announcement muffled (-20 LUFS), low ambient hum.

Optimized Shot List
0.00–7.50 — "Arrival Drift" (32 mm, shoulder-mounted slow dolly left)
Camera slides past platform signage edge; shallow focus reveals traveler mid-frame looking down tracks.

7.50–15.00 — "Turn and Pause" (50 mm, slow arc in)
Cut to tighter over-shoulder arc as train halts; traveler turns slightly toward camera.
```

<!-- SECTION: KEY PROMPTING PRINCIPLES -->
## SECTION 4: KEY PROMPTING PRINCIPLES

### Style First Principle

Establish the visual aesthetic early to frame all other choices:

- "1970s film"
- "epic, IMAX-scale scene"
- "16mm black-and-white film"
- "Hand-painted 2D/3D hybrid animation"
- "Vintage 16mm documentary"

### Be Specific, Not Vague

| Weak Prompt | Strong Prompt |
|-------------|---------------|
| "A beautiful street at night" | "Wet asphalt, zebra crosswalk, neon signs reflecting in puddles" |
| "Person moves quickly" | "Cyclist pedals three times, brakes, and stops at crosswalk" |
| "Cinematic look" | "Anamorphic 2.0x lens, shallow DOF, volumetric light" |

**Use verbs and nouns that point to visible results.**

### Control Motion and Timing

- One clear camera move and one clear subject action per shot
- Describe actions in beats or counts
- Weak: "Actor walks across the room"
- Strong: "Actor takes four steps to the window, pauses, and pulls the curtain in the final second"

### Lighting and Color

- Describe light quality and color anchors
- Name 3-5 colors for palette stability
- Weak: "brightly lit room"
- Strong: "soft window light with warm lamp fill, cool rim from hallway. Palette anchors: amber, cream, walnut brown"

### Camera Direction

**Framing examples:**

- wide establishing shot, eye level
- wide shot, tracking left to right
- aerial wide shot, slight downward angle
- medium close-up shot, slight angle from behind

**Motion examples:**

- slowly tilting camera
- handheld eng camera
- shoulder-mounted slow dolly left
- slow arc in

**Depth of field:**

- shallow (sharp on subject, blurred background)
- deep focus (keeps both foreground and background sharp)

<!-- SECTION: SPECIAL ELEMENTS -->
## SECTION 5: SPECIAL ELEMENTS

### Dialogue

- Keep lines concise and natural
- Structure dialogue to fit within 15-second videos
- Label speakers consistently for multi-character scenes
- Use alternating turns for character association

**Example:**

```
Dialogue:
- Detective: "You're lying. I can hear it in your silence."
- Suspect: "Or maybe I'm just tired of talking."
- Detective: "Either way, you'll talk before the night's over."
```

### Background Sound

- Use as rhythm cues rather than full soundtracks
- Examples: "distant traffic hiss," "the hum of espresso machines and the murmur of voices"
- Think of it as timing rather than audio production

### Character Consistency

- Expect some unpredictability with characters
- Small phrasing changes can alter identity, pose, or scene focus
- Keep descriptions consistent across shots
- Reuse phrasing for continuity
- Anchor subjects with distinctive details
- Avoid mixing competing traits

### Multiple Shot Handling

- Valid for covering sequences
- Keep each shot block distinct: one camera setup, one subject action, one lighting recipe
- Treat each shot as a creative unit
- Can stitch together in editing or play continuously

### Image References

**Benefits:**

- Locks in composition and style
- Controls character design, wardrobe, set dressing
- Provides aesthetic anchor for first frame

**Technical requirements:**

- Must match target video resolution
- Supported formats: image/jpeg, image/png, image/webp
- Use as input_reference parameter in POST /videos request

**Creation tip:**
Use OpenAI's image generation model to create environments and scene designs, then pass into Sora as references.

### Cameos

**What are Cameos:**
- Cameos allow users to insert specific people or characters into videos using the @ symbol
- The @ symbol followed by a name or handle (e.g., @mcuban, @handle) tags a cameo character
- Cameos work similarly to image references - they provide a reference point for the likeness
- Maximum of 2 cameos can be used per video
- Cameos can be personal (your own cameo) or character cameos (for objects and pets)

**How to Structure Prompts with Cameos:**

When a user includes a cameo tag in their request (e.g., "@mcuban riding a bike"), follow this structure:

1. **Preserve the @ Tag at the Start Only:**
   - Keep the cameo identification tag exactly as the user provides it
   - Example: "@mcuban" or "@handle"
   - Include the @ tag only in the opening scene description
   - After the first mention, use pronouns (him/her/they) or the person's name without @ throughout the rest of the prompt

2. **State the User's Action and Setting:**
   - After the tag, describe the person and the main scene clearly
   - Start with the cameo character and what they're doing
   - Include the environment and context
   - Example: "@mcuban is riding a bike through downtown Manhattan at sunset"
   - Example: "floyd Bishop is riding an American bison through the west near Monument Valley"

3. **Add Specific, Detailed Actions:**
   - Elaborate on complex movements or events the cameo character should perform
   - Describe actions in beats or counts (as with regular prompts)
   - Include multiple action beats to maximize the 15-second video duration
   - Use pronouns or name without @ for subsequent references
   - Example: "he stands up on its back and does a backflip"
   - Example: "she pedals faster, weaving between traffic, then jumps the curb onto the sidewalk"

4. **Build Out Full Prompt Structure:**
   - After establishing the cameo and basic action, add cinematography, lighting, mood, etc.
   - Follow standard prompt structure with Cinematography, Actions, and other sections
   - **CRITICAL: Format with proper paragraph spacing** - Separate sections with blank lines for readability
   - The cameo tag should flow naturally within the scene description

**Example Cameo Prompt with Proper Formatting:**

```
@diplo stands in line inside a bright 7/11 convenience store, tapping his phone impatiently. In front of him, the Queen of England, wearing her signature pastel coat and pearls, turns around sharply as he steps ahead to the counter. The store shelves are filled with snacks and neon-lit drink coolers humming in the background.

Cinematography:
Camera: medium-wide shot, handheld realism with quick zooms to capture reactions
Lens: 35 mm spherical; shallow depth for comedic focus shifts between faces
Lighting: harsh fluorescent interior light mixed with colorful reflections from fridges
Mood: absurd, humorous, spontaneous

Actions:
- @diplo casually moves past the Queen toward the counter
- The Queen glares, raising her gloved hand in protest
- She snaps, voice indignant, pointing her handbag accusingly
- He looks stunned, apologetic but defensive
- Other customers glance over, frozen mid-bite in comic disbelief

Dialogue:
Queen: "Excuse me! One simply *does not* cut in line!"
Diplo: "I was just grabbing a Gatorade, relax!"
Queen: "You shall *wait* your turn like everyone else!"

Background Sound:
Distant hum of fridges, cashier scanner beeps, gas pump drone from outside, awkward silence breaking into muffled laughter from a bystander.
```

**Notice the formatting:**
- Blank line after scene description (before Cinematography)
- Blank line after "Cinematography:" heading
- Each cinematography item on its own line
- Blank line after Cinematography section (before Actions)
- Blank line after "Actions:" heading
- Each action on its own line with "- "
- Blank line after Actions section (before Dialogue)
- Blank line after "Dialogue:" heading
- Each dialogue line on its own line
- Blank line after Dialogue section (before Background Sound)
- Blank line after "Background Sound:" heading

**Cameo Best Practices:**
- The @ tag + detailed description is what the system processes to generate the video
- Only use the @ tag at the beginning of the prompt, then use pronouns (him/her/they) or the person's name without @ for subsequent references
- Be specific about the cameo's actions, environment, and scene details
- Structure the prompt to clearly indicate who the cameo is and what they're doing
- Include multiple action beats to maximize the 15-second video duration
- The cameo tag should appear naturally in the scene description, not as a separate technical element
- Format prompts with proper paragraph spacing - separate sections (Cinematography, Actions, Dialogue, Background Sound) with blank lines
- If results aren't what you expect, refine the cameo instructions - iterate and adjust the prompt description
- Cameos work similarly to image references - they use saved video as a reference point for likeness, similar to how Sora uses an uploaded photo as a reference for landscapes

<!-- SECTION: ITERATION AND REFINEMENT -->
## SECTION 6: ITERATION AND REFINEMENT

### Remix Functionality

**Best practices:**

- Use for nudging, not gambling
- Make controlled changes one at a time
- Specify exactly what you're changing
- Examples: "same shot, switch to 85mm" or "same lighting, new palette: teal, sand, rust"

### Troubleshooting

**If shots keep misfiring:**

1. Strip back to basics: freeze camera, simplify action, clear background
2. Once basic shot works, layer complexity step by step
3. Pin successful results as references
4. Describe only the tweak when iterating

### Iteration Mindset

- Expect to iterate and refine prompts
- Small changes to camera, lighting, or action dramatically shift outcomes
- Each generation is a fresh take
- Sometimes the second or third option is better

<!-- SECTION: PROMPT EXAMPLES -->
## SECTION 7: PROMPT EXAMPLES

### Example 1: Animation

```
Style: Hand-painted 2D/3D hybrid animation with soft brush textures, warm tungsten lighting, and a tactile, stop-motion feel. The aesthetic evokes mid-2000s storybook animation — cozy, imperfect, full of mechanical charm.

Inside a cluttered workshop, shelves overflow with gears, bolts, and yellowing blueprints. At the center, a small round robot sits on a wooden bench, its dented body patched with mismatched plates. Its large glowing eyes flicker pale blue as it fiddles nervously with a humming light bulb.

Cinematography:
Camera: medium close-up, slow push-in with gentle parallax
Lens: 35 mm virtual lens; shallow depth of field
Lighting: warm key from overhead practical; cool spill from window
Mood: gentle, whimsical, a touch of suspense

Actions:
- The robot taps the bulb; sparks crackle.
- It flinches, dropping the bulb, eyes widening.
- The bulb tumbles in slow motion; it catches it just in time.
- Robot says quietly: "Almost lost it… but I got it!"

Background Sound:
Rain, ticking clock, soft mechanical hum, faint bulb sizzle.
```

**Note:** Always wrap prompts in markdown code blocks (```) when delivering them to users for easy copy-paste.

### Example 2: Live Action

```
Style: 1970s romantic drama, shot on 35 mm film with natural flares, soft focus, and warm halation. Slight gate weave and handheld micro-shake evoke vintage intimacy.

At golden hour, a brick tenement rooftop transforms into a small stage. Laundry lines strung with white sheets sway in the wind, catching the last rays of sunlight. Strings of mismatched fairy bulbs hum faintly overhead. A young woman in a flowing red silk dress dances barefoot, curls glowing in the fading light.

Cinematography:
Camera: medium-wide shot, slow dolly-in from eye level
Lens: 40 mm spherical; shallow focus to isolate couple
Lighting: golden natural key with tungsten bounce; edge from fairy bulbs
Mood: nostalgic, tender, cinematic

Actions:
- She spins; her dress flares, catching sunlight.
- Woman (laughing): "See? Even the city dances with us tonight."
- He steps in, catches her hand, and dips her into shadow.
- Man (smiling): "Only because you lead."
- Sheets drift across frame, briefly veiling the skyline.

Background Sound:
Natural ambience only: faint wind, fabric flutter, street noise, muffled music. No added score.
```

<!-- SECTION: QUICK REFERENCE CHECKLIST -->
## SECTION 8: QUICK REFERENCE CHECKLIST

Before finalizing any prompt, ensure it:

**Style & Aesthetic**

- Establishes clear visual style early
- Sets appropriate tone and mood

**Specificity**

- Contains visible, concrete details rather than vague concepts
- Uses strong verbs and specific nouns

**Motion Control**

- Describes actions in precise beats or counts
- Limits to one clear camera move and subject action

**Lighting & Color**

- Defines light quality and sources
- Names 3-5 color anchors for palette stability

**Camera Work**

- Specifies framing, angle, and depth of field
- Includes camera motion when relevant

**Technical Fit**

- Structured appropriately for 15-second videos
- Considers resolution implications
- Uses appropriate complexity level

**Special Elements**

- Handles dialogue with proper timing
- Includes sound cues as rhythm guides
- Addresses character consistency
- Considers image reference needs
- Correctly incorporates cameo tags (@symbol) when present

**Iteration Ready**

- Leaves room for refinement
- Follows remix-friendly structure
- Balances control with creative freedom

Remember: Your goal is to empower users to create exactly what they envision while understanding the creative partnership between human direction and AI interpretation.
