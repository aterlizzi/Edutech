import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation } from "urql";

import styles from "../../../styles/ConfirmToken.module.scss";

const ConfirmUser = `
  mutation($token: String!) {
    confirmUser(token: $token)
  }

`;

function confirmToken() {
  const [result, confirmUser] = useMutation(ConfirmUser);
  const [errors, setErrors] = useState(false);
  const router = useRouter();

  const { fetching } = result;
  useEffect(() => {
    const token = router.query.confirmToken;
    const variables = {
      token,
    };
    confirmUser(variables).then((result) => {
      if (result.error || result.data.confirmUser === false) {
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
              your new found <span className={styles.span}> freedom!</span>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let isAuthenticated = false;
  if (req.cookies.hasOwnProperty("qid")) {
    isAuthenticated = true;
  }
  if (isAuthenticated) {
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
export default confirmToken;
