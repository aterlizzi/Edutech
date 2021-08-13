import { UserData } from "../entity/User";
import { MyContext } from "./../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const Filter = require("bad-words");
const filter = new Filter();

@Resolver()
export class GenerateIdeasResolver {
  @Mutation(() => [[String]], { nullable: true })
  async generateIdeas(
    @Arg("useCase") useCase: string,
    @Arg("prompt") prompt: string,
    @Arg("sensitive") sensitive: boolean,
    @Ctx() ctx: MyContext
  ): Promise<Array<string[]> | undefined> {
    const user = await UserData.findOne(ctx.req.session.userId);
    if (!user) return undefined;
    const cooldown = user.cooldown;
    if (!lessThanTenMinutesAgo(cooldown)) {
      user.cooldown = Date.now();
      user.totalIdeasRequested = 0;
      await user.save();
    }
    if (user.tier === "Free" && user.totalIdeasRequested >= 30)
      return undefined;
    if (user.tier === "Public" && user.totalIdeasRequested >= 4256)
      return undefined;
    const request = async (prompt: string) => {
      let gtpResponse;
      if (prompt === "3") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application essay ideas involving a student challenging previously held beliefs or ideas and the outcome of challenging those beliefs or ideas.\n1. Parental Acceptance\nA student challenges the belief that his/her parents dislike him/her after they invited him/her to spend time with them during the summer. This resulted in the student's respect for his/her parents, ultimately leading to increased trust and communication between the student and his/her parents.\n2. Self Esteem\nA student, hesitant to put himself/herself out there, challenges his/her view of himself/herself after finding himself/herself with potential to be one of the best football players in his/her school and making the school's cross country team. This resulted in the student realizing that he/she was worth more than his/her friends' perceptions of him/her and realizing his/her strengths.\n3. Conflict\nA student challenges his/her previous belief that conflict is to be avoided after finding out that conflict can actually lead to growth and learning. This resulted in the student valuing the process of conflict.\n4. Failure\nA student challenges his/her fear of failure after failing to write a great essay for a research paper. This resulted in the student learning that failing isn't the end of the world and that learning from failure can lead to greater success.\n5. Appearance\nA student challenges his/her belief that he/she was not good enough after learning that appearance does not define a person. This resulted in the student valuing his/her appearance more and valuing herself/himself more.\n6. Self Doubt\nA student challenges his/her belief that he/she is worthless after noticing the positive things he/she had accomplished. This resulted in the student gaining more confidence and valuing his/her abilities more.\n7. Government\nA student challenges his/her previous apathy for politics after learning that just one vote could have a significant impact on the outcome of an election. This resulted in a more involved and knowledgeable student.\n8. Failure\nA student challenges his/her fear of failure caused by his/her own shortcomings and sees that his/her dreams -- while not achievable right now -- are within reach. This resulted in the student setting smaller, more realistic goals, and ultimately led to a new goal of graduating at the top of her class.\n9. Fear\nA student confronts his/her fear of social interaction at a social event and learns that it isn't as scary as he/she had previously believed. This resulted in the student feeling more confident and outgoing.\n10.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      } else if (prompt === "4") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application ideas involving a positive interaction between two individuals that ends with one individual being happy and thankful in a surprising way. Include how gratitude resulting from the interaction affected or motivated the individual.\n1. Note Giving\nA student receives an anonymous note containing a positive message. The student, struck with happiness from the note, decides to pay it forward by writing anonymous notes to others.\n2. Exercise Brings People Together\nA student begins jogging in the early mornings. One day, another student sees him running and approaches him. The student, through conversation, learns the runner wants to train for a marathon. The two decide to train together, which increases their respect for each other.\n3. Removing Alienation\nA student is sitting alone at a lunch table when another student invites the individual to sit with them. This interaction leads to a long-lasting friendship and both students feeling grateful. This interaction motivates the student to be more inclusive of others.\n4. Birthday Celebration\nA student organizes a birthday party for a fellow student who does not have many friends. The student who is celebrating her birthday feels a sense of inclusion and gratitude. As a result, she becomes more aware of the impact of small acts of kindness.\n5. Inspirational Quotes\nA student finds inspirational quotes written on various bathroom stalls around campus. The quotes were written by a fellow student who has a secret admirer who they know only by the initials “K.S.”. This inspires the student to appreciate the beauty and ingenuity of the quotes and the power of anonymity.\n6. Outreach Effort\nA student decides to pick up trash in the vicinity of a park after a storm. They find an object that has an address on it, which they decide to return to the owner. Through this interaction, the student learns a valuable lesson in outreach.\n7. Story Telling\nA student begins to tell stories and personal life stories to their peers in a shared writing class. The stories, though humorous and lighthearted, show the unique life events the students have experienced. This interaction creates an outlet for the students to voice their feelings and take the pressure off of themselves to be entertaining.\n8. Self-Criticism\nA student volunteers to review a paper and finds a letter from another student indicating they wish they could be more like the student being reviewed. The student learns that they too are not perfect and find their own thoughts and feelings to be interesting and inspirational.\n9. Volunteer\nA student volunteers at a homeless shelter for a meal and finds a homeless individual willing to tell his life story. In this interaction, the student is both inspired and motivated to help others and takes a good deed to heart.\n10. Letters of Support\nA student in a shared writing class is having trouble writing a paper. Another student, who believes in them, keeps encouraging them to work on the paper despite it being a “B” paper. Through the interactions, the student is reminded that their writing abilities are growing and they are capable of working harder to improve their grade.\n11.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      } else if (prompt === "2") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application ideas involving a student facing a challenge, setback, or failure and how he/she learned from that experience.\n1. Perseverance\nA student is faced with the rejection of his/her idea of renaming the school track after his/her beloved coach by the school board. This resulted in the student learning the importance of perseverance and never giving up.\n2. Confidence\nA student faces his/her fear of public speaking, delivering a tribute to his/her best friend in front of the entire school. This resulted in the student learning the importance of having confidence in himself/herself and the power that comes with believing in oneself.\n3. Family\nA student is suddenly faced with the struggle of raising his/her little brother when his/her parents get divorced. This resulted in the student learning to become a supportive and dependable person as well as the importance of family in achieving happiness.\n4. Self-Esteem\nA student realizes that his/her lack of confidence in his/her abilities hinders his/her ability to be successful. This resulted in the student learning the importance of improving self-confidence and self-esteem in order to be successful.\n5. Family\nA student struggles to deal with his/her grandmother's unexpected death when he/she is only 11 years old. This resulted in the student learning that life is short and how important family is.\n6. Trust\nA student faces his/her challenge of choosing to trust a man she does not know with her brother's life after a medical emergency. This resulted in the student learning the importance of trusting others and being trusting of others.\n7. Change\nA student is confronted with the sudden inability to start a fire, realizing they had traded their skills as an outdoorsman for that of a musician. This resulted in the student learning not to fear change, but to accept it as inevitable.\n8. Strength\nA student finds himself crippled after a tragic accident and must learn to deal with the struggle of relying on others to do everything for him. This resulted in the student learning to accept help and that strength of will could replace the need for physical strength.\n9. Truth\nA student must confront the terrible truth that his grandfather, an honest and respected man, is being accused of the crime of treason against the United States of America. This resulted in the student learning the importance of telling the truth and honesty as well as the risk of not telling the truth.\n10. Patience\nA student faces the challenge of winning a friend over to their way of thinking after a dispute over soccer with their friend. This resulted in the student learning the importance of remaining patient and respectful.\n11. Friendship\nA student is faced with his/her own harsh temper when angry and embarrassed at a birthday party of his/her friend. This resulted in the student learning to have a better understanding of friends.\n12. Responsibility\nA student must come to terms with himself/herself after making a huge mistake. This resulted in the student learning to accept the consequences of his/her actions and proactively seek to be better.\n13.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      } else if (prompt === "5") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application essay ideas involving an accomplishment, event, or realization that sparked personal growth in a student and includes how this resulted in a new understanding of the student or others.\n1. Friendship\nBy giving a friendly ear to a struggling peer, a student is able to instill confidence in the peer and help them to achieve their potential. This results in the student gaining a true friend and learning the power of small gestures of friendship and understanding.\n2. Perseverance\nA student sells the rights to his/her book to a publisher. When the publisher goes out of business the student is faced with a decision, give up on the book or find a way to get it back. After buying out the publisher and reacquiring the book, the student learns the importance of keeping a level head during tough decisions.\n3. Luck\nThe death of a fellow student causes a student to draw similarities between his/her life and the life of the student that passed. This resulted in the student acknowledging that his/her current path had to change and that without luck the student and his/her peer would have ended in a similar fate.\n4. Sacrifice\nA student in a financially struggling family sacrifices his/her personal prospects by dropping out of school so that his/her brother could afford to go to college. The student learns the importance of family and the power of sacrificing for those he/she loves.\n5. Helping Others\nA traumatic car crash leaves a student struggling to conquer his/her horrid memories of the crash. Three years later the student becomes an EMT, channeling his/her memories into helping those who fall victim to similar accidents.\n6. Power of Writing\nAfter presenting his/her writing to a panel of judges, a student is approached by one of the judges and is told how his/her writing moved them to tears. The student comes to the self-realization of wanting to be a writer and the power that writing can have on those who read it.\n7. Role Model\nA student has to cancel horseback riding lessons when his/her father loses their job. To the student's surprise, his/her riding coach tells him/her to come anyways. The student learns the power of perseverance when things get tough.\n8. Selflessness\nIn the middle of a track race, a student notices one of his/her competitors fall to the ground. The student quickly helps them up and decides to throw away his/her own chances of winning the race so that the injured competitor may finish the race. As a result, the student learns the importance of selflessness even when given the opportunity of personal success.\n9. Doing the Right Thing\nThe decision to donate an organ to a long-time family friend causes a student to confront the value of life and the decision to donate. The student learns the value of life and the importance of making hard decisions for the sake of others.\n10. Taking a Stand\nAt a school assembly, a student publicly stands up for his/her beliefs, despite it causing them to become an outcast from his/her classmates. The student learns the importance of standing up for himself/herself and the value of being true to oneself.\n11. Forgiveness\nWhen a student hits his/her father with his/her car, the student is forced to make the decision of forgiving himself/herself. The student comes to the realization that forgiving himself/herself was the only way to accept his/her mistake and move on with his/her life.\n12. Friendship\nA student's admiration for a teacher inspires him/her to become a teacher. The student learns the value of a good friend when he/she realizes that this same teacher played a large role in making him/her who he/she is today.\n13.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      } else if (prompt === "6") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application essay ideas involving a student's passion and why it captivates him/her.\n1. Space\nA student is fascinated by space and its vastness. He/she is captivated by the idea that the Earth is just one small planet in a sea of billions and that so much conflict arises from controlling one part of a minuscule section of the universe.\n2. Nature\nA student is captivated by the rich and ever-changing colors of the world around him/her. He/she spends countless hours exploring his/her yard and hiking various areas of the countryside, hoping to see what other plants, animals, and landscapes are out there to discover.\n3. Photography\nA student is fascinated by photography. He/she is captivated by photography's ability to transform light and time into something physical. He/she loves that photography is a universal language everyone can speak and that a great photo can communicate a story without words.\n4. Wrens\nA student is fascinated by the wrens in his/her yard. He/she spends countless hours watching them, trying to find out how and why they move around as they do. He/she is captivated by the happiness they have despite the simplicity of their lives.\n5. Cars\nA student is fascinated by cars and spends much of his/her time working on his/her own. He/she is captivated by how a simple design and the appropriate engine can power an entire machine. He/she loves that the internal-combustion engine led to modern transportation and automobiles, and that cars give him/her the freedom to travel the world whenever he/she wishes.\n6. Weightlifting\nA student is fascinated by weightlifting. He/she is captivated by the opportunity to exercise every muscle in his/her body and improve his/her overall strength. He/she loves that weightlifting builds both a stronger body and a stronger mind.\n7. Teaching\nA student is fascinated by teaching. He/she is captivated by the ability to influence other people and create a positive change in their lives. He/she loves that he/she can encourage the world's children to become the greatest generation and bring peace and harmony to the world.\n8. Landscape Design\nA student is fascinated by landscape design. He/she is captivated by the ability to create a living work of art that can be enjoyed by others. He/she loves that he/she can bring joy to others through his/her work.\n9. Literature\nA student is fascinated by literature. He/she is captivated by the ability to be transported to another world and connect with fictional characters. He/she loves that reading can be such a powerful experience.\n10. Graphic Design\nA student is fascinated by graphic design. He/she is captivated by the art of putting all the pieces together to create a successful layout. He/she loves that he/she can use his/her creativity to make an impact on the world.\n11.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      } else if (prompt === "1") {
        gtpResponse = await openai.complete({
          engine: "curie",
          prompt: `College application essay ideas involving a student's background, identity, or talent.\n1. Native American\nA student tells a story about his/her Native American heritage and how it changes how he/she views the world around him/her.\n2. Pride\nA student tells a story about being in the LGBTQ+ community and how he/she had to overcome his/her upbringing to truly understand who he/she is.\n3. Unicycle\nA student tells a story about how learning to unicycle shaped the community around him/her for the better.\n4. Immigrant\nA student tells a story about growing up in an unfamiliar and unfriendly place and overcoming those challenges to become the person he/she is today.\n5. Low-income\nA student tells a story about how he/she was raised in a low-income environment and how that shaped his/her views on money, community, and family.\n6. Child of Divorce\nA student tells a story about being raised by a single parent and the struggles that he endured putting food on the table for his family.\n7. Multiracial\nA student tells a story about his/her multi-racial background and how being at the intersection of cultures changed how he/she interacted with the world around him/her.\n8. Autism\nA student tells a story about being diagnosed with autism and how that diagnosis shaped how he/she viewed himself/herself in the context of others.\n9. Refugee\nA student tells a story about being a refugee from his/her homeland and how this fragmentation forced her to learn to adapt to a new environment and to find new friends and opportunities.\n10. Syrian Refugee\nA student tells a story about being forced to leave his/her homeland due to war and how that experience changed his/her life forever.\n11.`,
          maxTokens: 350,
          temperature: 1,
          topP: 0.9,
        });
      }
      const regex = /\.$/gm;
      const result = filter.clean(gtpResponse.data.choices[0].text);
      const split = result.split(/(?<=\.)\n/);
      const formatedArr = split.map((item: string) => {
        return item.split("\n");
      });
      const finalFormArr = formatedArr.filter((item: string[], idx: number) => {
        if (
          (!regex.test(item[1]) && idx === formatedArr.length - 1) ||
          item.length !== 2
        ) {
          return false;
        }
        return true;
      });
      if (!sensitive) {
        const sensFormArr = await handleSensitiveRequest(finalFormArr, prompt);
        console.log(sensFormArr, "___________", result);
        return sensFormArr;
      }
      return finalFormArr;
    };
    const result = await request(prompt);
    user.totalIdeasRequested = user.totalIdeasRequested + result.length;
    await user.save();
    return result;
  }
}

const lessThanTenMinutesAgo = (cooldown: number) => {
  const TENMINUTES = 1000 * 60 * 10;
  const tenMinutesAgo = Date.now() - TENMINUTES;

  return cooldown > tenMinutesAgo;
};

const handleSensitiveRequest = async (
  finalFormArr: string[][],
  prompt: string
) => {
  const arr: number[] = [];
  const promiseArr = [];
  let editArr = finalFormArr;
  for (let i = 0; i < finalFormArr.length; i++) {
    promiseArr.push(
      new Promise(async (resolve, reject) => {
        const response = await openai.complete({
          engine: "content-filter-alpha-c4",
          prompt: "<|endoftext|>" + finalFormArr[i][1] + "\n--\nLabel:",
          temperature: 0.0,
          maxTokens: 1,
          topP: 0,
          logprobs: 10,
        });
        if (response.data.choices[0].text) {
          resolve(response.data.choices[0].text);
        } else {
          reject("reject");
        }
      })
    );
  }
  const returnValue = await Promise.all([...promiseArr]).then(
    async (values) => {
      values.map((value, idx) => {
        console.log(value);
        if (value !== "0") {
          arr.push(idx);
        }
      });
      console.log(arr);
      arr.map((idx) => {
        editArr.splice(idx, 1, [""]);
      });
      editArr = editArr.filter((array: string[]) => {
        if (array[0] === "") return false;
        return true;
      });
      if (editArr.length < 4) {
        let gtpResponse;
        if (prompt === "3") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application essay ideas involving a student challenging previously held beliefs or ideas and the outcome of challenging those beliefs or ideas.\n1. Parental Acceptance\nA student challenges the belief that his/her parents dislike him/her after they invited him/her to spend time with them during the summer. This resulted in the student's respect for his/her parents, ultimately leading to increased trust and communication between the student and his/her parents.\n2. Self Esteem\nA student, hesitant to put himself/herself out there, challenges his/her view of himself/herself after finding himself/herself with potential to be one of the best football players in his/her school and making the school's cross country team. This resulted in the student realizing that he/she was worth more than his/her friends' perceptions of him/her and realizing his/her strengths.\n3. Conflict\nA student challenges his/her previous belief that conflict is to be avoided after finding out that conflict can actually lead to growth and learning. This resulted in the student valuing the process of conflict.\n4. Failure\nA student challenges his/her fear of failure after failing to write a great essay for a research paper. This resulted in the student learning that failing isn't the end of the world and that learning from failure can lead to greater success.\n5. Appearance\nA student challenges his/her belief that he/she was not good enough after learning that appearance does not define a person. This resulted in the student valuing his/her appearance more and valuing herself/himself more.\n6. Self Doubt\nA student challenges his/her belief that he/she is worthless after noticing the positive things he/she had accomplished. This resulted in the student gaining more confidence and valuing his/her abilities more.\n7. Government\nA student challenges his/her previous apathy for politics after learning that just one vote could have a significant impact on the outcome of an election. This resulted in a more involved and knowledgeable student.\n8. Failure\nA student challenges his/her fear of failure caused by his/her own shortcomings and sees that his/her dreams -- while not achievable right now -- are within reach. This resulted in the student setting smaller, more realistic goals, and ultimately led to a new goal of graduating at the top of her class.\n9. Fear\nA student confronts his/her fear of social interaction at a social event and learns that it isn't as scary as he/she had previously believed. This resulted in the student feeling more confident and outgoing.\n10.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        } else if (prompt === "4") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application ideas involving a positive interaction between two individuals that ends with one individual being happy and thankful in a surprising way. Include how gratitude resulting from the interaction affected or motivated the individual.\n1. Note Giving\nA student receives an anonymous note containing a positive message. The student, struck with happiness from the note, decides to pay it forward by writing anonymous notes to others.\n2. Exercise Brings People Together\nA student begins jogging in the early mornings. One day, another student sees him running and approaches him. The student, through conversation, learns the runner wants to train for a marathon. The two decide to train together, which increases their respect for each other.\n3. Removing Alienation\nA student is sitting alone at a lunch table when another student invites the individual to sit with them. This interaction leads to a long-lasting friendship and both students feeling grateful. This interaction motivates the student to be more inclusive of others.\n4. Birthday Celebration\nA student organizes a birthday party for a fellow student who does not have many friends. The student who is celebrating her birthday feels a sense of inclusion and gratitude. As a result, she becomes more aware of the impact of small acts of kindness.\n5. Inspirational Quotes\nA student finds inspirational quotes written on various bathroom stalls around campus. The quotes were written by a fellow student who has a secret admirer who they know only by the initials “K.S.”. This inspires the student to appreciate the beauty and ingenuity of the quotes and the power of anonymity.\n6. Outreach Effort\nA student decides to pick up trash in the vicinity of a park after a storm. They find an object that has an address on it, which they decide to return to the owner. Through this interaction, the student learns a valuable lesson in outreach.\n7. Story Telling\nA student begins to tell stories and personal life stories to their peers in a shared writing class. The stories, though humorous and lighthearted, show the unique life events the students have experienced. This interaction creates an outlet for the students to voice their feelings and take the pressure off of themselves to be entertaining.\n8. Self-Criticism\nA student volunteers to review a paper and finds a letter from another student indicating they wish they could be more like the student being reviewed. The student learns that they too are not perfect and find their own thoughts and feelings to be interesting and inspirational.\n9. Volunteer\nA student volunteers at a homeless shelter for a meal and finds a homeless individual willing to tell his life story. In this interaction, the student is both inspired and motivated to help others and takes a good deed to heart.\n10. Letters of Support\nA student in a shared writing class is having trouble writing a paper. Another student, who believes in them, keeps encouraging them to work on the paper despite it being a “B” paper. Through the interactions, the student is reminded that their writing abilities are growing and they are capable of working harder to improve their grade.\n11.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        } else if (prompt === "2") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application ideas involving a student facing a challenge, setback, or failure and how he/she learned from that experience.\n1. Perseverance\nA student is faced with the rejection of his/her idea of renaming the school track after his/her beloved coach by the school board. This resulted in the student learning the importance of perseverance and never giving up.\n2. Confidence\nA student faces his/her fear of public speaking, delivering a tribute to his/her best friend in front of the entire school. This resulted in the student learning the importance of having confidence in himself/herself and the power that comes with believing in oneself.\n3. Family\nA student is suddenly faced with the struggle of raising his/her little brother when his/her parents get divorced. This resulted in the student learning to become a supportive and dependable person as well as the importance of family in achieving happiness.\n4. Self-Esteem\nA student realizes that his/her lack of confidence in his/her abilities hinders his/her ability to be successful. This resulted in the student learning the importance of improving self-confidence and self-esteem in order to be successful.\n5. Family\nA student struggles to deal with his/her grandmother's unexpected death when he/she is only 11 years old. This resulted in the student learning that life is short and how important family is.\n6. Trust\nA student faces his/her challenge of choosing to trust a man she does not know with her brother's life after a medical emergency. This resulted in the student learning the importance of trusting others and being trusting of others.\n7. Change\nA student is confronted with the sudden inability to start a fire, realizing they had traded their skills as an outdoorsman for that of a musician. This resulted in the student learning not to fear change, but to accept it as inevitable.\n8. Strength\nA student finds himself crippled after a tragic accident and must learn to deal with the struggle of relying on others to do everything for him. This resulted in the student learning to accept help and that strength of will could replace the need for physical strength.\n9. Truth\nA student must confront the terrible truth that his grandfather, an honest and respected man, is being accused of the crime of treason against the United States of America. This resulted in the student learning the importance of telling the truth and honesty as well as the risk of not telling the truth.\n10. Patience\nA student faces the challenge of winning a friend over to their way of thinking after a dispute over soccer with their friend. This resulted in the student learning the importance of remaining patient and respectful.\n11. Friendship\nA student is faced with his/her own harsh temper when angry and embarrassed at a birthday party of his/her friend. This resulted in the student learning to have a better understanding of friends.\n12. Responsibility\nA student must come to terms with himself/herself after making a huge mistake. This resulted in the student learning to accept the consequences of his/her actions and proactively seek to be better.\n13.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        } else if (prompt === "5") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application essay ideas involving an accomplishment, event, or realization that sparked personal growth in a student and includes how this resulted in a new understanding of the student or others.\n1. Friendship\nBy giving a friendly ear to a struggling peer, a student is able to instill confidence in the peer and help them to achieve their potential. This results in the student gaining a true friend and learning the power of small gestures of friendship and understanding.\n2. Perseverance\nA student sells the rights to his/her book to a publisher. When the publisher goes out of business the student is faced with a decision, give up on the book or find a way to get it back. After buying out the publisher and reacquiring the book, the student learns the importance of keeping a level head during tough decisions.\n3. Luck\nThe death of a fellow student causes a student to draw similarities between his/her life and the life of the student that passed. This resulted in the student acknowledging that his/her current path had to change and that without luck the student and his/her peer would have ended in a similar fate.\n4. Sacrifice\nA student in a financially struggling family sacrifices his/her personal prospects by dropping out of school so that his/her brother could afford to go to college. The student learns the importance of family and the power of sacrificing for those he/she loves.\n5. Helping Others\nA traumatic car crash leaves a student struggling to conquer his/her horrid memories of the crash. Three years later the student becomes an EMT, channeling his/her memories into helping those who fall victim to similar accidents.\n6. Power of Writing\nAfter presenting his/her writing to a panel of judges, a student is approached by one of the judges and is told how his/her writing moved them to tears. The student comes to the self-realization of wanting to be a writer and the power that writing can have on those who read it.\n7. Role Model\nA student has to cancel horseback riding lessons when his/her father loses their job. To the student's surprise, his/her riding coach tells him/her to come anyways. The student learns the power of perseverance when things get tough.\n8. Selflessness\nIn the middle of a track race, a student notices one of his/her competitors fall to the ground. The student quickly helps them up and decides to throw away his/her own chances of winning the race so that the injured competitor may finish the race. As a result, the student learns the importance of selflessness even when given the opportunity of personal success.\n9. Doing the Right Thing\nThe decision to donate an organ to a long-time family friend causes a student to confront the value of life and the decision to donate. The student learns the value of life and the importance of making hard decisions for the sake of others.\n10. Taking a Stand\nAt a school assembly, a student publicly stands up for his/her beliefs, despite it causing them to become an outcast from his/her classmates. The student learns the importance of standing up for himself/herself and the value of being true to oneself.\n11. Forgiveness\nWhen a student hits his/her father with his/her car, the student is forced to make the decision of forgiving himself/herself. The student comes to the realization that forgiving himself/herself was the only way to accept his/her mistake and move on with his/her life.\n12. Friendship\nA student's admiration for a teacher inspires him/her to become a teacher. The student learns the value of a good friend when he/she realizes that this same teacher played a large role in making him/her who he/she is today.\n13.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        } else if (prompt === "6") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application essay ideas involving a student's passion and why it captivates him/her.\n1. Space\nA student is fascinated by space and its vastness. He/she is captivated by the idea that the Earth is just one small planet in a sea of billions and that so much conflict arises from controlling one part of a minuscule section of the universe.\n2. Nature\nA student is captivated by the rich and ever-changing colors of the world around him/her. He/she spends countless hours exploring his/her yard and hiking various areas of the countryside, hoping to see what other plants, animals, and landscapes are out there to discover.\n3. Photography\nA student is fascinated by photography. He/she is captivated by photography's ability to transform light and time into something physical. He/she loves that photography is a universal language everyone can speak and that a great photo can communicate a story without words.\n4. Wrens\nA student is fascinated by the wrens in his/her yard. He/she spends countless hours watching them, trying to find out how and why they move around as they do. He/she is captivated by the happiness they have despite the simplicity of their lives.\n5. Cars\nA student is fascinated by cars and spends much of his/her time working on his/her own. He/she is captivated by how a simple design and the appropriate engine can power an entire machine. He/she loves that the internal-combustion engine led to modern transportation and automobiles, and that cars give him/her the freedom to travel the world whenever he/she wishes.\n6. Weightlifting\nA student is fascinated by weightlifting. He/she is captivated by the opportunity to exercise every muscle in his/her body and improve his/her overall strength. He/she loves that weightlifting builds both a stronger body and a stronger mind.\n7. Teaching\nA student is fascinated by teaching. He/she is captivated by the ability to influence other people and create a positive change in their lives. He/she loves that he/she can encourage the world's children to become the greatest generation and bring peace and harmony to the world.\n8. Landscape Design\nA student is fascinated by landscape design. He/she is captivated by the ability to create a living work of art that can be enjoyed by others. He/she loves that he/she can bring joy to others through his/her work.\n9. Literature\nA student is fascinated by literature. He/she is captivated by the ability to be transported to another world and connect with fictional characters. He/she loves that reading can be such a powerful experience.\n10. Graphic Design\nA student is fascinated by graphic design. He/she is captivated by the art of putting all the pieces together to create a successful layout. He/she loves that he/she can use his/her creativity to make an impact on the world.\n11.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        } else if (prompt === "1") {
          gtpResponse = await openai.complete({
            engine: "curie",
            prompt: `College application essay ideas involving a student's background, identity, or talent.\n1. Native American\nA student tells a story about his/her Native American heritage and how it changes how he/she views the world around him/her.\n2. Pride\nA student tells a story about being in the LGBTQ+ community and how he/she had to overcome his/her upbringing to truly understand who he/she is.\n3. Unicycle\nA student tells a story about how learning to unicycle shaped the community around him/her for the better.\n4. Immigrant\nA student tells a story about growing up in an unfamiliar and unfriendly place and overcoming those challenges to become the person he/she is today.\n5. Low-income\nA student tells a story about how he/she was raised in a low-income environment and how that shaped his/her views on money, community, and family.\n6. Child of Divorce\nA student tells a story about being raised by a single parent and the struggles that he endured putting food on the table for his family.\n7. Multiracial\nA student tells a story about his/her multi-racial background and how being at the intersection of cultures changed how he/she interacted with the world around him/her.\n8. Autism\nA student tells a story about being diagnosed with autism and how that diagnosis shaped how he/she viewed himself/herself in the context of others.\n9. Refugee\nA student tells a story about being a refugee from his/her homeland and how this fragmentation forced her to learn to adapt to a new environment and to find new friends and opportunities.\n10. Syrian Refugee\nA student tells a story about being forced to leave his/her homeland due to war and how that experience changed his/her life forever.\n11.`,
            maxTokens: 350,
            temperature: 1,
            topP: 0.9,
          });
        }
        const regex = /\.$/gm;
        const result = filter.clean(gtpResponse.data.choices[0].text);
        const split = result.split(/(?<=\.)\n/);
        const formatedArr = split.map((item: string) => {
          return item.split("\n");
        });
        editArr = formatedArr.filter((item: string[], idx: number) => {
          if (
            (!regex.test(item[1]) && idx === formatedArr.length - 1) ||
            item.length !== 2
          ) {
            return false;
          }
          return true;
        });
        editArr = await handleSensitiveRequest(editArr, prompt);
      }
      return editArr;
    }
  );
  return returnValue;
};
