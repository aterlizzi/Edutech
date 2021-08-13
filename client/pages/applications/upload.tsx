import { GetServerSideProps } from "next";
import { useState } from "react";
import { useMutation } from "urql";
import styles from "../../styles/Upload.module.scss";
import logo from "../../public/logoHorizontal.png";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  faPlus,
  faMinus,
  faSearch,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 } from "uuid";
import colleges from "../../public/colleges";

const uploadPDF = `
  mutation ($pdf: Upload!, $display: Boolean!, $accepted: [String!]!, $rejected: [String!]!, $waitlisted: [String!]!) {
    uploadAppPDF (pdf: $pdf, display: $display, accepted: $accepted, rejected: $rejected, waitlisted: $waitlisted)
  }
`;

const collegesArr = colleges.split(",");
export default function Upload() {
  const router = useRouter();
  const [uploadAppPDFResult, uploadAppPDF] = useMutation(uploadPDF);
  const [variables, setVariables]: any = useState({});
  const [display, setDisplay] = useState(true);
  const [search, setSearch] = useState("");
  const [searchReject, setSearchReject] = useState("");
  const [searchWaitlist, setSearchWaitlist] = useState("");
  const [acceptedColleges, setAcceptedColleges] = useState([]);
  const [rejectedColleges, setRejectedColleges] = useState([]);
  const [waitlistedColleges, setWaitlistedColleges] = useState([]);
  const [rerender, setReRender] = useState("");
  const [received, setReceived] = useState(false);
  const handleFileChange = (e: any) => {
    const pdf = e.target.files[0];
    if (!pdf) return;
    setReceived(true);
    console.log(pdf);
    setVariables({ pdf });
  };
  const handleClick = () => {
    router.back();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let someObj = variables;
    someObj["display"] = display;
    someObj["accepted"] = acceptedColleges;
    someObj["rejected"] = rejectedColleges;
    someObj["waitlisted"] = waitlistedColleges;
    setVariables(someObj);
    uploadAppPDF(variables).then((result) => {
      console.log(result.error);
    });
  };
  const handleAddCollege = (e) => {
    let currentAcceptArr = acceptedColleges;
    let currentRejectedArr = rejectedColleges;
    let currentWaitlistArr = waitlistedColleges;
    if (
      e.currentTarget.getAttribute("data-type") === "accept" &&
      !acceptedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentAcceptArr.push(e.currentTarget.getAttribute("data-college"));
      setAcceptedColleges(currentAcceptArr);
      setReRender(v4());
    } else if (
      e.currentTarget.getAttribute("data-type") === "reject" &&
      !rejectedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentRejectedArr.push(e.currentTarget.getAttribute("data-college"));
      setRejectedColleges(currentRejectedArr);
      setReRender(v4());
    } else if (
      e.currentTarget.getAttribute("data-type") === "wait" &&
      !waitlistedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentWaitlistArr.push(e.currentTarget.getAttribute("data-college"));
      setWaitlistedColleges(currentWaitlistArr);
      setReRender(v4());
    }
  };
  const handleRemoveCollege = (e) => {
    let currentAcceptArr = acceptedColleges;
    let currentRejectArr = rejectedColleges;
    let currentWaitlistArr = waitlistedColleges;
    if (
      e.currentTarget.getAttribute("data-type") === "accept" &&
      acceptedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentAcceptArr.splice(
        currentAcceptArr.indexOf(e.currentTarget.getAttribute("data-college")),
        1
      );
      setAcceptedColleges(acceptedColleges);
      setReRender(v4());
    }
    if (
      e.currentTarget.getAttribute("data-type") === "reject" &&
      rejectedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentRejectArr.splice(
        currentRejectArr.indexOf(e.currentTarget.getAttribute("data-college")),
        1
      );
      setRejectedColleges(currentRejectArr);
      setReRender(v4());
    }
    if (
      e.currentTarget.getAttribute("data-type") === "wait" &&
      waitlistedColleges.includes(e.currentTarget.getAttribute("data-college"))
    ) {
      currentWaitlistArr.splice(
        currentWaitlistArr.indexOf(
          e.currentTarget.getAttribute("data-college")
        ),
        1
      );
      setWaitlistedColleges(currentWaitlistArr);
      setReRender(v4());
    }
  };
  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image src={logo} />
          </div>
          <h1 className={styles.title}>Upload Application</h1>
          <p className={styles.subTitle}>
            Names are <span className={styles.emphasized}>anonymized</span>,
            sensistive information is{" "}
            <span className={styles.emphasized}>discarded</span>, identifying
            information is{" "}
            <span className={styles.emphasized}>never stored</span>.
          </p>
        </header>
        <form
          className={`${styles.form} ${styles.grid}`}
          action=""
          onSubmit={handleSubmit}
        >
          <div className={styles.leftContainer}>
            <div className={styles.displayContainer}>
              <p className={styles.labelText}>
                Display username on application?
              </p>
              <label className={styles.label} htmlFor="yes">
                <input
                  className={styles.input}
                  type="radio"
                  name="display"
                  id="yes"
                  defaultChecked
                  required
                />
                <span className={styles.design}></span>
                <span className={styles.text}>Yes</span>
              </label>
              <label htmlFor="no" className={styles.label}>
                <input
                  className={styles.input}
                  type="radio"
                  name="display"
                  id="no"
                  required
                />
                <span className={styles.design}></span>
                <span className={styles.text}>No</span>
              </label>
            </div>
            <div className={styles.uploadContainer}>
              <p className={styles.labelText}>Source file</p>
              <label htmlFor="upload" className={styles.uploadLabel}>
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className={styles.uploadIcon}
                  color={"rgba(white, 0.87)"}
                />{" "}
                Upload App
              </label>
              <input
                id="upload"
                type="file"
                onChange={handleFileChange}
                name="pdf"
                accept=".pdf"
                className={styles.upload}
                required
              />
              {received ? (
                <p className={styles.received}>
                  Received{" "}
                  <span className={styles.pdfName}>{variables.pdf.name}</span>
                </p>
              ) : null}
            </div>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.acceptedContainer}>
              <section className={styles.topBar}>
                <p className={styles.labelText}>Accepted Colleges:</p>
              </section>
              {!acceptedColleges
                ? null
                : acceptedColleges.map((college, idx) => {
                    return (
                      <div key={idx} className={styles.collegeTextContainer}>
                        <p className={styles.collegeText}>{college}</p>{" "}
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={"#bb86fc"}
                          data-college={college}
                          data-type="accept"
                          onClick={handleRemoveCollege}
                        />
                      </div>
                    );
                  })}
              <section className={styles.acceptInputsContainer}>
                <div className={styles.searchBarContainer}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.icon}
                    color={'"rgba(white, 0.87)"'}
                  />
                  <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.currentTarget.value)}
                  />
                </div>
                <div className={styles.searchContainer}>
                  {collegesArr
                    .filter((college) => {
                      if (search === "" || acceptedColleges.includes(college)) {
                        return false;
                      } else if (
                        college.toLowerCase().includes(search.toLowerCase())
                      ) {
                        return true;
                      }
                    })
                    .map((college, idx) => {
                      return (
                        <div key={idx} className={styles.collegeContainer}>
                          <p className={styles.college}>{college}</p>
                          <FontAwesomeIcon
                            icon={faPlus}
                            color={"#03dac6"}
                            onClick={handleAddCollege}
                            data-type="accept"
                            data-college={college}
                            className={styles.icon}
                          />
                        </div>
                      );
                    })}
                </div>
              </section>
            </div>
            <div className={styles.acceptedContainer}>
              <section className={styles.topBar}>
                <p className={styles.labelText}>Rejected Colleges:</p>
              </section>
              {!rejectedColleges
                ? null
                : rejectedColleges.map((college, idx) => {
                    return (
                      <div key={idx} className={styles.collegeTextContainer}>
                        <p className={styles.collegeText}>{college}</p>{" "}
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={"#bb86fc"}
                          data-college={college}
                          data-type="reject"
                          onClick={handleRemoveCollege}
                        />
                      </div>
                    );
                  })}
              <section className={styles.acceptInputsContainer}>
                <div className={styles.searchBarContainer}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.icon}
                    color={'"rgba(white, 0.87)"'}
                  />
                  <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search..."
                    onChange={(e) => setSearchReject(e.currentTarget.value)}
                  />
                </div>
                <div className={styles.searchContainer}>
                  {collegesArr
                    .filter((college) => {
                      if (
                        searchReject === "" ||
                        rejectedColleges.includes(college)
                      ) {
                        return false;
                      } else if (
                        college
                          .toLowerCase()
                          .includes(searchReject.toLowerCase())
                      ) {
                        return true;
                      }
                    })
                    .map((college, idx) => {
                      return (
                        <div key={idx} className={styles.collegeContainer}>
                          <p className={styles.college}>{college}</p>
                          <FontAwesomeIcon
                            icon={faPlus}
                            color={"#03dac6"}
                            onClick={handleAddCollege}
                            data-type="reject"
                            data-college={college}
                            className={styles.icon}
                          />
                        </div>
                      );
                    })}
                </div>
              </section>
            </div>
            <div className={styles.acceptedContainer}>
              <section className={styles.topBar}>
                <p className={styles.labelText}>Waitlisted Colleges:</p>
              </section>
              {!waitlistedColleges
                ? null
                : waitlistedColleges.map((college, idx) => {
                    return (
                      <div key={idx} className={styles.collegeTextContainer}>
                        <p className={styles.collegeText}>{college}</p>{" "}
                        <FontAwesomeIcon
                          icon={faMinus}
                          color={"#bb86fc"}
                          data-college={college}
                          data-type="wait"
                          onClick={handleRemoveCollege}
                        />
                      </div>
                    );
                  })}
              <section className={styles.acceptInputsContainer}>
                <div className={styles.searchBarContainer}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.icon}
                    color={'"rgba(white, 0.87)"'}
                  />
                  <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search..."
                    onChange={(e) => setSearchWaitlist(e.currentTarget.value)}
                  />
                </div>
                <div className={styles.searchContainer}>
                  {collegesArr
                    .filter((college) => {
                      if (
                        searchWaitlist === "" ||
                        waitlistedColleges.includes(college)
                      ) {
                        return false;
                      } else if (
                        college
                          .toLowerCase()
                          .includes(searchWaitlist.toLowerCase())
                      ) {
                        return true;
                      }
                    })
                    .map((college, idx) => {
                      return (
                        <div key={idx} className={styles.collegeContainer}>
                          <p className={styles.college}>{college}</p>
                          <FontAwesomeIcon
                            icon={faPlus}
                            color={"#03dac6"}
                            onClick={handleAddCollege}
                            data-type="wait"
                            data-college={college}
                            className={styles.icon}
                          />
                        </div>
                      );
                    })}
                </div>
              </section>
            </div>
          </div>
          <input className={styles.btn} type="submit" />
        </form>
        <div className={styles.returnArrowContainer} onClick={handleClick}>
          <div className={styles.relativePos}>
            <i className={styles.arrowLeft}></i>
            <i className={styles.arrowStick}></i>
          </div>
        </div>
      </section>
      <div className={styles.bigCircle}></div>
      <div className={styles.medCircle}></div>
      <div className={styles.smallCircle}></div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.hasOwnProperty("qid")) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
