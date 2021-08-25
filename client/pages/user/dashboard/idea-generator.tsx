import React, { useState } from "react";
import styles from "../../../styles/Idea.module.scss";
import lightbulb from "../../../public/logoWithoutText.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCheck,
  faChevronLeft,
  faQuestion,
  faSave,
  faStarOfLife,
  faTimes,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { GetServerSideProps } from "next";
import { useMutation, useQuery } from "urql";
import Link from "next/link";
import Layout from "../../../components/layout";

// queries

const Me = `
  query {
    me {
      username
    }
  }
`;
const GenerateIdeas = `
  mutation($useCase: String!, $prompt: String!, $sensitive: Boolean!) {
    generateIdeas(useCase: $useCase, prompt: $prompt, sensitive: $sensitive)
  }

`;

const AddIdea = `
  mutation($useCase: String!, $prompt: String!, $content: String!){
    saveIdea(useCase: $useCase, prompt: $prompt, content: $content)
  }

`;

const FavoriteIdea = `
  mutation($useCase: String!, $prompt: String!, $content: String!, $title: String!){
    favoriteIdeas(useCase: $useCase, prompt: $prompt, content: $content, title: $title)
  }

`;

function ideaGenerator() {
  const [section, setSection] = useState(0);
  const [useCase, setUseCase] = useState("commonApp");
  const [commonAppPrompt, setCommonAppPrompt] = useState("1");
  const [sensitive, setSensitive] = useState(true);
  const [learn, setLearn] = useState(false);
  const [returnedResult, setReturnedResult] = useState(false);
  const [saved, setSaved] = useState({});
  const [favorited, setFavorited] = useState({});
  // queries
  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const [result, generate] = useMutation(GenerateIdeas);
  const [ideaResult, saveIdea] = useMutation(AddIdea);
  const [favoriteResult, favoriteIdea] = useMutation(FavoriteIdea);
  const { data, fetching, error } = meResult;
  const handleSubmit = () => {
    const variables = {
      useCase,
      prompt: commonAppPrompt,
      sensitive,
    };
    generate(variables).then((result) => {
      if (result.error) {
        console.log(result.error);
      } else {
        location.hash = "api";
        setReturnedResult(true);
      }
    });
  };
  const handleSaveIdea = (e) => {
    const content = e.currentTarget.getAttribute("data-content");
    const id = e.currentTarget.getAttribute("data-id");
    const variables = {
      useCase,
      prompt: commonAppPrompt,
      content,
    };
    saveIdea(variables).then((result) => {
      if (result.data.saveIdea === true) {
        setSaved({ ...saved, [id]: true });
      }
    });
  };
  const handleCancelIdea = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    setSaved({ ...saved, [id]: true });
  };
  const handleSave = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    let title = e.currentTarget.getAttribute("data-title");
    title = title.replace(/\d*\. /, "");
    title = title.replace(/^ /, "");
    if (favorited[id]) {
      setFavorited({ ...favorited, [id]: false });
    } else {
      setFavorited({ ...favorited, [id]: true });
    }
    const variables = {
      useCase,
      prompt: commonAppPrompt,
      content: id,
      title,
    };
    favoriteIdea(variables);
  };
  return (
    <main className={styles.main}>
      <Link href="/user/dashboard">
        <div className={styles.return}>
          <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
        </div>
      </Link>
      <section
        id="api"
        className={styles.apiText}
        style={
          !returnedResult
            ? { display: "flex", justifyContent: "center" }
            : {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        {data && !returnedResult && !result.fetching ? (
          <div className={`${styles.typewriter} ${styles.animate}`}>
            <h2 className={styles.intro}>
              Hi <span className={styles.username}>{data.me.username}</span>,
              I'm Turlibirri, I'll be generating ideas for you!
            </h2>
          </div>
        ) : null}
        {returnedResult && result.data ? (
          <>
            {result.data.generateIdeas ? (
              <div className={`${styles.typewriter} ${styles.animate}`}>
                <h2 className={styles.intro}>Here's what I came up with.</h2>
              </div>
            ) : null}
            {result.data.generateIdeas ? (
              <section className={styles.ideasGrid}>
                {result.data.generateIdeas.map(
                  (array: string[], idx: number) => {
                    return (
                      <div className={styles.card} key={idx}>
                        <header className={styles.header}>
                          <h3 className={styles.title}>
                            {array[0].replace(/\d*\./, "")}
                          </h3>
                          <div className={styles.iconContainer}>
                            {favorited[array[1]] ? (
                              <p
                                className={styles.save}
                                style={{ margin: "0em .5em 0em 0em" }}
                              >
                                Saved!
                              </p>
                            ) : null}
                            <FontAwesomeIcon
                              icon={faSave}
                              className={styles.icon}
                              onClick={handleSave}
                              data-id={array[1]}
                              data-title={array[0]}
                            />
                          </div>
                        </header>
                        <section className={styles.desc}>
                          <p className={styles.content}>{array[1]}</p>
                        </section>
                        {!saved[array[1]] ? (
                          <section className={styles.utilities}>
                            <p className={styles.question}>
                              Was this idea useful?
                            </p>
                            <div className={styles.iconContainer}>
                              <FontAwesomeIcon
                                icon={faCheck}
                                className={styles.check}
                                onClick={handleSaveIdea}
                                data-content={array[1]}
                                data-id={array[1]}
                              />
                              <FontAwesomeIcon
                                icon={faTimes}
                                className={styles.times}
                                onClick={handleCancelIdea}
                                data-id={array[1]}
                              />
                            </div>
                          </section>
                        ) : (
                          <p className={styles.feedback}>
                            Thanks for your feedback.
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </section>
            ) : (
              <div className={styles.time}>
                <h4 className={styles.emoji}>( ⚆ _ ⚆ )</h4>
                <h3 className={styles.runout}>
                  You've run out of ideas you can generate. Wait a little bit
                  and you should be good to go again.
                  <br />
                  <br />
                  You can see how long you have to wait on your dashboard.
                </h3>
              </div>
            )}
          </>
        ) : null}
        {result.fetching ? (
          <div className={`${styles.typewriter} ${styles.animate}`}>
            <h2 className={styles.intro}>Give me one moment I'm thinking...</h2>
          </div>
        ) : null}
      </section>
      <section className={styles.userInput}>
        <div
          className={styles.card}
          style={
            section === 2 ? { marginTop: "5em", marginBottom: "5em" } : null
          }
        >
          {!learn ? (
            <>
              {" "}
              <header className={styles.head}>
                {section === 0 ? (
                  <>
                    <div className={styles.headContainer}>
                      <div className={styles.logo}>
                        <Image src={lightbulb} />
                      </div>
                      <h1 className={styles.title}>Idea Generator</h1>
                    </div>
                    <p className={styles.subtitle}>
                      Artifical Intelligence that generates essay ideas based on
                      topics of your choosing.
                    </p>
                    <p className={styles.desc}>
                      We use an AI to generate unique essay ideas. It's unlikely
                      that any two ideas are repeated. This is meant to help
                      initial brainstorming and should not be used as a
                      replacement for your own ideas.
                    </p>
                    <p className={styles.feedback}>
                      <FontAwesomeIcon
                        icon={faStarOfLife}
                        className={styles.icon}
                      />
                      Remember to provide feedback.
                    </p>
                  </>
                ) : section === 1 ? (
                  <>
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      size={"lg"}
                      onClick={() => setSection(section - 1)}
                      className={styles.returnIcon}
                    />
                    <div className={styles.useCaseHead}>
                      <h2 className={styles.title}>Choose Your Use Case</h2>
                      <p className={styles.subtitle}>
                        For the best results choose what kind of ideas you'd
                        like to generate.
                      </p>
                      <p className={styles.desc}>
                        You can generate ideas based on different use cases.
                        What you select here impacts the ideas that will be
                        generated.
                      </p>
                    </div>
                  </>
                ) : section === 2 ? (
                  <>
                    <section className={styles.top}>
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={"lg"}
                        onClick={() => setSection(section - 1)}
                        className={styles.returnIcon}
                      />
                      <p className={styles.useCaseText}>
                        {useCase === "commonApp"
                          ? "Common App"
                          : useCase === "supplemental"
                          ? "Supplemental"
                          : useCase === "other"
                          ? "Other"
                          : null}
                      </p>
                    </section>
                    <div className={styles.promptHead}>
                      <h2 className={styles.title}>Choose Your Prompt</h2>
                      <p className={styles.subtitle}>
                        The AI needs to know your prompt!
                      </p>
                      <p className={styles.desc}>
                        Artificial Intelligence doesn't work for free! It needs
                        to know the angle for idea generation to give it the
                        best opportunity to generate ideas that suit you.
                      </p>
                    </div>
                  </>
                ) : section === 3 ? (
                  <>
                    <section className={styles.top}>
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={"lg"}
                        onClick={() => setSection(section - 1)}
                        className={styles.returnIcon}
                      />
                      <div className={styles.selectedContainer}>
                        <p className={styles.useCaseText}>
                          {useCase === "commonApp"
                            ? "Common App"
                            : useCase === "supplemental"
                            ? "Supplemental"
                            : useCase === "other"
                            ? "Other"
                            : null}
                        </p>
                        <p className={styles.useCaseText}>
                          {useCase === "commonApp"
                            ? `Prompt: ${commonAppPrompt}`
                            : "Prompt: Custom"}
                        </p>
                      </div>
                    </section>
                    <div className={styles.topicHead}>
                      <h2 className={styles.title}>Verify Your Request</h2>
                      <p className={styles.subtitle}>
                        Let's make sure we have all of the info!
                      </p>
                      <p className={styles.desc}>
                        This is what we are going to ask Turlibirri, but we have
                        some settings you might find useful.
                      </p>
                      {sensitive ? (
                        <div className={styles.contentWarningContainer}>
                          <FontAwesomeIcon
                            icon={faStarOfLife}
                            className={styles.icon}
                          />
                          <p className={styles.contentWarning}>
                            The current settings have a potential to generate
                            content that may be sensitive to some users.{" "}
                            <u
                              className={styles.link}
                              onClick={() => setLearn(true)}
                            >
                              Learn more.
                            </u>
                          </p>
                        </div>
                      ) : null}
                      <div className={styles.sensSettings}>
                        <p className={styles.sensText}>
                          {sensitive ? "Enabled" : "Disabled"} sensitive content
                        </p>
                        <div className={styles.switch}>
                          <div className={styles.switch__1}>
                            <input
                              className={styles.input1}
                              id="switch-1"
                              type="checkbox"
                              defaultChecked
                              onChange={() => setSensitive(!sensitive)}
                            />
                            <label
                              className={styles.label1}
                              htmlFor="switch-1"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : section === 4 ? (
                  <>
                    <section className={styles.top}>
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={"lg"}
                        onClick={() => setSection(section - 1)}
                        className={styles.returnIcon}
                      />
                      <div className={styles.selectedContainer}>
                        <p className={styles.useCaseText}>
                          {useCase === "commonApp"
                            ? "Common App"
                            : useCase === "supplemental"
                            ? "Supplemental"
                            : useCase === "other"
                            ? "Other"
                            : null}
                        </p>
                        <p className={styles.useCaseText}>
                          {useCase === "commonApp"
                            ? `Prompt: ${commonAppPrompt}`
                            : "Prompt: Custom"}
                        </p>
                      </div>
                    </section>
                    <div className={styles.finishHead}>
                      <h2 className={styles.title}>Check It Out!</h2>
                      <p className={styles.subtitle}>
                        Turlibirri has generated some ideas for you.
                      </p>
                      <p className={styles.desc}>
                        Above or to the left you will find a grid of some of the
                        generated ideas. Given that the generator is still new,
                        it's got a lot to learn! <br /> <br />
                        Help the AI (and others using it) by checking whether
                        each idea was helpful or not. Giving feedback also has
                        some awards!{" "}
                        <a href="/user/dashboard/rewards" target="_blank">
                          <u className={styles.special}>
                            Learn more about rewards here.
                          </u>{" "}
                        </a>
                        <br />
                        <br />
                        As more and more feedback is given, the AI will continue
                        to improve. You can also press regenerate to generate
                        more ideas with the given prompt.
                      </p>
                    </div>
                  </>
                ) : null}
              </header>
              <section
                className={styles.questionSection}
                style={section === 0 ? { marginTop: "2em" } : null}
              >
                {section === 0 ? (
                  <div className={styles.getStarted}>
                    <button
                      className={styles.btn}
                      onClick={() => setSection(section + 1)}
                    >
                      Get Started
                    </button>
                  </div>
                ) : section === 1 ? (
                  <>
                    <label className={styles.label} htmlFor="yes">
                      {useCase === "commonApp" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="yes"
                          required
                          onClick={() => setUseCase("commonApp")}
                          defaultChecked
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="yes"
                          required
                          onClick={() => setUseCase("commonApp")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>Common App</span>
                    </label>
                    <label htmlFor="no" className={styles.label}>
                      {useCase === "supplemental" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="no"
                          required
                          onClick={() => setUseCase("supplemental")}
                          defaultChecked
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="no"
                          required
                          onClick={() => setUseCase("supplemental")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>Supplemental</span>
                    </label>
                    <label htmlFor="other" className={styles.label}>
                      {useCase === "other" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="other"
                          required
                          onClick={() => setUseCase("other")}
                          defaultChecked
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="display"
                          id="other"
                          required
                          onClick={() => setUseCase("other")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>Other</span>
                    </label>
                    <div className={styles.selectMode}>
                      <button
                        className={styles.btn}
                        onClick={() => setSection(section + 1)}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : section === 2 ? (
                  <>
                    <label htmlFor="1" className={styles.label}>
                      {commonAppPrompt === "1" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="1"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("1")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="1"
                          required
                          onClick={() => setCommonAppPrompt("1")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        Some students have a background, identity, interest, or
                        talent that is so meaningful they believe their
                        application would be incomplete without it. If this
                        sounds like you, then please share your story.
                      </span>
                    </label>
                    <label htmlFor="2" className={styles.label}>
                      {commonAppPrompt === "2" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="2"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("2")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="2"
                          required
                          onClick={() => setCommonAppPrompt("2")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        The lessons we take from obstacles we encounter can be
                        fundamental to later success. Recount a time when you
                        faced a challenge, setback, or failure. How did it
                        affect you, and what did you learn from the experience?
                      </span>
                    </label>
                    <label htmlFor="3" className={styles.label}>
                      {commonAppPrompt === "3" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="3"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("3")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="3"
                          required
                          onClick={() => setCommonAppPrompt("3")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        Reflect on a time when you questioned or challenged a
                        belief or idea. What prompted your thinking? What was
                        the outcome?
                      </span>
                    </label>
                    <label htmlFor="4" className={styles.label}>
                      {commonAppPrompt === "4" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="4"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("4")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="4"
                          required
                          onClick={() => setCommonAppPrompt("4")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        Reflect on something that someone has done for you that
                        has made you happy or thankful in a surprising way. How
                        has this gratitude affected or motivated you?
                      </span>
                    </label>
                    <label htmlFor="5" className={styles.label}>
                      {commonAppPrompt === "5" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="5"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("5")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="5"
                          required
                          onClick={() => setCommonAppPrompt("5")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        Discuss an accomplishment, event, or realization that
                        sparked a period of personal growth and a new
                        understanding of yourself or others.
                      </span>
                    </label>
                    <label htmlFor="6" className={styles.label}>
                      {commonAppPrompt === "6" ? (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="6"
                          required
                          defaultChecked
                          onClick={() => setCommonAppPrompt("6")}
                        />
                      ) : (
                        <input
                          className={styles.input}
                          type="radio"
                          name="prompt"
                          id="6"
                          required
                          onClick={() => setCommonAppPrompt("6")}
                        />
                      )}
                      <span className={styles.design}></span>
                      <span className={styles.text}>
                        Describe a topic, idea, or concept you find so engaging
                        that it makes you lose all track of time. Why does it
                        captivate you? What or who do you turn to when you want
                        to learn more?
                      </span>
                    </label>
                    <div className={styles.selectMode}>
                      <button
                        className={styles.btn}
                        onClick={() => setSection(section + 1)}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : section === 3 ? (
                  <>
                    <section className={styles.promptContainer}>
                      <FontAwesomeIcon
                        icon={faQuestion}
                        className={styles.icon}
                      />
                      <h3 className={styles.prompt}>
                        Generate{" "}
                        {useCase === "commonApp" ? (
                          <span className={styles.special}>Common App </span>
                        ) : null}
                        essay ideas involving{" "}
                        {commonAppPrompt === "3"
                          ? `a challenge to previously held beliefs or ideas and the outcome of challenging those beliefs or ideas.`
                          : commonAppPrompt === "1"
                          ? `a student's background, identity, or talent.`
                          : commonAppPrompt === "2"
                          ? `a student facing a challenge, setback, or failure and how he/she learned from that experience.`
                          : commonAppPrompt === "4"
                          ? `a positive interaction between two individuals that ends with one individual being happy and thankful in a surprising way. Include how gratitude resulting from the interaction affected or motivated the individual.`
                          : commonAppPrompt === "5"
                          ? `an accomplishment, event, or realization that sparked personal growth in a student and includes how this resulted in a new understanding of the student or others.`
                          : commonAppPrompt === "6"
                          ? `a student's passion and why it captivates him/her.`
                          : null}
                      </h3>
                    </section>
                    <div className={styles.selectMode}>
                      <button
                        className={styles.btn}
                        onClick={() => {
                          setSection(section + 1);
                          handleSubmit();
                        }}
                      >
                        Generate
                      </button>
                    </div>
                  </>
                ) : section === 4 ? (
                  <>
                    <div className={styles.selectMode}>
                      <button
                        className={styles.btn}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Regenerate
                      </button>
                    </div>
                  </>
                ) : null}
              </section>
              <section className={styles.circles}>
                <div
                  style={
                    section === 0
                      ? { background: "rgba(255, 255, 255, 0.87)" }
                      : { background: "rgba(255, 255, 255, 0.6)" }
                  }
                  className={styles.circle}
                ></div>
                <div
                  className={styles.circle}
                  style={
                    section === 1
                      ? { background: "rgba(255, 255, 255, 0.87)" }
                      : { background: "rgba(255, 255, 255, 0.6)" }
                  }
                ></div>
                <div
                  className={styles.circle}
                  style={
                    section === 2
                      ? { background: "rgba(255, 255, 255, 0.87)" }
                      : { background: "rgba(255, 255, 255, 0.6)" }
                  }
                ></div>
                <div
                  className={styles.circle}
                  style={
                    section === 3
                      ? { background: "rgba(255, 255, 255, 0.87)" }
                      : { background: "rgba(255, 255, 255, 0.6)" }
                  }
                ></div>
                <div
                  className={styles.circle}
                  style={
                    section === 4
                      ? { background: "rgba(255, 255, 255, 0.87)" }
                      : { background: "rgba(255, 255, 255, 0.6)" }
                  }
                ></div>
              </section>{" "}
            </>
          ) : (
            <>
              <header className={styles.learnHead}>
                <div className={styles.top}>
                  <div className={styles.image}>
                    <Image src={lightbulb} />
                  </div>
                  <h2 className={styles.title}>Learn more</h2>
                </div>
                <FontAwesomeIcon
                  onClick={() => setLearn(false)}
                  icon={faTimes}
                  className={styles.icon}
                />
              </header>
              <section className={styles.learnMain}>
                <h3 className={styles.subtitle}>
                  Not all of the content produced by the AI is user-friendly.
                </h3>
                <p className={styles.content}>
                  The AI we use to generate ideas is trained on billions of
                  pieces of information scoured throughout the internet. The
                  unfortunate consequence of this is that the internet isn't
                  always a friendly place and can lead to questionable
                  generations! <br /> <br /> We've decided not to remove this
                  content automatically because it is applicable to real life
                  and can be the source of a great college application if
                  written with care. Some of the content you might see with
                  sensitive generation enabled includes the following:
                </p>
                <ul className={styles.list}>
                  <li className={styles.item}>Drugs</li>
                  <li className={styles.item}>Death</li>
                  <li className={styles.item}>Mental & Physical Health</li>
                  <li className={styles.item}>Politics</li>
                  <li className={styles.item}>Religion</li>
                </ul>
                <p className={styles.content}>
                  If you'd like to remove this content from your generation,
                  simply toggle the button on the generation slide.
                </p>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ideaGenerator;

ideaGenerator.getLayout = (page) => {
  return <Layout title="Idea Generator - Edutech">{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let isAuthenticated = false;
  if (req.cookies.hasOwnProperty("qid")) {
    isAuthenticated = true;
  }
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
