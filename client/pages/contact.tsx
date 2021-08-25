import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useQuery } from "urql";
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

function Contact({ vid, sid }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [result, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching, error } = result;
  useEffect(() => {
    autosize(document.querySelector("textarea"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
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
                className={styles.input}
                placeholder="jane.doe@example.com"
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
              />
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
                placeholder="Tell us more about your comments, concerns, or questions!"
              ></textarea>
            </div>
            <div className={styles.btnContainer}>
              <input type="submit" className={styles.btn} value="Contact Us" />
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
