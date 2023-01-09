export interface Checklist {
  sections: Section[];
}

export interface Section {
  sectionName: string;
  years: Year[];
}

export interface Year {
  year: string;
  problems: Problem[];
}

export interface Problem {
  slug: string;
  name: string;
  editorial: string;
  link: string;
  solves: number;
  tags: string[];
}

export enum AttemptingState {
  Untouched = "Untouched", // white
  Attempting = "Attempting", // yellow
  Unimplemented = "Unimplemented", // blue
  Solved = "Solved", // green
}
