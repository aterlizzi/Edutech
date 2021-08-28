import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import Layout from "../components/layout";
import NavComponent from "../components/NavComponent";
import styles from "../styles/Contact.module.scss";
import autosize from "autosize";

const Me = `
  query {
    me {
      username
    }
  }
`;
const SendEmail = `
  mutation($options: sendContactEmailInput!) {
    sendContactEmail(options: $options)
  }
`;

function Contact({ vid, sid }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Billing");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);

  const [result, reexecuteMe] = useQuery({ query: Me });
  const [emailResult, sendEmail] = useMutation(SendEmail);

  const { data, fetching, error } = result;
  useEffect(() => {
    autosize(document.querySelector("textarea"));
  }, []);
  console.log(emailResult.fetching);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    const variables = {
      options: {
        content,
        subject,
        firstName,
        lastName,
        email,
      },
    };
    sendEmail(variables).then((result) => {
      if (result.data) {
        setSuccess(true);
      }
    });
  };

  return (
    <main className={styles.main}>
      <NavComponent data={fetching ? "" : data.me} sid={sid} vid={vid} />
      <section className={styles.contact}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contact us</h1>
        </header>
        <section className={styles.content}>
          <form action="" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formContainer}>
              <label htmlFor="firstName" className={styles.label}>
                First name
              </label>
              <input
                type="text"
                id="firstName"
                required
                className={styles.input}
                placeholder="Jane"
                onChange={(e) => {
                  setFirstName(e.currentTarget.value);
                }}
              />
            </div>
            <div className={styles.formContainer}>
              <label htmlFor="lastName" className={styles.label}>
                Last name
              </label>
              <input
                type="text"
                className={styles.input}
                required
                placeholder="Doe"
                id="lastName"
                onChange={(e) => {
                  setLastName(e.currentTarget.value);
                }}
              />
            </div>
            <div className={styles.formContainer}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className={styles.input}
                placeholder="jane.doe@example.com"
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
              />
            </div>
            <div className={styles.formContainer}>
              <label htmlFor="subject" className={styles.label}>
                Subject
              </label>
              <select
                onChange={(e) => setSubject(e.currentTarget.value)}
                name="subject"
                className={styles.select}
                id="subject"
                required
              >
                <option value="Billing">Billing</option>
                <option value="Question">Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formContainer}>
              <label
                htmlFor="textField"
                className={`${styles.label} ${styles.specialLabel}`}
              >
                Anything else?
              </label>
              <textarea
                name="textField"
                id="textField"
                className={styles.textField}
                onChange={(e) => setContent(e.currentTarget.value)}
                placeholder="Tell us more about your comments, concerns, or questions!"
              ></textarea>
            </div>
            {success ? (
              <p className={styles.success}>Success! We got your message.</p>
            ) : null}
            <div className={styles.btnContainer}>
              <button className={styles.btn}>
                {!emailResult.fetching ? (
                  "Contact Us"
                ) : (
                  <div
                    className={`${styles.loader} ${styles.loaderStyle2}`}
                    title="1"
                  >
                    <svg
                      version="1.1"
                      id="loader-1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="40px"
                      height="40px"
                      viewBox="0 0 50 50"
                      xmlSpace="preserve"
                      className={styles.svg}
                    >
                      <path
                        className={styles.path}
                        fill="#000"
                        d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                      >
                        <animateTransform
                          attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
          <div className={styles.about}>
            <h3 className={styles.aboutTitle}>Using Edutech you can:</h3>
            <div className={styles.listItem}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
              <p className={styles.itemText}>
                Focus your time on editing not waiting
              </p>
            </div>
            <div className={styles.listItem}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
              <p className={styles.itemText}>
                Brainstorm essay ideas with one click
              </p>
            </div>
            <div className={styles.listItem}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
              <p className={styles.itemText}>
                Generate inspiration with the click of a button
              </p>
            </div>
          </div>
        </section>
      </section>
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>
      <div className={styles.circle4}></div>
    </main>
  );
}

Contact.getLayout = (page) => {
  return <Layout title="Contact Us - Edutech">{page}</Layout>;
};
export default Contact;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let vid = false;
  let sid = false;
  if (req.cookies.hasOwnProperty("vid")) {
    vid = true;
  }
  if (req.cookies.hasOwnProperty("sid")) {
    sid = true;
  }
  return {
    props: { vid, sid },
  };
};
