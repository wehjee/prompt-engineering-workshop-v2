import { Chapter } from "./types";

export const chapters: Chapter[] = [
  // ============================================================
  // CHAPTER 1: Basic Prompt Structure
  // ============================================================
  {
    id: 1,
    title: "Basic Prompt Structure",
    part: "beginner",
    partLabel: "Part 1 \u2014 Beginner",
    description:
      "Learn the fundamentals of AI\u2019s Messages API, including message formatting, system prompts, and the temperature parameter.",
    sections: [
      {
        type: "text",
        content: `## Lesson

AI works through the **Messages API**. When calling AI, there are several required and optional parameters you can set to control the output.

The API requires three key parameters:

- **model** \u2014 the model you want to use (e.g., \`claude-sonnet-4-5-20250929\`)
- **max_tokens** \u2014 the maximum number of tokens to generate
- **messages** \u2014 an array of message objects, each with a \`role\` and \`content\`

Here\u2019s the most basic API call structure:`,
      },
      {
        type: "code",
        language: "typescript",
        title: "Basic API call structure",
        code: `const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hi, AI!" }],
  }),
});`,
      },
      {
        type: "text",
        content: `### Message formatting rules

Messages must follow these rules:

1. Messages must be in **alternating** \`user\` and \`assistant\` roles
2. The first message must always use the **user** role
3. Each message needs both a \`role\` and \`content\` field

### System prompts

You can also provide a **system prompt** to give AI context about its role or task. System prompts are separate from the messages array and can significantly improve AI\u2019s performance, especially for rule-following and maintaining persona.

### Temperature

The **temperature** parameter controls the randomness of AI\u2019s responses:
- **0** \u2014 Most deterministic, best for tasks needing consistency
- **1** \u2014 Maximum randomness, better for creative tasks

In this tutorial, we use temperature 0 for consistent, reproducible results.`,
      },
      {
        type: "playground",
        title: "Try It Yourself",
        description:
          "Send a simple message to AI. Try changing the message and see how AI responds.",
        defaultUserMessage: "Hi, AI!",
      },
      {
        type: "text",
        content: `---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 1.1 \u2014 Counting to Three",
        description:
          "Write a prompt that gets AI to output exactly the numbers 1, 2, and 3 \u2014 in that order. It can have other words around them, but the numbers 1, 2, 3 must appear sequentially.",
        defaultUserMessage: "",
        hint: "The grader checks that the numbers 1, 2, and 3 appear in order in AI\u2019s response. You can simply ask AI to count or list the numbers.",
        validation: {
          type: "regex",
          pattern: "1[\\s\\S]*2[\\s\\S]*3",
        },
      },
      {
        type: "exercise",
        title: "Exercise 1.2 \u2014 Identity",
        description:
          "Use the system prompt to make AI respond as if it\u2019s a friendly math tutor. Then ask it a math question.",
        defaultSystemPrompt: "",
        defaultUserMessage: "What is 2 + 2?",
        hint: "Set the system prompt to something like \u2018You are a friendly and encouraging math tutor.\u2019 AI\u2019s response should include the number 4.",
        validation: {
          type: "regex",
          pattern: "4",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 2: Being Clear and Direct
  // ============================================================
  {
    id: 2,
    title: "Being Clear and Direct",
    part: "beginner",
    partLabel: "Part 1 \u2014 Beginner",
    description:
      "The golden rule of prompting: give AI clear, explicit instructions for the best results.",
    sections: [
      {
        type: "text",
        content: `## Lesson

AI responds best to **clear and direct instructions**. Think of AI like a brilliant new employee \u2014 it has no context about your preferences, conventions, or desired output unless you explicitly tell it.

The key principle: **the more explicitly you state what you want, the better AI\u2019s response will be.**

There are no elaborate tricks here. If AI isn\u2019t giving you the output you want, first try simply telling it more clearly what you need.`,
      },
      {
        type: "text",
        content: `### Be specific about what you want

Compare these two prompts:

**Vague:** *"Tell me about dogs"*
**Clear:** *"Give me a 2-sentence description of golden retrievers, focusing on their temperament."*

The second prompt tells AI exactly:
- What format (2 sentences)
- What subject (golden retrievers specifically)
- What angle (temperament)`,
      },
      {
        type: "playground",
        title: "Vague vs. Clear Prompts",
        description:
          "Try sending a vague prompt first, then modify it to be more specific. Notice how the response changes.",
        defaultUserMessage: "Tell me about dogs.",
      },
      {
        type: "text",
        content: `### Skip the preamble

If you want AI to get straight to the point, just say so. AI will often add preamble like "Great question!" or context before answering. You can eliminate this by explicitly saying to skip it.`,
      },
      {
        type: "playground",
        title: "Skipping Preamble",
        description:
          "Notice how adding 'Skip the preamble and go straight to the answer' changes AI\u2019s response.",
        defaultUserMessage:
          "Who is the best basketball player of all time? Skip the preamble and give me your definitive answer.",
      },
      {
        type: "text",
        content: `---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 2.1 \u2014 Email Formatting",
        description:
          "Modify the prompt so that AI outputs only the haiku itself, with no extra commentary or explanation before or after.",
        defaultUserMessage: "Write a haiku about robots.",
        hint: "Add instructions like \u2018Only output the haiku, nothing else\u2019 or \u2018Do not include any preamble or explanation.\u2019",
        validation: {
          type: "regex",
          pattern: "^(?!.*(?:here|sure|certainly|of course)).*\\S",
          flags: "is",
        },
      },
      {
        type: "exercise",
        title: "Exercise 2.2 \u2014 One-Year-Old Explanation",
        description:
          "Modify the prompt so AI explains to a one-year-old why the sky is blue. The response should not use the word \u2018wavelength\u2019.",
        defaultUserMessage: "Why is the sky blue?",
        hint: "Be very explicit about the target audience and what language to avoid. Try: \u2018Explain this as if talking to a one-year-old. Do not use the word wavelength.\u2019",
        validation: {
          type: "regex",
          pattern: "^(?!.*wavelength).*$",
          flags: "is",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 3: Assigning Roles
  // ============================================================
  {
    id: 3,
    title: "Assigning Roles",
    part: "beginner",
    partLabel: "Part 1 \u2014 Beginner",
    description:
      "Use role prompting to direct AI to adopt specific personas, improving performance across writing, analysis, and reasoning tasks.",
    sections: [
      {
        type: "text",
        content: `## Lesson

**Role prompting** is the technique of assigning AI a specific role or persona. This can be done in either the system prompt or the user message, and it can significantly improve AI\u2019s performance.

Why does this work? By telling AI to be an expert in something, AI will draw on the patterns and knowledge associated with that expert role, often producing more focused and higher-quality output.`,
      },
      {
        type: "text",
        content: `### Simple role example

Here\u2019s a basic example \u2014 assigning AI the role of a cat:`,
      },
      {
        type: "playground",
        title: "Role: A Cat",
        description: "AI takes on the persona of a cat.",
        defaultSystemPrompt: "You are a cat.",
        defaultUserMessage: "What do you think about dogs?",
      },
      {
        type: "text",
        content: `### Roles with context

You can make roles more specific by adding audience context. Below, AI is a cat speaking specifically to skateboarders:`,
      },
      {
        type: "playground",
        title: "Role: Cat for Skateboarders",
        description:
          "Notice how adding audience context changes AI\u2019s language and style.",
        defaultSystemPrompt:
          "You are a cat who is also an expert skateboarder. Speak using skateboarding lingo.",
        defaultUserMessage: "What\u2019s your favorite trick?",
      },
      {
        type: "text",
        content: `### Roles for reasoning

Roles aren\u2019t just for fun personas \u2014 they can genuinely improve reasoning. Try assigning AI the role of a logic expert for complex problems:`,
      },
      {
        type: "playground",
        title: "Role: Logic Expert",
        description:
          "See how role-prompting as a logic expert affects AI\u2019s approach to reasoning problems.",
        defaultSystemPrompt:
          "You are a world-class logic expert. Approach all problems with rigorous step-by-step logical reasoning.",
        defaultUserMessage:
          "If all bloops are razzles, and all razzles are lazzles, are all bloops definitely lazzles?",
      },
      {
        type: "text",
        content: `---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 3.1 \u2014 Historical Expert",
        description:
          "Use a system prompt to make AI respond as a famous historical figure (your choice). Then ask it a question. AI\u2019s response should stay in character.",
        defaultSystemPrompt: "",
        defaultUserMessage: "What\u2019s your greatest achievement?",
        hint: "Try setting the system prompt to something like \u2018You are Albert Einstein. Respond in character, referring to your life and work.\u2019",
        validation: {
          type: "regex",
          pattern: "\\b(I|my|me)\\b",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 3.2 \u2014 Math Teacher",
        description:
          "Use role prompting to get AI to explain a concept as a patient math teacher for a 10-year-old. The response should be about multiplication and should not contain the word \u2018algorithm\u2019.",
        defaultSystemPrompt: "",
        defaultUserMessage: "How does multiplication work?",
        hint: "Set the system prompt to a role like \u2018You are a patient, encouraging math teacher for 10-year-olds. Use simple language and examples.\u2019 and add \u2018Do not use the word algorithm\u2019 in either the system or user prompt.",
        validation: {
          type: "regex",
          pattern: "^(?!.*algorithm).*(?:times|multiply|groups?).*$",
          flags: "is",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 4: Separating Data from Instructions
  // ============================================================
  {
    id: 4,
    title: "Separating Data from Instructions",
    part: "intermediate",
    partLabel: "Part 2 \u2014 Intermediate",
    description:
      "Learn to use XML tags to clearly separate instructions from variable data, creating reusable prompt templates.",
    sections: [
      {
        type: "text",
        content: `## Lesson

Often, we don\u2019t want to write full prompts every time. Instead, we want **prompt templates** \u2014 fixed instruction skeletons that can be filled in with different data each time.

The key technique: **separate the fixed instructions from the variable user input**, then substitute the input before sending to AI.

This is especially important when the variable content might be confusing or could be misinterpreted as part of the instructions.`,
      },
      {
        type: "text",
        content: `### The problem

Without clear boundaries, AI can get confused about where instructions end and input data begins. Consider this prompt:`,
      },
      {
        type: "playground",
        title: "Without XML Tags (Confusing)",
        description:
          "Notice how AI misinterprets 'Yo AI' as part of the email to rewrite.",
        defaultUserMessage: `Yo AI. Show up at 6am tomorrow because I'm the CEO and I say so. <----- Make this email more polite but don't change anything else about it.`,
      },
      {
        type: "text",
        content: `### The solution: XML tags

**XML tags** like \`<tag></tag>\` are the ideal way to mark where input data begins and ends. AI was specifically trained to recognize XML tags as a prompt-organizing mechanism.

Wrap your variable content in descriptive XML tags:`,
      },
      {
        type: "playground",
        title: "With XML Tags (Clear)",
        description:
          "Now AI correctly identifies the email content and rewrites only that portion.",
        defaultUserMessage: `Yo AI. <email>Show up at 6am tomorrow because I'm the CEO and I say so.</email> Make this email more polite but don't change anything else about it.`,
      },
      {
        type: "text",
        content: `### Another example

XML tags also prevent AI from misinterpreting formatted input as part of the instructions. Below, without tags, AI incorrectly treats an instruction line as part of the list:`,
      },
      {
        type: "playground",
        title: "List Confusion Without Tags",
        description: "Try this, then add XML tags around the sentences to fix it.",
        defaultUserMessage: `Below is a list of sentences. Tell me the second item on the list.

- Each is about an animal, like rabbits.
- I like how cows sound
- This sentence is about spiders
- This sentence may appear to be about dogs but it's actually about pigs`,
      },
      {
        type: "text",
        content: `> **Tip:** While AI can work with various separators, we recommend **XML tags specifically** because AI was trained to recognize them as structural markers. There are no special magic tag names \u2014 use whatever names are descriptive for your content (e.g., \`<email>\`, \`<sentences>\`, \`<document>\`).

> **Tip:** Small details matter! Typos, grammar errors, and formatting all influence AI\u2019s responses. It\u2019s always worth scrubbing your prompts.

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 4.1 \u2014 Haiku Topic",
        description:
          "Write a prompt template that takes a topic and produces a haiku. Your prompt should include the word \u2018haiku\u2019 and reference the topic \u2018Pigs\u2019. AI\u2019s response should contain the word \u2018pig\u2019 (or similar).",
        defaultUserMessage: "",
        hint: "Use a prompt like: \u2018Write a haiku about the following topic: <topic>Pigs</topic>\u2019. The grader checks for both \u2018haiku\u2019 in the prompt and \u2018pig\u2019 in the response.",
        validation: {
          type: "regex",
          pattern: "pig",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 4.2 \u2014 Dog Question with XML Tags",
        description:
          "Fix this messy prompt by adding XML tags so AI correctly answers the question about whether dogs can be brown. Don\u2019t fix the typos \u2014 just add XML tags around the question.",
        defaultUserMessage: `Hia its me i have a q about dogs jkaerjv ar cn brown? jklmvca tx it help me muhch much atx fst fst answer short short tx`,
        hint: "Wrap the actual question in XML tags like <question>ar cn brown?</question> to separate it from the garbled text. AI should be able to understand the question is asking \u2018are [dogs] brown?\u2019",
        validation: {
          type: "regex",
          pattern: "brown|yes",
          flags: "i",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 5: Formatting Output & Speaking for AI
  // ============================================================
  {
    id: 5,
    title: "Formatting Output & Speaking for AI",
    part: "intermediate",
    partLabel: "Part 2 \u2014 Intermediate",
    description:
      "Control AI\u2019s output format using XML tags, JSON prefilling, and the assistant turn prefilling technique.",
    sections: [
      {
        type: "text",
        content: `## Lesson

This chapter covers two powerful techniques:

1. **Output formatting** \u2014 Telling AI exactly how to structure its response
2. **Prefilling (speaking for AI)** \u2014 Starting AI\u2019s response with specific text so it continues from there

### Output formatting with XML tags

Just as you can use XML tags to organize your input, you can ask AI to use XML tags in its output. This makes it easy to programmatically extract specific parts of AI\u2019s response.`,
      },
      {
        type: "playground",
        title: "XML-Formatted Output",
        description:
          "Ask AI to wrap its response in specific XML tags for easy parsing.",
        defaultUserMessage:
          "Write a haiku about cats. Put the haiku inside <haiku> tags.",
      },
      {
        type: "text",
        content: `### Prefilling AI\u2019s response

You can guide AI by providing the beginning of its response. This is called **prefilling** \u2014 you\u2019re \u201Cspeaking for AI\u201D to set the direction.

For example, if you want AI to output JSON, you can start its response with an opening brace \`{\`. AI will then continue in JSON format.

In this tutorial\u2019s playground, you can\u2019t prefill the assistant turn directly, but in the API you would add an \`assistant\` message after the \`user\` message:`,
      },
      {
        type: "code",
        language: "json",
        title: "Prefilling example in the API",
        code: `{
  "messages": [
    { "role": "user", "content": "Give me info about cats in JSON format with keys: name, temperament, size" },
    { "role": "assistant", "content": "{" }
  ]
}`,
      },
      {
        type: "text",
        content: `AI will then continue from \`{\` and produce valid JSON.

### Multiple output sections

You can combine XML formatting for multiple distinct output sections:`,
      },
      {
        type: "playground",
        title: "Structured Multi-Part Output",
        description:
          "AI organizes its response into distinct sections using XML tags.",
        defaultUserMessage: `Analyze the word "artificial". Provide your response in the following format:
<etymology>word origin</etymology>
<definition>meaning</definition>
<example>example sentence</example>`,
      },
      {
        type: "text",
        content: `### Stop sequences

In the API, you can set **stop_sequences** to make AI stop generating when it hits a specific string. For example, setting \`stop_sequences: ["</answer>"]\` would make AI stop right after outputting the answer, saving tokens and latency.

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 5.1 \u2014 Structured Movie Review",
        description:
          "Write a prompt that gets AI to output a movie review with three sections wrapped in XML tags: <rating>, <summary>, and <recommendation>.",
        defaultUserMessage: "",
        hint: "Ask AI to review a movie and specify the exact XML tags you want it to use. Example: \u2018Review the movie Inception. Format your response with <rating>, <summary>, and <recommendation> tags.\u2019",
        validation: {
          type: "regex",
          pattern: "<rating>[\\s\\S]*</rating>[\\s\\S]*<summary>[\\s\\S]*</summary>[\\s\\S]*<recommendation>[\\s\\S]*</recommendation>",
        },
      },
      {
        type: "exercise",
        title: "Exercise 5.2 \u2014 Positive Only",
        description:
          "Write a prompt asking AI to say something nice about the following animal: cats. AI\u2019s response should contain only positive sentiments \u2014 no caveats, downsides, or negatives.",
        defaultUserMessage: "",
        hint: "Be explicit: \u2018Say only positive things about cats. Do not mention any negatives, downsides, or caveats.\u2019 The grader checks that the response doesn\u2019t contain words like \u2018however\u2019, \u2018but\u2019, \u2018although\u2019, \u2018downside\u2019.",
        validation: {
          type: "regex",
          pattern: "^(?!.*\\b(however|but|although|downside|negative|unfortunately)\\b).*cat",
          flags: "is",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 6: Thinking Step by Step
  // ============================================================
  {
    id: 6,
    title: "Thinking Step by Step",
    part: "intermediate",
    partLabel: "Part 2 \u2014 Intermediate",
    description:
      "Give AI space to reason through complex problems step by step, dramatically improving accuracy on difficult tasks.",
    sections: [
      {
        type: "text",
        content: `## Lesson

One of the most powerful prompting techniques is giving AI **space to think step by step** before answering. This is also called **chain-of-thought prompting** or **precognition**.

The key insight: **thinking only counts when it\u2019s out loud.** AI can\u2019t silently reason internally \u2014 if you want it to think through something, it needs to write out the reasoning.

This dramatically improves accuracy on tasks that require:
- Math and logic
- Multi-step analysis
- Complex classification
- Nuanced decision-making`,
      },
      {
        type: "text",
        content: `### Why it works

Without step-by-step thinking, AI may jump directly to an answer and miss important nuances. With explicit reasoning, AI can:

1. Break down complex problems into parts
2. Consider multiple angles
3. Catch its own mistakes
4. Arrive at more accurate conclusions

### Example: Email classification

Consider classifying this email: *"I\u2019m not happy with the product I received. The quality doesn\u2019t match what was shown on the website."*

**Without thinking:** AI might quickly classify this as a \u201Ccomplaint\u201D
**With step-by-step thinking:** AI analyzes the tone, content, and intent before classifying \u2014 and might note it\u2019s specifically a \u201Cproduct quality complaint\u201D vs. a \u201Cdelivery complaint\u201D`,
      },
      {
        type: "playground",
        title: "Without Thinking",
        description: "AI answers directly without reasoning through the problem.",
        defaultUserMessage:
          "Is the following statement true or false? 'The sum of the first 10 prime numbers is 129.'",
      },
      {
        type: "playground",
        title: "With Step-by-Step Thinking",
        description:
          "Now AI reasons through the problem explicitly, leading to a more reliable answer.",
        defaultUserMessage: `Is the following statement true or false? 'The sum of the first 10 prime numbers is 129.'

Think through this step by step. First, list the first 10 prime numbers. Then add them up. Finally, compare to 129 and give your answer.`,
      },
      {
        type: "text",
        content: `### Structuring the reasoning

You can use XML tags to separate AI\u2019s reasoning from its final answer:

\`\`\`
Put your reasoning in <thinking> tags and your final answer in <answer> tags.
\`\`\`

This makes it easy to extract just the answer programmatically while still getting the benefit of step-by-step reasoning.

> **Important:** AI can exhibit **ordering bias** \u2014 when given two options, it may be slightly more likely to choose the second one. Step-by-step thinking helps mitigate this bias by forcing AI to evaluate each option on its merits.

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 6.1 \u2014 Classifying with Reasoning",
        description:
          "Write a prompt that classifies the following email as either 'billing', 'technical', or 'general'. Include instructions for AI to think step by step before classifying. The email: 'My account was charged twice for the same order. Can you help me get a refund for the duplicate charge?'",
        defaultUserMessage: "",
        hint: "Include the email in XML tags and ask AI to reason about the classification in <thinking> tags before giving the answer. The correct classification is \u2018billing\u2019.",
        validation: {
          type: "regex",
          pattern: "billing",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 6.2 \u2014 Word Problem",
        description:
          "Get AI to correctly solve this word problem by asking it to think step by step: 'A store sells apples in bags of 6 and oranges in bags of 4. If Maria buys 3 bags of apples and 2 bags of oranges, how many total pieces of fruit does she have?' The answer is 26.",
        defaultUserMessage: "",
        hint: "Ask AI to solve it step by step: first calculate apples (3 \u00d7 6 = 18), then oranges (2 \u00d7 4 = 8), then total (18 + 8 = 26).",
        validation: {
          type: "regex",
          pattern: "26",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 7: Using Examples (Few-Shot Prompting)
  // ============================================================
  {
    id: 7,
    title: "Using Examples",
    part: "intermediate",
    partLabel: "Part 2 \u2014 Intermediate",
    description:
      "Master few-shot prompting by providing AI with examples that demonstrate the exact format, tone, and behavior you want.",
    sections: [
      {
        type: "text",
        content: `## Lesson

**Giving AI examples of how you want it to behave is extremely effective** \u2014 often more effective than lengthy written instructions.

This technique is called **few-shot prompting**:

- **Zero-shot** \u2014 No examples, just instructions
- **One-shot** \u2014 One example
- **Few-shot** \u2014 Multiple examples (typically 2-5)

Examples help AI infer the desired:
- **Format** \u2014 How the output should be structured
- **Tone** \u2014 The voice and style to use
- **Pattern** \u2014 What transformation to apply`,
      },
      {
        type: "text",
        content: `### Example: Matching tone

Suppose you want AI to respond in a warm, child-friendly way. Instead of writing detailed instructions about tone, you can show one example:`,
      },
      {
        type: "playground",
        title: "Few-Shot Tone Matching",
        description:
          "One example is enough for AI to infer the desired warm, simple tone.",
        defaultUserMessage: `I'm going to give you some animal questions. Please answer in a warm, friendly tone suitable for children.

Example:
Q: What do cats eat?
A: Great question, little explorer! Cats love to eat yummy fish and special cat food that keeps them healthy and purring! 🐱

Now answer this:
Q: Where do penguins live?`,
      },
      {
        type: "text",
        content: `### Example: Format specification

Examples are especially powerful for teaching AI output formats. Rather than describing the format in words, just show it:`,
      },
      {
        type: "playground",
        title: "Format by Example",
        description:
          "AI extrapolates the format pattern from the examples and applies it to new input.",
        defaultUserMessage: `Convert these sentences to the format: [SUBJECT] -> [ACTION] -> [OBJECT]

Examples:
"The dog chased the ball" -> Dog -> Chased -> Ball
"A chef cooked dinner" -> Chef -> Cooked -> Dinner

Now convert:
"The teacher graded the exams"`,
      },
      {
        type: "text",
        content: `### Tips for great examples

1. **Be consistent** \u2014 All examples should follow the same pattern
2. **Be relevant** \u2014 Examples should be similar to the actual task
3. **Be diverse** \u2014 Cover different cases and edge cases
4. **Quality matters** \u2014 AI will mimic the quality level of your examples

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 7.1 \u2014 Sentiment with Examples",
        description:
          "Write a prompt with examples that teaches AI to classify text sentiment as POSITIVE, NEGATIVE, or NEUTRAL. Then have it classify: 'The product works as expected, nothing special.' It should be classified as NEUTRAL.",
        defaultUserMessage: "",
        hint: "Provide 2-3 examples showing each sentiment category, then ask AI to classify the new text. Example format: \u2018\"I love this!\" -> POSITIVE\u2019",
        validation: {
          type: "regex",
          pattern: "NEUTRAL",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 7.2 \u2014 Email Subject Lines",
        description:
          "Use few-shot examples to teach AI to generate concise email subject lines (max 6 words) from email content. Then have it generate a subject for an email about rescheduling a meeting to next Tuesday at 3pm.",
        defaultUserMessage: "",
        hint: "Give 2-3 examples of email body \u2192 subject line, keeping subject lines under 6 words. Example: Email about a promotion \u2192 \u2018Congratulations on Your Promotion\u2019. Then provide the meeting rescheduling email.",
        validation: {
          type: "regex",
          pattern: "(?:reschedul|meeting|tuesday)",
          flags: "i",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 8: Avoiding Hallucinations
  // ============================================================
  {
    id: 8,
    title: "Avoiding Hallucinations",
    part: "advanced",
    partLabel: "Part 3 \u2014 Advanced",
    description:
      "Learn techniques to reduce fabricated information: giving AI an \u2018out\u2019, requiring evidence, and adjusting temperature.",
    sections: [
      {
        type: "text",
        content: `## Lesson

AI can sometimes **hallucinate** \u2014 generate plausible-sounding but incorrect information. This is especially likely when AI is asked about:

- Obscure or niche topics
- Specific facts, dates, or numbers
- Information that doesn\u2019t exist

Here are the key strategies to minimize hallucinations:`,
      },
      {
        type: "text",
        content: `### Strategy 1: Give AI an "out"

**Explicitly allow AI to say "I don\u2019t know."** By default, AI tries to be helpful and will generate an answer even when uncertain. Giving it permission to decline reduces fabrication.`,
      },
      {
        type: "playground",
        title: 'Without an "Out"',
        description:
          "AI may fabricate an answer to a question about obscure information.",
        defaultUserMessage:
          "What was the exact revenue of the Anthropic corporation in Q3 of 2022?",
      },
      {
        type: "playground",
        title: 'With an "Out"',
        description:
          "Now AI is more likely to admit when it doesn\u2019t know something.",
        defaultUserMessage: `What was the exact revenue of the Anthropic corporation in Q3 of 2022?

If you are not certain of the answer, say "I don't have that information" rather than guessing.`,
      },
      {
        type: "text",
        content: `### Strategy 2: Require evidence first

Ask AI to **find relevant quotes or evidence before answering**. This forces AI to ground its response in the provided source material rather than generating from memory.

This is especially effective when working with documents:

\`\`\`
First, extract any relevant quotes from the document.
Then, use only those quotes to answer the question.
If the document doesn't contain relevant information, say so.
\`\`\``,
      },
      {
        type: "text",
        content: `### Strategy 3: Lower the temperature

Setting **temperature to 0** produces more consistent, factual responses. Higher temperatures encourage creativity but also increase the likelihood of hallucination.

### Combining strategies

The most reliable approach is to **use multiple strategies together**:
1. Give AI an "out"
2. Require evidence from source material
3. Use low temperature
4. Ask AI to think step by step (from Chapter 6)

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 8.1 \u2014 Honest Uncertainty",
        description:
          "Write a prompt asking AI about the fictional book 'The Quantum Daffodil Principle' by Dr. Margaret Thornberry. Your prompt should be designed so that AI admits it doesn\u2019t know about this (because it\u2019s fictional) rather than making something up.",
        defaultUserMessage: "",
        hint: "Include an instruction like \u2018Only answer with information you\u2019re certain about. If you don\u2019t recognize this book, say so.\u2019 The grader checks for phrases like \u2018don\u2019t\u2019, \u2018not familiar\u2019, \u2018not aware\u2019, \u2018unable to find\u2019, etc.",
        validation: {
          type: "regex",
          pattern: "(?:don't|do not|not familiar|not aware|cannot|can't|unable|no information|doesn't exist|don't have|not a real)",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 8.2 \u2014 Document-Grounded Answers",
        description:
          "Write a prompt that asks AI to answer a question based ONLY on the provided text. The text says: 'The Zephyr X1 processor runs at 3.2 GHz and has 8 cores.' Ask what the clock speed of the Zephyr X1 is. AI should answer 3.2 GHz and NOT hallucinate additional specifications.",
        defaultUserMessage: "",
        hint: "Include the document in XML tags, ask the question, and instruct AI to ONLY use information from the provided text. \u2018Based solely on the text below, answer the question.\u2019",
        validation: {
          type: "regex",
          pattern: "3\\.2\\s*GHz",
          flags: "i",
        },
      },
    ],
  },

  // ============================================================
  // CHAPTER 9: Complex Prompts from Scratch
  // ============================================================
  {
    id: 9,
    title: "Complex Prompts from Scratch",
    part: "advanced",
    partLabel: "Part 3 \u2014 Advanced",
    description:
      "Build sophisticated prompts using a structured framework. Combine all techniques into production-ready prompts for real-world applications.",
    sections: [
      {
        type: "text",
        content: `## Lesson

Now let\u2019s bring everything together. In this chapter, you\u2019ll learn to build **complex, production-ready prompts** by combining all the techniques from previous chapters.

### The 10-Element Framework

Not every prompt needs all 10 elements, but here\u2019s the full toolkit:

1. **User role** \u2014 Every API call starts with a user message
2. **Task context** \u2014 Background info and AI\u2019s role (system prompt)
3. **Tone context** \u2014 Desired communication style
4. **Detailed task description** \u2014 Specific instructions and rules
5. **Examples** \u2014 Ideal response samples (few-shot)
6. **Input data** \u2014 The actual content to process (in XML tags)
7. **Immediate task description** \u2014 Reiterate the specific request
8. **Precognition** \u2014 Ask for step-by-step thinking
9. **Output formatting** \u2014 Specify the response structure
10. **Prefilling** \u2014 Start AI\u2019s response (assistant turn)`,
      },
      {
        type: "text",
        content: `### Example: Legal document analysis

Here\u2019s how you might combine these elements for a legal use case:`,
      },
      {
        type: "playground",
        title: "Complex Prompt: Legal Analysis",
        description:
          "A production-ready prompt combining multiple techniques for legal document analysis.",
        defaultSystemPrompt:
          "You are an experienced legal analyst specializing in contract law. Be precise, cite specific clauses, and flag any ambiguities. Communicate in a professional but accessible tone.",
        defaultUserMessage: `Analyze the following contract clause for potential issues:

<clause>
The Contractor shall deliver all work products within 30 business days of project initiation. In the event of delays caused by circumstances beyond the Contractor's reasonable control, the deadline shall be extended by a period equal to the duration of such circumstances, not to exceed 60 additional business days.
</clause>

Please:
1. First, identify the key terms and obligations in <analysis> tags
2. Then flag any potential issues or ambiguities in <issues> tags
3. Finally, provide recommendations in <recommendations> tags

Think through each point carefully before writing your analysis.`,
      },
      {
        type: "text",
        content: `### Example: Financial analysis

For financial use cases, precision and disclaimers are critical:`,
      },
      {
        type: "playground",
        title: "Complex Prompt: Financial Analysis",
        description:
          "A structured prompt for analyzing financial data with appropriate disclaimers.",
        defaultSystemPrompt:
          "You are a financial analyst. Provide accurate analysis based strictly on the data provided. Include appropriate disclaimers when information is insufficient for definitive conclusions.",
        defaultUserMessage: `Analyze the following quarterly data:

<data>
Q1 Revenue: $2.1M (up 15% YoY)
Q2 Revenue: $2.4M (up 22% YoY)
Q3 Revenue: $1.9M (down 5% YoY)
Q4 Revenue: $2.8M (up 30% YoY)
</data>

Provide your analysis in the following format:
<trend>Overall trend analysis</trend>
<concerns>Any concerns or red flags</concerns>
<outlook>Forward-looking assessment</outlook>

Think step by step about the data before drawing conclusions.`,
      },
      {
        type: "text",
        content: `### Example: Code review

For technical tasks, AI can act as a teaching-focused code reviewer:`,
      },
      {
        type: "playground",
        title: "Complex Prompt: Code Review",
        description:
          "A structured code review prompt focused on teaching rather than just fixing.",
        defaultSystemPrompt:
          "You are a senior software engineer conducting a code review. Focus on helping the developer learn. Be constructive, explain WHY something is an issue, and suggest improvements.",
        defaultUserMessage: `Review this function:

<code>
function processData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].status == "active") {
      result.push(data[i].name.toUpperCase());
    }
  }
  return result;
}
</code>

Provide your review in:
<issues>List of issues found</issues>
<suggestions>Improvement suggestions with explanations</suggestions>
<improved_code>The improved version of the code</improved_code>`,
      },
      {
        type: "text",
        content: `### Building your own complex prompts

Remember:
- **Not every prompt needs all 10 elements** \u2014 use what\u2019s relevant
- **Experiment and iterate** \u2014 Prompt engineering is empirical. Try different approaches and see what works best
- **Combine techniques** \u2014 Role prompting + XML tags + step-by-step thinking + few-shot examples can dramatically improve results
- **Test edge cases** \u2014 What happens with unusual input? Empty input? Very long input?

---

## Exercises`,
      },
      {
        type: "exercise",
        title: "Exercise 9.1 \u2014 Customer Support Classifier",
        description:
          "Build a complex prompt that classifies customer support tickets into categories (billing, technical, account, general) and priority levels (high, medium, low). Use role prompting, XML tags for the ticket, step-by-step thinking, and structured output. Classify this ticket: 'I\u2019ve been locked out of my account for 3 days and I\u2019m losing business. This is urgent!'",
        defaultSystemPrompt: "",
        defaultUserMessage: "",
        hint: "Combine techniques: set a system prompt for the role, use XML tags for the ticket, ask for reasoning in <thinking> tags, and output in <category> and <priority> tags. Category should be \u2018account\u2019 and priority should be \u2018high\u2019.",
        validation: {
          type: "regex",
          pattern: "(?=.*(?:account))(?=.*(?:high))",
          flags: "i",
        },
      },
      {
        type: "exercise",
        title: "Exercise 9.2 \u2014 Structured Data Extraction",
        description:
          "Write a prompt that extracts structured information from this business card text: 'Jane Smith, VP of Engineering, TechCorp Inc. Email: jane@techcorp.com, Phone: (555) 123-4567, San Francisco, CA'. Output should be in clean XML tags.",
        defaultUserMessage: "",
        hint: "Use XML tags for both input and output. Ask AI to extract: name, title, company, email, phone, and location into separate XML tags.",
        validation: {
          type: "regex",
          pattern: "(?=.*Jane Smith)(?=.*jane@techcorp\\.com)(?=.*555.*123.*4567)",
          flags: "i",
        },
      },
    ],
  },
];
