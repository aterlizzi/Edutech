import {
  faChartLine,
  faChevronDown,
  faDownload,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import styles from "../../../styles/Editor.module.scss";
import autosize from "autosize";

function EssayEditor() {
  const [presetDisplay, setPresetDisplay] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [essay, setEssay] = useState("");
  const [preset, setPreset] = useState("Preset 1");

  useEffect(() => {
    autosize(document.querySelector("textarea"));
  }, []);

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
          <FontAwesomeIcon icon={faSave} className={styles.icon} />
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
            <p className={styles.preset}>{preset}</p>
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
            <p
              className={styles.selection}
              onClick={() => {
                if (preset === "Preset 1") {
                  setPreset("Preset 2");
                } else if (preset === "Preset 2") {
                  setPreset("Preset 1");
                }
              }}
            >
              {preset !== "Preset 1" ? "Preset 1" : "Preset 2"}
            </p>
            <p className={styles.selection}>Preset 3</p>
            <p className={styles.selection}>Preset 4</p>
          </div>
        </header>
        <section className={styles.textContainer}>
          <form action="" className={styles.form}>
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
              placeholder="Begin by writing your essay here or copy and pasting your essay here."
              id=""
            ></textarea>
          </form>
        </section>
        <footer className={styles.writingFooter}>
          <p className={styles.words}>{wordCount} words</p>
        </footer>
      </section>
      <section className={styles.info}></section>
      <section className={styles.editor}></section>
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
