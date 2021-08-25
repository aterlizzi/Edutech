import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { stringifyVariables, useMutation, useQuery } from "urql";
import { v4 } from "uuid";
import logo from "../../../public/logoHorizontal.png";
import singleLogo from "../../../public/logoWithoutText.png";
import styles from "../../../styles/Dashboard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faAlignLeft,
  faArrowDown,
  faArrowUp,
  faBook,
  faClipboard,
  faCog,
  faCommentsDollar,
  faCreditCard,
  faDollarSign,
  faEnvelopeOpenText,
  faEye,
  faFileUpload,
  faHome,
  faHourglassStart,
  faLightbulb,
  faSignOutAlt,
  faStar,
  faTimes,
  faUser,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../../components/layout";
import { useRouter } from "next/router";
import tealGraph from "../../../public/tealGraph.png";
import purpleGraph from "../../../public/purpleGraph.png";
import redGraph from "../../../public/redGraph.png";
const Me = `
    query {
        me {
            id
            username
            recentApps {
              id
              author {
                username
              }
            }
            applications {
              id
              viewCount
              fUsersCount
            }
            fApplications {
              author {
                username
              }
              id
              acceptedColleges {
                college
              }
            }
            savedIdeas {
              prompt
              content
              title
            }
            totalIdeasRequested
            tier
        }
    }
`;
const Cooldown = `
    query {
      cooldownIdeas
    }

`;
const Logout = `
    mutation {
      logout
    }
`;
const RemoveFavorite = `
    mutation($id: Float!) {
      favoriteApplication(id: $id)
    }
`;
const FavoriteIdea = `
  mutation($useCase: String!, $prompt: String!, $content: String!, $title: String!){
    favoriteIdeas(useCase: $useCase, prompt: $prompt, content: $content, title: $title)
  }

`;

function Dashboard({ sid }) {
  let unrendered = true;
  const router = useRouter();
  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const [logoutResult, logout] = useMutation(Logout);
  const [favoriteResult, unfavorite] = useMutation(RemoveFavorite);
  const [saveResult, saveIdea] = useMutation(FavoriteIdea);
  const { data, fetching, error } = meResult;
  const [mobileActive, setMobileActive] = useState(false);
  const [render, setRender] = useState("");
  const [displayOptions, setDisplayOptions] = useState({});
  const [loadLimit, setLoadLimit] = useState(3);
  const [reveal, setReveal] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const [ideaDisplay, setIdeaDisplay] = useState({});
  const [applicationDisplay, setApplicationDisplay] = useState({});
  // const [cooldownResult, reexecuteCooldown] = useQuery({
  //   query: Cooldown,
  //   pause: cooldown !== 0,
  // });
  // useEffect(() => {
  //   let run = true;
  //   if (cooldownResult.data) {
  //     if (10 - cooldownResult.data.cooldownIdeas <= 0) {
  //       run = false;
  //     }
  //   }
  //   if (run) {
  //     reexecuteCooldown();
  //   }
  //   setInterval(() => {
  //     setCooldown(cooldown + 1);
  //   }, 1000 * 60);
  // }, [cooldown]);
  const handleLogOut = () => {
    logout().then((result) => {
      if (!result.error) {
        router.push("/");
      }
    });
  };
  const handleRemove = (e) => {
    const appId = parseInt(e.currentTarget.getAttribute("data-id"));
    const variables = {
      id: appId,
    };
    if (!applicationDisplay[appId]) {
      setApplicationDisplay({ ...applicationDisplay, [appId]: true });
    }
    unfavorite(variables).then((result) => {
      if (result) {
        reexecuteMe();
      }
    });
  };
  const handleOptions = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    if (!displayOptions[id]) {
      setDisplayOptions({ ...displayOptions, [id]: true });
    } else {
      setDisplayOptions({ ...displayOptions, [id]: false });
    }
  };
  const handleFavorite = (e) => {
    const id = parseInt(e.currentTarget.getAttribute("data-id"));
    const variables = {
      id,
    };
    unfavorite(variables).then((result) => {
      if (result.data) {
        reexecuteMe();
      }
      if (
        result.data === "true" &&
        applicationDisplay[e.currentTarget.getAttribute("data-id")]
      ) {
        setApplicationDisplay({
          ...applicationDisplay,
          [e.currentTarget.getAttribute("data-id")]: false,
        });
      }
    });
  };
  const handleSaveIdea = (e) => {
    const prompt = e.currentTarget.getAttribute("data-prompt");
    const content = e.currentTarget.getAttribute("data-content");
    const title = e.currentTarget.getAttribute("data-title");
    const variables = {
      prompt,
      content,
      title,
      useCase: "commonApp",
    };
    saveIdea(variables);
    setIdeaDisplay({ ...ideaDisplay, [content]: true });
  };
  const handleRevealSection = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    if (reveal[id]) {
      setReveal({ ...reveal, [id]: false });
    } else {
      setReveal({ ...reveal, [id]: true });
    }
  };
  return (
    <main
      className={
        mobileActive ? `${styles.main} ${styles.active}` : `${styles.main}`
      }
    >
      <nav
        className={
          mobileActive ? `${styles.nav} ${styles.active}` : `${styles.nav}`
        }
      >
        <div
          className={
            mobileActive
              ? `${styles.wrapped} ${styles.active}`
              : `${styles.wrapped}`
          }
        >
          <Link href="/">
            <div className={styles.logo}>
              <Image src={logo}></Image>
            </div>
          </Link>
          <div className={styles.switch}>
            <div className={styles.switch__1}>
              <input
                className={styles.input}
                id="switch-1"
                type="checkbox"
                onChange={() => setMobileActive(!mobileActive)}
              />
              <label className={styles.label} htmlFor="switch-1"></label>
            </div>
          </div>
          <section className={styles.mainLinks}>
            <h3 className={styles.label}>Main</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
                <FontAwesomeIcon
                  icon={faEnvelopeOpenText}
                  className={styles.icon}
                />
                {sid ? (
                  <FontAwesomeIcon icon={faClipboard} className={styles.icon} />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className={styles.icon}
                    />
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className={styles.icon}
                    />
                  </>
                )}
              </div>
              <div className={styles.linksContainer}>
                <Link href="/">
                  <p className={styles.link}>Home</p>
                </Link>
                <Link href="/about">
                  <p className={styles.link}>About</p>
                </Link>
                <Link href="/contact">
                  <p className={styles.link}>Contact</p>
                </Link>
                {sid ? (
                  <Link href="/applications/">
                    <p className={styles.link}>Applications</p>
                  </Link>
                ) : (
                  <>
                    <Link href="/applications/payments">
                      <p className={styles.link}>Purchase</p>
                    </Link>
                    <Link href="/applications/pricing">
                      <p className={styles.link}>Pricing</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>
          <section className={styles.dashLinks}>
            <h3 className={styles.label}>Dashboard</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
                <FontAwesomeIcon icon={faBook} className={styles.icon} />
              </div>
              <div className={styles.linkContainer}>
                <Link href="/user/dashboard/idea-generator">
                  <p className={styles.link}>Idea Generator</p>
                </Link>
                <Link href="/user/dashboard/essay-generator">
                  <p className={styles.link}>Essay Generator</p>
                </Link>
                <Link href="/user/dashboard/essay-editor">
                  <p className={styles.link}>Essay Editor</p>
                </Link>
              </div>
            </div>
          </section>
          <section className={styles.utilities}>
            <h3 className={styles.label}>Utilities</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faCog} className={styles.icon} />
                <FontAwesomeIcon icon={faFileUpload} className={styles.icon} />
                <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
              </div>
              <div className={styles.linkContainer}>
                <Link href="/user/settings">
                  <p className={styles.link}>Settings</p>
                </Link>
                <Link href="/applications/upload">
                  <p className={styles.link}>Upload App</p>
                </Link>
                <p onClick={handleLogOut} className={styles.link}>
                  Logout
                </p>
              </div>
            </div>
          </section>
          {data ? (
            <section className={styles.accountContainer}>
              <div className={styles.circle}>
                <FontAwesomeIcon
                  icon={data.me ? (data.me.tier ? faUserSecret : faUser) : null}
                  className={styles.userIcon}
                  size={"lg"}
                />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.username}>{data.me.username}</h3>
                <p className={styles.info}>{data.me ? data.me.tier : null}</p>
              </div>
            </section>
          ) : null}
        </div>
        <div
          className={
            mobileActive
              ? `${styles.mobile} ${styles.active}`
              : `${styles.mobile}`
          }
        >
          <section className={styles.top}>
            <Link href="/">
              <div className={styles.logo}>
                <Image src={singleLogo}></Image>
              </div>
            </Link>
            <div className={styles.switch}>
              <div className={styles.switch__1}>
                <input
                  className={styles.input}
                  id="switch-1"
                  type="checkbox"
                  onChange={() => setMobileActive(!mobileActive)}
                />
                <label className={styles.label} htmlFor="switch-1"></label>
              </div>
            </div>
            <Link href="/">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
              </div>
            </Link>
            <Link href="/about">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
              </div>
            </Link>
            <Link href="/contact">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faEnvelopeOpenText}
                  className={styles.icon}
                />
              </div>
            </Link>
            {sid ? (
              <Link href="/applications">
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faClipboard} className={styles.icon} />
                </div>
              </Link>
            ) : (
              <Link href="/applications/payments">
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className={styles.icon}
                  />
                </div>
              </Link>
            )}
            <Link href="/user/dashboard/idea-generator">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
              </div>
            </Link>
            <Link href="/user/dashboard/essay-generator">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
              </div>
            </Link>
            <Link href="/user/dashboard/essay-editor">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faBook} className={styles.icon} />
              </div>
            </Link>
            <Link href="/applications/upload">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faFileUpload} className={styles.icon} />
              </div>
            </Link>
            <div onClick={handleLogOut} className={styles.iconContainer}>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
            </div>
          </section>
          <section className={styles.bottom}>
            <Link href="/user/settings">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faCog} className={styles.icon} />
              </div>
            </Link>{" "}
            <div className={styles.userContainer}>
              <div className={styles.circle}>
                <FontAwesomeIcon icon={faUserSecret} className={styles.icon} />
              </div>
            </div>
          </section>
        </div>
      </nav>
      <section className={styles.dashboard}>
        <section className={styles.left}>
          <div className={styles.stats}>
            <div className={styles.statContainer}>
              <div className={styles.left}>
                <div className={styles.top}>
                  <FontAwesomeIcon icon={faEye} className={styles.icon} />
                  <h4 className={styles.label}>App Views</h4>
                </div>
                {data ? (
                  <p className={styles.stat}>
                    {data.me.applications
                      ? `${data.me.applications.reduce((accumulator, value) => {
                          return accumulator + value.viewCount;
                        }, 0)} views`
                      : "No applications uploaded."}
                  </p>
                ) : null}
              </div>
              <div className={styles.right}>
                <div className={styles.graph}>
                  <Image src={tealGraph}></Image>
                </div>
              </div>
            </div>
            <div className={styles.statContainer}>
              <div className={styles.left}>
                <div className={styles.top}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                  <h4 className={styles.label}>Total Ideas Requested</h4>
                </div>
                {data ? (
                  <p className={styles.stat} style={{ color: "#bb86fc" }}>
                    {data.me
                      ? `${data.me.totalIdeasRequested}/${
                          data.me.tier === "Free"
                            ? "30"
                            : data.me.tier === "Public"
                            ? "4256"
                            : data.me.tier === "Ivy"
                            ? "Unlimited"
                            : null
                        } ideas`
                      : null}
                  </p>
                ) : null}
              </div>
              <div className={styles.right}>
                <div className={styles.graph}>
                  <Image src={purpleGraph}></Image>
                </div>
              </div>
            </div>
            <div className={styles.statContainer}>
              <div className={styles.left}>
                <div className={styles.top}>
                  <FontAwesomeIcon icon={faStar} className={styles.icon} />
                  <h4 className={styles.label}>Total favorites</h4>
                </div>
                {data ? (
                  <p className={styles.stat} style={{ color: "#cf6679" }}>
                    {data.me.applications.length > 0
                      ? `${data.me.applications.reduce((accumulator, app) => {
                          return accumulator + app.fUsersCount;
                        }, 0)} users`
                      : "You have no applications."}
                  </p>
                ) : null}
              </div>
              <div className={styles.right}>
                <div className={styles.graph}>
                  <Image src={redGraph}></Image>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.faveAppsContainer}>
            <header className={styles.top}>
              <h4 className={styles.faveApps}>Favorite Applications</h4>
              <Link href="/user/dashboard/favorites">
                <p className={styles.seeAll}>See all</p>
              </Link>
            </header>
            <p
              className={styles.desc}
              style={
                data
                  ? data.me.fApplications.length === 0
                    ? { marginBottom: "initial" }
                    : null
                  : null
              }
            >
              Here are the applications you've favorited.
            </p>
            {data ? (
              <section className={styles.apps}>
                {data.me.fApplications.length === 0 ? (
                  <div className={styles.noAppContainer}>
                    <p className={styles.noApp}>
                      You haven't favorited any applications yet.
                    </p>
                    <Link href="/applications">
                      <p className={styles.link}>
                        Go to{" "}
                        <span className={styles.special}>applications.</span>
                      </p>
                    </Link>
                  </div>
                ) : (
                  data.me.fApplications.map((app, idx) => {
                    if (idx < loadLimit) {
                      return (
                        <div
                          key={v4()}
                          style={
                            applicationDisplay[app.id]
                              ? { display: "none" }
                              : null
                          }
                          className={styles.appContainer}
                        >
                          {app.acceptedColleges.length === 0 ? (
                            <p className={styles.noAC}>
                              This application wasn't accepted by any colleges.
                            </p>
                          ) : (
                            <>
                              <div className={styles.collegeContainer}>
                                <h3 className={styles.label}>
                                  Accepted Colleges:{" "}
                                </h3>
                                {app.acceptedColleges.map((ac) => (
                                  <p key={v4()} className={styles.college}>
                                    {ac.college}
                                  </p>
                                ))}
                              </div>
                              <section className={styles.userContainer}>
                                <div className={styles.circle}>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className={styles.icon}
                                    size={"sm"}
                                  />
                                </div>
                                <p className={styles.username}>
                                  {app.author
                                    ? `${app.author.username}`
                                    : "Anonymous"}
                                </p>
                              </section>
                              <section className={styles.utilities}>
                                <Link href={`/applications/${app.id}`}>
                                  <p className={styles.goApp}>
                                    Go to{" "}
                                    <span className={styles.special}>
                                      application.
                                    </span>
                                  </p>
                                </Link>
                                <p
                                  data-id={app.id}
                                  className={styles.remove}
                                  onClick={handleRemove}
                                >
                                  Remove
                                </p>
                              </section>
                            </>
                          )}
                        </div>
                      );
                    }
                  })
                )}
              </section>
            ) : null}
            {data ? (
              data.me.fApplications.length > 3 &&
              loadLimit < data.me.fApplications.length ? (
                <button
                  className={styles.btn}
                  onClick={() => {
                    setLoadLimit(loadLimit + 5);
                  }}
                >
                  Load more
                </button>
              ) : null
            ) : null}
          </div>
        </section>
        <section className={styles.right}>
          <section className={styles.recentContainer}>
            <div className={styles.top}>
              <h3 className={styles.label}>Recently Viewed Applications</h3>
              <p className={styles.desc}>
                We keep track of the last five applications you visited.{" "}
              </p>
            </div>
            {data ? (
              <div className={styles.appContainer}>
                {data.me.recentApps.length === 0 ? (
                  <p className={styles.noApps}>
                    You haven't viewed any applications.
                  </p>
                ) : (
                  data.me.recentApps.map((app) => {
                    let favorite = 0;
                    return (
                      <div className={styles.app} key={v4()}>
                        <section className={styles.left}>
                          <div className={styles.circle}>
                            <FontAwesomeIcon
                              className={styles.icon}
                              icon={faUser}
                              size={"lg"}
                            />
                          </div>
                          <div className={styles.user}>
                            <h4 className={styles.username}>
                              {!app.author
                                ? "Anonymous"
                                : `${app.author.username}`}
                            </h4>
                            <p className={styles.userInfo}>Author</p>
                          </div>
                        </section>
                        <section className={styles.right}>
                          <div
                            onClick={handleOptions}
                            className={styles.options}
                            data-id={app.id}
                            style={
                              displayOptions[app.id]
                                ? { background: "rgba(255, 255, 255, 0.05)" }
                                : { display: "transparent" }
                            }
                          >
                            <div className={styles.circleContainer}>
                              <div className={styles.topCircle}></div>
                              <div className={styles.medCircle}></div>
                              <div className={styles.botCircle}></div>
                            </div>
                          </div>
                          <div
                            className={styles.displayOptions}
                            style={
                              displayOptions[app.id]
                                ? { display: "initial" }
                                : { display: "none" }
                            }
                          >
                            <Link href={`/applications/${app.id}`}>
                              <div className={styles.optionContainer}>
                                <p className={styles.link}>Visit</p>
                              </div>
                            </Link>
                            <div
                              className={styles.optionContainer}
                              onClick={handleFavorite}
                              data-id={app.id}
                            >
                              <p className={styles.link}>
                                {data.me.fApplications.length === 0
                                  ? "Favorite"
                                  : data.me.fApplications.map((application) => {
                                      if (application.id === app.id) {
                                        favorite = 1;
                                      }
                                      if (
                                        favorite === 1 &&
                                        data.me.fApplications.indexOf(
                                          application
                                        ) ===
                                          data.me.fApplications.length - 1
                                      ) {
                                        return "Unfavorite";
                                      } else if (
                                        favorite === 0 &&
                                        data.me.fApplications.indexOf(
                                          application
                                        ) ===
                                          data.me.fApplications.length - 1
                                      ) {
                                        return "Favorite";
                                      }
                                    })}
                              </p>
                            </div>
                          </div>
                        </section>
                      </div>
                    );
                  })
                )}
              </div>
            ) : null}
          </section>
          <section className={styles.savedIdeas}>
            <header className={styles.head}>
              <h3 className={styles.title}>Saved Ideas</h3>
              <p className={styles.desc}>
                Here are your saved ideas from the idea generator.
              </p>
            </header>
            {data ? (
              data.me.savedIdeas.length > 0 ? (
                data.me.savedIdeas.map((idea, idx) => {
                  const id = idea.content;
                  return (
                    <div
                      className={styles.idea}
                      style={
                        ideaDisplay[idea.content] ? { display: "none" } : null
                      }
                      key={idea.content}
                    >
                      <div className={styles.top}>
                        <h4 className={styles.title}>{idea.title}</h4>
                        <div className={styles.utilsContainer}>
                          {!reveal[id] ? (
                            <FontAwesomeIcon
                              data-id={idea.content}
                              icon={faArrowDown}
                              className={styles.icon}
                              onClick={handleRevealSection}
                            />
                          ) : (
                            <FontAwesomeIcon
                              data-id={idea.content}
                              icon={faArrowUp}
                              className={styles.icon}
                              onClick={handleRevealSection}
                            />
                          )}
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={styles.delete}
                            onClick={handleSaveIdea}
                            data-prompt={idea.prompt}
                            data-content={idea.content}
                            data-title={idea.title}
                          />
                        </div>
                      </div>
                      <div
                        className={styles.bottom}
                        style={reveal[id] ? { display: "initial" } : null}
                      >
                        <p className={styles.content}>{idea.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <p className={styles.noIdeas}>You haven't saved any ideas.</p>
                  <Link href="/user/dashboard/idea-generator">
                    <p className={styles.link}>
                      Go to{" "}
                      <span className={styles.special}>Idea Generator.</span>
                    </p>
                  </Link>
                </>
              )
            ) : null}
          </section>
        </section>
      </section>
    </main>
  );
}

Dashboard.getLayout = (page) => (
  <Layout title="Dashboard - Edutech">{page}</Layout>
);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let isAuthenticated = false;
  let sid = false;
  if (req.cookies.hasOwnProperty("qid")) {
    isAuthenticated = true;
  }
  if (req.cookies.hasOwnProperty("sid")) {
    sid = true;
  }
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }

  return {
    props: { sid },
  };
};
export default Dashboard;
