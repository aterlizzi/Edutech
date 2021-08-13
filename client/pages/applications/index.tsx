import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import Layout from "../../components/layout";
import NavComponent from "../../components/NavComponent";
import styles from "../../styles/Applications.module.scss";
import Link from "next/link";
import { v4 } from "uuid";
import {
  faNewspaper,
  faMap,
  faScroll,
  faCopy,
  faPaperPlane,
  faExternalLinkAlt,
  faEyeSlash,
  faEye,
  faSearch,
  faPlus,
  faTrash,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colleges from "../../public/colleges";
const Me = `
  query {
    me {
      username
      subscriber
      viewed {
        id
      }
      fApplications {
        id
      }
    }
  }

`;
const FindApplications = `
  query($colleges: [String!]!, $categories: [String!]!, $take: Float!) {
    findApplications(colleges: $colleges, categories: $categories, take: $take) {
      id
      gpaScore
      satScore
      graduationDate
      author {
        username
      }
      viewers {
        username
      }
    }
  }
`;

const FavoriteApplication = `
  mutation($id: Float!) {
    favoriteApplication(id: $id)
  }


`;
const randomIcon = [faNewspaper, faMap, faScroll, faCopy, faPaperPlane];
const collegeArr = colleges.split(",");

function randomInt() {
  return Math.floor(Math.random() * 5);
}

function Index({ vid, sid }) {
  const [take, setTake] = useState(15);
  const [selected, setSelected] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [display, setDisplay] = useState(false);
  const [render, setRender] = useState("");
  const [search, setSearch] = useState("");
  const [colors, setColors] = useState({});
  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const [appResult, reexecuteApp] = useQuery({
    query: FindApplications,
    variables: { take, categories: selected, colleges: accepted },
    pause: !accepted || !selected,
  });
  const [faveResult, favoriteApplication] = useMutation(FavoriteApplication);
  const { data: meData, fetching: meFetching, error: meError } = meResult;
  const { data: appData, fetching: appFetching, error: appError } = appResult;

  const handleSortClick = () => {
    setDisplay(!display);
  };
  const handleAddCategory = (e) => {
    let currentCategories = selected;
    let acceptedArr = accepted;
    if (currentCategories.includes(e.currentTarget.getAttribute("data-type"))) {
      currentCategories.splice(
        currentCategories.indexOf(e.currentTarget.getAttribute("data-type")),
        1
      );
      setSelected(currentCategories);
      setRender(v4());
    } else {
      if (
        (currentCategories.includes("Most views") ||
          currentCategories.includes("Highest rating") ||
          currentCategories.includes("Most recent")) &&
        e.currentTarget.getAttribute("data-sort") === "sortBy"
      ) {
        switch (currentCategories.indexOf("Most views")) {
          case -1:
            break;
          default:
            currentCategories.splice(
              currentCategories.indexOf("Most views"),
              1
            );
            break;
        }
        switch (currentCategories.indexOf("Highest rating")) {
          case -1:
            break;
          default:
            currentCategories.splice(
              currentCategories.indexOf("Highest rating"),
              1
            );
            break;
        }
        switch (currentCategories.indexOf("Most recent")) {
          case -1:
            break;
          default:
            currentCategories.splice(
              currentCategories.indexOf("Most recent"),
              1
            );
            break;
        }
      } else if (e.currentTarget.getAttribute("data-sort") === "college") {
        if (!acceptedArr.includes(e.currentTarget.getAttribute("data-type"))) {
          acceptedArr.push(e.currentTarget.getAttribute("data-type"));
          setAccepted(acceptedArr);
          setRender(v4());
        }
      }
      if (e.currentTarget.getAttribute("data-sort") === "sortBy") {
        currentCategories.push(e.currentTarget.getAttribute("data-type"));
        setSelected(currentCategories);
        setRender(v4());
      }
    }
  };
  const handleRemoveCollege = (e) => {
    let acceptedArr = accepted;
    acceptedArr.splice(
      acceptedArr.indexOf(e.currentTarget.getAttribute("data-type")),
      1
    );
    setAccepted(acceptedArr);
    setRender(v4());
  };
  const handleSubmit = () => {
    const variables = {
      take,
      categories: selected,
      colleges: accepted,
    };
    reexecuteApp(variables);
  };
  const handleAllClear = () => {
    setAccepted([]);
    setSelected([]);
    setSearch("");
    setDisplay(true);
  };
  const handleFaveClick = (e) => {
    const id = parseInt(e.currentTarget.getAttribute("data-appid"));
    const variables = {
      id,
    };
    console.log(id);
    favoriteApplication(variables).then((result) => {
      console.log(result.data);
    });
    if (!colors[id]) {
      setColors({ ...colors, [id]: true });
    } else {
      setColors({ ...colors, [id]: !colors[id] });
    }
  };
  return (
    <main className={styles.main}>
      <NavComponent data={meFetching ? "" : meData.me} vid={vid} sid={sid} />
      <section className={styles.sortbyContainer}>
        <header className={styles.sortHeader}>
          <h2 className={styles.prompt}>
            Sort <span className={styles.emphasized}>applications</span> by:
          </h2>
          <div className={styles.searchContainer} onClick={handleSortClick}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <div className={styles.categories}>
              {selected.length > 0
                ? selected.map((category, idx) => {
                    return (
                      <p key={idx} className={styles.category}>
                        {category}
                      </p>
                    );
                  })
                : null}
              {accepted.length > 0
                ? accepted.map((category, idx) => {
                    return (
                      <p key={idx} className={styles.category}>
                        {category}
                      </p>
                    );
                  })
                : null}
              {selected.length === 0 && accepted.length === 0 ? (
                <p className={styles.category}>All</p>
              ) : null}
            </div>
            <FontAwesomeIcon
              icon={faTrash}
              onClick={handleAllClear}
              className={styles.trashcan}
            />
          </div>
          {display ? (
            <section className={styles.categorySection}>
              <div className={styles.categoryGrid}>
                <div className={styles.sort}>
                  <h4 className={styles.categoryName}>Sort By Category</h4>
                  <p
                    data-type="Most views"
                    data-sort="sortBy"
                    onClick={handleAddCategory}
                    className={styles.item}
                    style={
                      selected.includes("Most views")
                        ? {
                            color: "#bb86fc",
                            border: "2px solid rgba(187, 134, 252, .5)",
                          }
                        : null
                    }
                  >
                    Most views
                  </p>
                  <p
                    data-type="Highest rating"
                    data-sort="sortBy"
                    onClick={handleAddCategory}
                    className={styles.item}
                    style={
                      selected.includes("Highest rating")
                        ? {
                            color: "#bb86fc",
                            border: "2px solid rgba(187, 134, 252, .5)",
                          }
                        : null
                    }
                  >
                    Highest rating
                  </p>
                  <p
                    data-type="Most recent"
                    data-sort="sortBy"
                    onClick={handleAddCategory}
                    className={styles.item}
                    style={
                      selected.includes("Most recent")
                        ? {
                            color: "#bb86fc",
                            border: "2px solid rgba(187, 134, 252, .5)",
                          }
                        : null
                    }
                  >
                    Most recent
                  </p>
                </div>
                <div className={styles.sort}>
                  <h4 className={styles.categoryName}>
                    Sort By Accepted College
                  </h4>
                  <p
                    onClick={() => {
                      (
                        document.getElementById("search") as HTMLInputElement
                      ).value = "";
                      setSearch("");
                    }}
                    className={styles.clear}
                  >
                    Clear search
                  </p>
                  {accepted.length > 0
                    ? accepted.map((college, idx) => {
                        return (
                          <p
                            onClick={handleRemoveCollege}
                            data-type={college}
                            key={idx}
                            className={styles.category}
                          >
                            {college}
                          </p>
                        );
                      })
                    : null}
                  <div className={styles.collegeSearchContainer}>
                    <FontAwesomeIcon
                      icon={faSearch}
                      className={styles.searchIcon}
                    />
                    <input
                      type="text"
                      className={styles.collegeInput}
                      placeholder="Search..."
                      onChange={(e) => setSearch(e.currentTarget.value)}
                      id="search"
                    />
                  </div>
                  <section className={styles.collegeContainer}>
                    {collegeArr
                      .filter((college) => {
                        if (search === "" || accepted.includes(college)) {
                          return false;
                        } else if (
                          college.toLowerCase().includes(search.toLowerCase())
                        ) {
                          return true;
                        }
                      })
                      .map((college, idx) => {
                        return (
                          <div key={idx} className={styles.college}>
                            <p className={styles.collegeText}>{college}</p>
                            <FontAwesomeIcon
                              icon={faPlus}
                              className={styles.plus}
                              data-type={college}
                              data-sort="college"
                              onClick={handleAddCategory}
                            />
                          </div>
                        );
                      })}
                  </section>
                </div>
              </div>
            </section>
          ) : null}
          {!display ? (
            <p className={styles.instruction}>
              Click the search bar to add categories.
            </p>
          ) : selected.length === 0 && accepted.length === 0 ? (
            <p className={styles.instruction}>Click a category to add it.</p>
          ) : (
            <p className={styles.instruction}>
              To remove a category, click it again.
            </p>
          )}
          {selected.length > 0 || accepted.length > 0 ? (
            <button onClick={handleSubmit} className={styles.searchBtn}>
              Search Again
            </button>
          ) : null}
        </header>
      </section>
      {meFetching ? (
        "Loading..."
      ) : (
        <div className={styles.gridContainer}>
          {meData.me.subscriber ? (
            <section
              style={
                !appData || appData.findApplications.length === 0
                  ? {
                      gridTemplateColumns: "1fr",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : null
              }
              className={`${styles.appSection} ${styles.grid}`}
            >
              {!appData || appData.findApplications.length === 0 ? (
                <div className={styles.errorContainer}>
                  <h3 className={styles.emoji}>◉_◉</h3>
                  <p className={styles.error}>
                    We either couldn't load or couldn't find applications of
                    those search parameters.
                  </p>
                </div>
              ) : (
                appData.findApplications.map((application) => {
                  let viewed = 0;
                  let favorite: number = 0;
                  return (
                    <div key={application.id} className={styles.card}>
                      <header className={styles.header}>
                        <FontAwesomeIcon
                          icon={faMap}
                          color={"#bb86fc"}
                          size={"2x"}
                        />
                        {meData.me.viewed.map((obj) => {
                          if (obj.id === application.id) {
                            viewed = 1;
                            return (
                              <div
                                key={obj.id}
                                className={styles.viewContainer}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  size={"lg"}
                                  color={"#03dac6"}
                                  className={styles.icon}
                                />
                                <p className={styles.viewText}>Seen</p>
                              </div>
                            );
                          } else if (
                            meData.me.viewed.indexOf(obj) ===
                              meData.me.viewed.length - 1 &&
                            viewed === 0
                          ) {
                            return (
                              <div
                                key={obj.id}
                                className={styles.viewContainer}
                              >
                                <FontAwesomeIcon
                                  icon={faEyeSlash}
                                  size={"lg"}
                                  color={"#a7a7a7"}
                                />
                              </div>
                            );
                          }
                        })}
                        {meData.me.fApplications.length === 0 ? (
                          <FontAwesomeIcon
                            className={styles.unfavIcon}
                            icon={faStar}
                            size={"lg"}
                            onClick={(e) => {
                              handleFaveClick(e);
                            }}
                            data-appid={application.id}
                            style={
                              colors[application.id]
                                ? colors[application.id]
                                  ? { color: "#03dac6" }
                                  : { color: "#a7a7a7" }
                                : { color: "#a7a7a7" }
                            }
                            data-type="unfave"
                          />
                        ) : (
                          meData.me.fApplications.map((fApplication, idx) => {
                            if (fApplication.id === application.id) {
                              favorite = 1;
                              return (
                                <FontAwesomeIcon
                                  className={styles.unfavIcon}
                                  icon={faStar}
                                  size={"lg"}
                                  onClick={(e) => {
                                    handleFaveClick(e);
                                  }}
                                  data-appid={application.id}
                                  style={
                                    colors[application.id]
                                      ? colors[application.id] === true
                                        ? { color: "#a7a7a7" }
                                        : { color: "#03dac6" }
                                      : { color: "#03dac6" }
                                  }
                                  key={idx}
                                />
                              );
                            } else if (
                              meData.me.fApplications.indexOf(fApplication) ===
                                meData.me.fApplications.length - 1 &&
                              favorite === 0
                            ) {
                              return (
                                <FontAwesomeIcon
                                  className={styles.unfavIcon}
                                  icon={faStar}
                                  size={"lg"}
                                  onClick={(e) => {
                                    handleFaveClick(e);
                                  }}
                                  data-appid={application.id}
                                  style={
                                    colors[application.id]
                                      ? colors[application.id]
                                        ? { color: "#03dac6" }
                                        : { color: "#a7a7a7" }
                                      : { color: "#a7a7a7" }
                                  }
                                  key={idx}
                                />
                              );
                            }
                          })
                        )}

                        <Link href={`/applications/${application.id}`}>
                          <a target="_blank">
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              color={"rgba(white, 0.87)"}
                              size={"lg"}
                              className={styles.link}
                            />
                          </a>
                        </Link>
                      </header>
                      <h3 className={styles.scoreText}>
                        {application.gpaScore}
                      </h3>
                      <h3 className={styles.scoreText}>
                        {parseInt(application.satScore[0]) +
                          parseInt(application.satScore[1])}
                      </h3>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Magni provident incidunt illum quaerat optio eius iusto
                        asperiores repudiandae minima iste mollitia laborum
                        dolorem, amet facilis soluta quod voluptatum,
                        exercitationem harum? Deleniti praesentium vitae esse
                        est accusantium optio dolore non, modi autem illum
                        blanditiis excepturi quod debitis tempore eligendi nobis
                        totam.
                      </p>
                      <div className={styles.bottomContainer}>
                        <p className={styles.username}>
                          {!application.author
                            ? "Anonymous"
                            : application.author.username}
                        </p>
                        <p className={styles.visit}>
                          <Link href={`/applications/${application.id}`}>
                            Visit
                          </Link>
                        </p>
                        <p className={styles.graduationDate}>
                          {application.graduationDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          ) : (
            "You need to be a subscriber to access applications."
          )}
        </div>
      )}
    </main>
  );
}

Index.getLayout = (page) => <Layout title="Applications">{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let vid = false;
  let sid = false;
  if (req.cookies.hasOwnProperty("vid")) {
    vid = true;
  }
  if (req.cookies.hasOwnProperty("sid")) {
    sid = true;
  }
  if (!req.cookies.hasOwnProperty("qid")) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }
  if (!req.cookies.hasOwnProperty("sid")) {
    return {
      redirect: {
        destination: "/applications/payments",
        permanent: false,
      },
    };
  }
  return {
    props: { vid, sid },
  };
};
export default Index;
