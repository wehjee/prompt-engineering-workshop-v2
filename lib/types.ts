export interface Chapter {
  id: number;
  title: string;
  part: "beginner" | "intermediate" | "advanced";
  partLabel: string;
  description: string;
  sections: Section[];
}

export type Section =
  | TextSection
  | CodeSection
  | PlaygroundSection
  | ExerciseSection;

export interface TextSection {
  type: "text";
  content: string;
}

export interface CodeSection {
  type: "code";
  language: string;
  code: string;
  title?: string;
}

export interface PlaygroundSection {
  type: "playground";
  title?: string;
  description?: string;
  defaultSystemPrompt?: string;
  defaultUserMessage: string;
  model?: string;
  temperature?: number;
}

export interface ExerciseSection {
  type: "exercise";
  title: string;
  description: string;
  defaultSystemPrompt?: string;
  defaultUserMessage: string;
  hint: string;
  validation: {
    type: "contains" | "regex";
    pattern: string;
    flags?: string;
  };
}
