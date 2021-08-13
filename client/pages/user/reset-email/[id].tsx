import styles from "../../../styles/ResetEmail.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "urql";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../../components/layout";

const ResetEmailMutation = `
    mutation($token: String!) {
        verifyEmail(token: $token) {
            username
        }
    }


`;

function ResetEmail() {
  const router = useRouter();
  const [result, confirmUser] = useMutation(ResetEmailMutation);
  const [errors, setErrors] = useState(false);

  const { fetching } = result;
  useEffect(() => {
    const token = router.query.id;
    const variables = {
      token,
    };
    console.log(variables);
    confirmUser(variables).then((result) => {
      if (result.error || !result.data.verifyEmail) {
        console.log(result);
        setErrors(true);
        setTimeout(() => {
          router.push("/");
        }, 10000);
      } else {
        setTimeout(() => {
          router.push("/");
        }, 10000);
      }
    });
  }, []);

  return (
    <main className={styles.main}>
      {!fetching ? (
        <header className={styles.header}>
          {!errors ? (
            <h1 className={styles.textEmoji}>(•◡•) /</h1>
          ) : (
            <h1 className={styles.textEmoji} style={{ color: "#cf6679" }}>
              (ㆆ_ㆆ)
            </h1>
          )}
          {!errors ? (
            <h4 className={styles.text}>
              You're good to go, we got you covered from here. I'll tell my AI
              to
              <span className={styles.span}> redirect</span> you to the{" "}
              <span className={styles.span}> Home page</span> in a few. Enjoy
              your new, shiny <span className={styles.span}> email!</span>
            </h4>
          ) : (
            <h4 className={styles.text}>
              It's as we feared... something has gone{" "}
              <span style={{ color: "#cf6679" }}>wrong!</span> No worries, I'll
              <span style={{ color: "#cf6679" }}> redirect</span> you in a few
              seconds back to the
              <span style={{ color: "#cf6679" }}> Home page.</span> Sorry for
              the inconvience!
            </h4>
          )}
          {!errors ? (
            <Link href="/">
              <button className={styles.redirectBtn}>Redirect me now!</button>
            </Link>
          ) : (
            <Link href="/">
              <button
                className={styles.redirectBtn}
                style={{ background: "#cf6679" }}
              >
                Redirect me now!
              </button>
            </Link>
          )}
        </header>
      ) : (
        <header className={styles.header}>
          <h1 className={styles.textEmoji}>Loading...</h1>
        </header>
      )}
    </main>
  );
}

ResetEmail.getLayout = (page) => (
  <Layout title="Reset Email - Edutech">{page}</Layout>
);

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
export default ResetEmail;
