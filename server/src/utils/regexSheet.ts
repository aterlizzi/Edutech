export const newLineRegex = /\r?\n|\r|\f/g;
export const removeSpacesRegex = /\s/g;
export const gpaScoreRegex = /\d*\.\d*\/\d*/gm;
export const gpaScoreTypeRegex = /\d*\.\d*\/\d*,/gm;
export const graduationDateRegex = /\d*\/\d*/gm;
export const classRankRegex = /\d*\/\d*/gm;
export const classRankTypeRegex = /\d*\/\d*,/gm;
export const honorRegex = /(?<=\s\s)[a-zA-Z|\s]*(?=\s\s)/gm;
export const spaceRegex = /  |\n/gm;
export const honorTypeRegex =
  /\/National|\/School\/|\/State\/Regional\/|\/International\//gm;
export const satRegex = /(?<=\s\s)\d* \d*/gm;
export const apScoresRegex = /(?<=Yes|No).*/gm;
export const apSubjectsRegex = /AP Subject Tests/gm;
export const additionalInfoRegex = /(?<=Additional Information\s\s).*/gm;
export const nameRegex = /.*, [a-zA-z|']*/gm;
export const ceebRegex = /CEEB: \d*/gm;
export const caidRegex = /CAID: \d*/gm;
export const seasonRegex = /Fall \d*|Spring \d*/gm;
export const fyrdRegex = /[A-Z][A-Z] [A-Z][A-Z]/gm;

export const essayPromptRegex =
  /Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.|The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?|Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?|Describe a problem you've solved or a problem you'd like to solve. It can be an intellectual challenge, a research query, an ethical dilemma-anything that is of personal importance, no matter the scale. Explain its significance to you and what steps you took or could be taken to identify a solution.|Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.|Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?|Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design./gm;
