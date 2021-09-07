import {
  faAlignLeft,
  faChartLine,
  faChevronLeft,
  faHeading,
  faStarOfLife,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery } from "urql";
import Layout from "../../../components/layout";
import styles from "../../../styles/Essay.module.scss";

const Me = `
  query {
    me {
      username
    }
  }
`;

function EssayGenerator() {
  const [sensitive, setSensitive] = useState(true);
  const [displaySens, setDisplaySens] = useState(false);
  const [section, setSection] = useState(0);
  const [regen, setRegen] = useState(false);
  const [titleInfo, setTitleInfo] = useState(false);
  const [title, setTitle] = useState("");

  const [result, reexecuteMe] = useQuery({ query: Me });

  const handleClick = () => {};

  return (
    <main className={styles.main}>
      <Link href="/user/dashboard">
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
        </div>
      </Link>
      <section className={styles.left}>
        {result.data ? (
          result.data.me ? (
            <div className={`${styles.typewriter} ${styles.animate}`}>
              <h2 className={styles.intro}>
                Hi{" "}
                <span className={styles.username}>
                  {result.data.me.username}
                </span>
                , I'm Turlibirri, I'll be generating essays for you!
              </h2>
            </div>
          ) : null
        ) : null}
      </section>
      <section className={styles.right}>
        {!displaySens && !titleInfo ? (
          section === 0 ? (
            <div className={styles.card}>
              <header className={styles.header}>
                <div className={styles.container}>
                  <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
                  <h1 className={styles.title}>Essay Generator</h1>
                </div>
                <p className={styles.subtitle}>
                  Generate entire essays from the abyss.
                </p>
                <p className={styles.desc}>
                  Welcome to the essay generator! Using the power of natural
                  language processing we are able to generate entirely original
                  essays. This tool is still being trained, help it improve by
                  providing feedback on the essays generated.
                </p>
              </header>
              <section className={styles.content}>
                {sensitive ? (
                  <div className={styles.contentWarningContainer}>
                    <FontAwesomeIcon
                      icon={faStarOfLife}
                      className={styles.icon}
                    />
                    <p className={styles.contentWarning}>
                      The current settings have a potential to generate content
                      that may be sensitive to some users.{" "}
                      <u
                        className={styles.link}
                        onClick={() => setDisplaySens(true)}
                      >
                        Learn more.
                      </u>
                    </p>
                  </div>
                ) : null}
                <div className={styles.switchContainer}>
                  <p className={styles.sensitiveText}>
                    {sensitive
                      ? "Disable sensitive content?"
                      : "Enable sensitive content?"}
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
                <button
                  onClick={() => setSection(section + 1)}
                  className={styles.btn}
                >
                  Go to Options
                </button>
                <section className={styles.circleContainer}>
                  <div
                    style={{ background: "rgba(255, 255, 255, .87)" }}
                    className={styles.circleOne}
                  ></div>
                  <div
                    className={styles.circleTwo}
                    style={{ background: "rgba(255, 255, 255, .6)" }}
                  ></div>
                </section>
              </section>
            </div>
          ) : section === 1 ? (
            <div className={styles.card}>
              <header className={styles.header}>
                <div className={styles.container}>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    onClick={() => setSection(section - 1)}
                    className={styles.icon}
                    style={{ cursor: "pointer" }}
                  />
                  <h1 className={styles.title}>Essay Options</h1>
                </div>
                <p className={styles.subtitle}>
                  Pick how you want the essay to be created.
                </p>
                <p className={styles.desc}>
                  You have the option of writing a custom title for your essay,
                  allowing the AI to focus in on a certain topic, or generate a
                  completely random essay. Learn more about writing a{" "}
                  <u
                    style={{
                      cursor: "pointer",
                      color: "rgba(255, 255, 255, .87)",
                    }}
                    onClick={() => setTitleInfo(true)}
                  >
                    proper title here
                  </u>
                </p>
              </header>
              <section className={styles.content}>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faHeading} className={styles.icon} />
                  <input
                    type="text"
                    className={styles.input}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    placeholder="Your optional title goes here."
                  />
                </div>
                <button className={styles.btn} onClick={() => setRegen(true)}>
                  {regen ? "Regenerate Essay" : "Generate Essay"}
                </button>
                <section className={styles.circleContainer}>
                  <div
                    className={styles.circleOne}
                    style={{ background: "rgba(255, 255, 255, .6)" }}
                  ></div>
                  <div
                    className={styles.circleTwo}
                    style={{ background: "rgba(255, 255, 255, .87)" }}
                  ></div>
                </section>
              </section>
            </div>
          ) : null
        ) : displaySens ? (
          <div className={styles.card}>
            <header className={styles.learnHead}>
              <div className={styles.top}>
                <h2 className={styles.title}>Learn more</h2>
              </div>
              <FontAwesomeIcon
                onClick={() => setDisplaySens(false)}
                icon={faTimes}
                className={styles.icon}
              />
            </header>
            <section className={styles.learnMain}>
              <h3 className={styles.subtitle}>
                Not all of the content produced by the AI is user-friendly.
              </h3>
              <p className={styles.content}>
                The AI we use to generate essays is trained on billions of
                pieces of information scoured throughout the internet. The
                unfortunate consequence of this is that the internet isn't
                always a friendly place and can lead to questionable
                generations! <br /> <br /> We've decided not to remove this
                content automatically because it is applicable to real life and
                can be the source of a great college application if written with
                care. Some of the content you might see with sensitive
                generation enabled includes the following:
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
          </div>
        ) : titleInfo ? (
          <div className={styles.card}>
            <header className={styles.learnHead}>
              <div className={styles.top}>
                <h2 className={styles.title}>How to Write a Good Title</h2>
              </div>
              <FontAwesomeIcon
                onClick={() => setTitleInfo(false)}
                icon={faTimes}
                className={styles.icon}
              />
            </header>
            <section className={styles.learnMain}>
              <h3 className={styles.subtitle}>
                The title you give your essay matters.
              </h3>
              <p className={styles.content}>
                When generating essays, the AI checks to determine whether or
                not you have an inputed title. The title of the essay helps to
                pinpoint the AI to writing material you actually want. Using the
                title, the AI is able to deduce the main focus of the essay, the
                conclusion, moral implications, and lessons learned. You'll find
                some examples that have worked well for us in the past below.
              </p>
              <ul className={styles.list}>
                <li className={styles.item}>Music for the Soul</li>
                <li className={styles.item}>Beauty Within</li>
                <li className={styles.item}>Nature's Lab</li>
                <li className={styles.item}>Ride the Waves</li>
              </ul>
              <p className={styles.content}>
                You can see that these are pretty creative! Feel free to play
                around with your title to get different results. Of course if
                you like the title but not the essay, you can always click
                regenerate.
              </p>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

EssayGenerator.getLayout = (page) => {
  return <Layout title="Essay Generator - Edutech">{page}</Layout>;
};

export default EssayGenerator;

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
