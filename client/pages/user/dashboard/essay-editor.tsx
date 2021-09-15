import {
  faChartLine,
  faCheckCircle,
  faChevronDown,
  faCommentDots,
  faDownload,
  faPlus,
  faRobot,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import styles from "../../../styles/Editor.module.scss";
import autosize from "autosize";
import { useMutation, useQuery } from "urql";
import { useRouter } from "next/router";

const Me = `
  query {
    me {
      tier
      presets {
        presetOne
        presetTwo
        presetThree
        presetFour
      }
    }
  }
`;
const Save = `
  mutation($content: String!, $preset: Float!) {
    savePreset(content: $content, preset: $preset)
  }
`;

let typingTimer;

const presetArr = [1, 2, 3, 4];

function EssayEditor() {
  const router = useRouter();
  const [presetDisplay, setPresetDisplay] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [essay, setEssay] = useState("");
  const [preset, setPreset] = useState(1);
  const [performance, setPerformance] = useState(0);
  const [grammar, setGrammar] = useState(0);
  const [punc, setPunc] = useState(0);
  const [concise, setConcise] = useState(0);
  const [sens, setSens] = useState(0);
  const [display, setDisplay] = useState(0);
  const [pers, setPers] = useState(0);
  const [ent, setEnt] = useState(0);
  const [unique, setUnique] = useState(0);
  const [initial, setInitial] = useState(0);
  const [saving, setSaving] = useState(false);

  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching, error } = meResult;
  const [saveResult, saveEssay] = useMutation(Save);

  if (data) {
    if (data.me) {
      if (initial === 0) {
        switch (preset) {
          case 1:
            setEssay(data.me.presets.presetOne);
            setWordCount(data.me.presets.presetOne.split(" ").length);
            break;
          case 2:
            setEssay(data.me.presets.presetTwo);
            setWordCount(data.me.presets.presetTwo.split(" ").length);
            break;
          case 3:
            setEssay(data.me.presets.presetThree);
            setWordCount(data.me.presets.presetThree.split(" ").length);
            break;
          case 4:
            setEssay(data.me.presets.presetFour);
            setWordCount(data.me.presets.presetFour.split(" ").length);
            break;
          default:
            break;
        }
        setInitial(1);
      }
    }
  }

  useEffect(() => {
    autosize(document.querySelector("textarea"));
  }, []);
  useEffect(() => {
    setInitial(0);
  }, [preset]);
  useEffect(() => {
    if (data) {
      if (data.me) {
        if (data.me.tier === "Free") {
          router.push("/applications/pricing");
        }
      }
    }
  });

  const handleSaveEssay = () => {
    setSaving(true);
    const variables = {
      content: essay,
      preset,
    };
    saveEssay(variables).then(() => setSaving(false));
  };
  const handleKeyUp = () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(handleSaveEssay, 5000);
  };
  const handleKeyDn = () => {
    clearTimeout(typingTimer);
  };

  return (
    <main className={styles.main}>
      <section className={styles.toolbar}>
        <div className={styles.top}>
          <Link href="/user/dashboard">
            <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
          </Link>
          <div className={styles.iconCircle}>
            <FontAwesomeIcon icon={faPlus} className={styles.icon} />
          </div>
          <FontAwesomeIcon
            icon={faSave}
            onClick={handleSaveEssay}
            className={styles.icon}
          />
          <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.circle}>
            <p className={styles.questionMark}>?</p>
          </div>
        </div>
      </section>
      <section className={styles.writing}>
        <header className={styles.header}>
          <div
            onClick={() => setPresetDisplay(!presetDisplay)}
            className={styles.presetContainer}
          >
            <p className={styles.preset}>Preset {preset}</p>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={
                presetDisplay
                  ? `${styles.icon} ${styles.active}`
                  : `${styles.icon}`
              }
            />
          </div>
          <div
            className={
              presetDisplay
                ? `${styles.dropdn} ${styles.active}`
                : `${styles.dropdn}`
            }
          >
            {presetArr.map((number) => {
              if (number !== preset) {
                return (
                  <p
                    className={styles.selection}
                    onClick={() => setPreset(number)}
                  >
                    Preset {number}
                  </p>
                );
              }
            })}
          </div>
        </header>
        <section className={styles.textContainer}>
          <form action="" className={styles.form}>
            {data ? (
              data.me ? (
                <textarea
                  onChange={(e) => {
                    if (e.currentTarget.value === "") {
                      setWordCount(0);
                      setEssay("");
                    } else {
                      setWordCount(e.currentTarget.value.split(" ").length);
                      setEssay(e.currentTarget.value);
                    }
                  }}
                  className={styles.textArea}
                  name="essay"
                  placeholder="Begin by writing or pasting your essay here."
                  id=""
                  onKeyDown={handleKeyDn}
                  onKeyUp={handleKeyUp}
                  value={essay}
                ></textarea>
              ) : null
            ) : null}
          </form>
        </section>
        <footer className={styles.writingFooter}>
          <p className={styles.words}>{wordCount} words</p>
        </footer>
        {saving ? (
          <div
            className={`${styles.spinner} ${styles.spinnerTwo}`}
            aria-hidden="true"
          ></div>
        ) : null}
      </section>
      <section className={styles.info}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            {display === 0
              ? "Overall Rating"
              : display === 1
              ? "Grammar"
              : display === 2
              ? "Punctuation"
              : display === 3
              ? "Conciseness"
              : display === 4
              ? "Sensitivity"
              : display === 5
              ? "Persuasiveness"
              : display === 6
              ? "Entertainment"
              : display === 7
              ? "Uniqueness"
              : null}
          </h3>
        </header>
        <p className={styles.desc}>
          {display === 0
            ? "Overall rating of the essay compiled by averaging other categories."
            : display === 1
            ? "Identifies improper grammar and provides suggestions for fixing it."
            : display === 2
            ? "Highlights mistakes made in the punctuation of a sentence and provides suggestions for fixing it."
            : display === 3
            ? "Identifies redundancy and provides suggestions for making the essay more concise."
            : display === 4
            ? "Displays sensitive material identified in the essay and classifies overall essay sentiment."
            : display === 5
            ? "Rates overall persuasiveness of the essay and its ability to create a lasting impact on the reader."
            : display === 6
            ? "Incorporates originality and other factors in order to rate overall entertainment value of the essay."
            : display === 7
            ? "Determines originality through the identification of cliches, unoriginal ideas, and common topics."
            : null}
        </p>
      </section>
      <section className={styles.editor}>
        <header className={styles.edHead}>
          <h3 className={styles.title}>Editor</h3>
        </header>
        <section className={styles.performance}>
          <div className={styles.ratingContainer} onClick={() => setDisplay(0)}>
            <p className={styles.ratingText}>Overall Rating</p>
            <div
              className={styles.ratingCircle}
              style={
                performance < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < performance && performance < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                style={
                  performance < 50
                    ? { color: "#cf6679" }
                    : 50 < performance && performance < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
                className={styles.rating}
              >
                {performance}
              </p>
            </div>
          </div>
        </section>
        <section className={styles.topics}>
          <div className={styles.topicContainer} onClick={() => setDisplay(1)}>
            <p className={styles.topicText}>Grammar</p>
            <div
              className={styles.topicCircle}
              style={
                grammar < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < grammar && grammar < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  grammar < 50
                    ? { color: "#cf6679" }
                    : 50 < grammar && grammar < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {grammar}
              </p>
            </div>
          </div>
          <div className={styles.topicContainer} onClick={() => setDisplay(2)}>
            <p className={styles.topicText}>Punctuation</p>
            <div
              className={styles.topicCircle}
              style={
                punc < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < punc && punc < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  punc < 50
                    ? { color: "#cf6679" }
                    : 50 < punc && punc < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {punc}
              </p>
            </div>
          </div>
          <div className={styles.topicContainer} onClick={() => setDisplay(3)}>
            <p className={styles.topicText}>Conciseness</p>
            <div
              className={styles.topicCircle}
              style={
                concise < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < concise && concise < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  concise < 50
                    ? { color: "#cf6679" }
                    : 50 < concise && concise < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {concise}
              </p>
            </div>
          </div>
          <div className={styles.topicContainer} onClick={() => setDisplay(4)}>
            <p className={styles.topicText}>Sensitivity</p>
            <div
              className={styles.topicCircle}
              style={
                sens < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < sens && sens < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  sens < 50
                    ? { color: "#cf6679" }
                    : 50 < sens && sens < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {sens}
              </p>
            </div>
          </div>
        </section>
        <section className={styles.topics}>
          <div className={styles.topicContainer} onClick={() => setDisplay(5)}>
            <p className={styles.topicText}>Persuasiveness</p>
            <div
              className={styles.topicCircle}
              style={
                pers < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < pers && pers < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  pers < 50
                    ? { color: "#cf6679" }
                    : 50 < pers && pers < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {pers}
              </p>
            </div>
          </div>
          <div className={styles.topicContainer} onClick={() => setDisplay(6)}>
            <p className={styles.topicText}>Entertainment</p>
            <div
              className={styles.topicCircle}
              style={
                ent < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < ent && ent < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  ent < 50
                    ? { color: "#cf6679" }
                    : 50 < ent && ent < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {ent}
              </p>
            </div>
          </div>
          <div className={styles.topicContainer} onClick={() => setDisplay(7)}>
            <p className={styles.topicText}>Uniqueness</p>
            <div
              className={styles.topicCircle}
              style={
                unique < 50
                  ? { borderColor: "#cf6679" }
                  : 50 < unique && unique < 80
                  ? { borderColor: "#bb86fc" }
                  : { borderColor: "#03dac6" }
              }
            >
              <p
                className={styles.topic}
                style={
                  unique < 50
                    ? { color: "#cf6679" }
                    : 50 < unique && unique < 80
                    ? { color: "#bb86fc" }
                    : { color: "#03dac6" }
                }
              >
                {unique}
              </p>
            </div>
          </div>
        </section>
        <section className={styles.utilities}>
          <div className={styles.utilContainer}>
            <p className={styles.util}>AI Summary</p>
            <FontAwesomeIcon icon={faRobot} className={styles.icon} />
          </div>
          <div className={styles.utilContainer}>
            <p className={styles.util}>AI Feedback</p>
            <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
          </div>
          <div className={styles.utilContainer}>
            <p className={styles.util}>AI Complete</p>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
          </div>
        </section>
      </section>
    </main>
  );
}

EssayEditor.getLayout = (page) => {
  return <Layout title="Essay Editor - Edutech">{page}</Layout>;
};
export default EssayEditor;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.hasOwnProperty("qid")) {
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
