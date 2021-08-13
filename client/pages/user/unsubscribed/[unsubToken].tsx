import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Layout from "../../../components/layout";
import { useMutation } from "urql";
import styles from "../../../styles/Unsubscribe.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const VerifyUnsub = `
  mutation($token: String!) {
    verifyUnsub(token: $token)
  }
`;
const UnsubEmail = `
  mutation($content: String!) {
    sendUnsubscribeMail(content: $content)
  }
`;

function Unsubscribed() {
  const router = useRouter();
  const [reason, setReason] = useState("");

  const [verifyResult, verifyUnsub] = useMutation(VerifyUnsub);
  const [unsubEmailResult, unsubEmail] = useMutation(UnsubEmail);

  useEffect(() => {
    const token = router.query.unsubToken;
    const variables = {
      token,
    };
    if (token) {
      verifyUnsub(variables).then((result) => {
        if (!result.data.verifyResult) {
          setTimeout(() => {
            router.push("/user/settings");
          }, 1000 * 6);
        }
      });
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason !== "") {
      const variables = {
        content: reason,
      };
      unsubEmail(variables).then(() => {
        router.push("/user/dashboard");
      });
    }
  };
  return (
    <main className={styles.main}>
      <Link href="/user/dashboard">
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
        </div>
      </Link>
      <section className={styles.card}>
        <header className={styles.head}>
          <h1 className={styles.title}>
            {verifyResult.data
              ? verifyResult.data.verifyUnsub
                ? "Unsubscribed... but hold on!"
                : "Whoops, something happened!"
              : "Loading..."}
          </h1>
          <p className={styles.desc}>
            {verifyResult.data
              ? verifyResult.data.verifyUnsub
                ? "I'm sad to see you go! It would mean a lot to me if you gave me some information about why we are to part ways! I use this kind of information to improve my products."
                : "I'm not sure what has happened! Check your settings page to see whether or not you were properly unsubscribed. If you were not, try again."
              : null}
          </p>
        </header>
        {verifyResult.data ? (
          verifyResult.data.verifyUnsub ? (
            <section className={styles.bodyContent}>
              <form onSubmit={handleSubmit} action="" className={styles.form}>
                <label className={styles.label} htmlFor="text">
                  I've unsubscribed because...
                </label>
                <textarea
                  className={styles.textarea}
                  name="text"
                  id="text"
                  onChange={(e) => {
                    setReason(e.currentTarget.value);
                  }}
                  required
                  placeholder="ex. The product is no longer needed."
                ></textarea>
                {unsubEmailResult.fetching ? (
                  <div className={styles.ldsRoller}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <input type="submit" className={styles.btn} />
                )}
              </form>
            </section>
          ) : null
        ) : null}
      </section>
    </main>
  );
}

export default Unsubscribed;

Unsubscribed.getLayout = (page) => {
  return <Layout title="Unsubscribe - Edutech">{page}</Layout>;
};

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
