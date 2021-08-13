import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import Layout from "../../components/layout";
import styles from "../../styles/ChangePassToken.module.scss";

const VerifyToken = `
    query($token: String!) {
        verifyChangePassToken(token: $token)
    }
`;
const ResetPassword = `
    mutation($token: String!, $newPass: String!) {
      resetPassword(token: $token, newPass: $newPass) {
        username
      }
    }

`;

function ChangePassToken() {
  const router = useRouter();
  const token = router.query.changePassToken;
  const [newPass, setNewPass] = useState("");
  const [verifyResult, reexecuteVerify] = useQuery({
    query: VerifyToken,
    variables: { token },
    pause: !token,
  });
  const [resetPassResult, resetPass] = useMutation(ResetPassword);
  const {
    data: verifyData,
    fetching: verifyFetching,
    error: verifyError,
  } = verifyResult;
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [newPassError, setNewPassError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (confirmPass !== newPass && confirmPass !== "") {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [newPass, confirmPass]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmPass !== newPass) {
      return;
    }
    if (newPass.length < 8) {
      setNewPassError(true);
      return;
    }
    const variables = {
      token,
      newPass,
    };
    resetPass(variables).then((result) => {
      console.log(result);
      if (result.error) {
        console.log(result.error);
        setError(true);
      } else if (
        result.data.resetPassword === undefined ||
        result.data.resetPassword === null
      ) {
        setError(true);
      } else if (result.data.resetPassword) {
        setSuccess(true);
      }
    });
  };
  return (
    <main className={styles.main}>
      {verifyData ? (
        verifyData.verifyChangePassToken ? (
          <form action="" className={styles.form} onSubmit={handleSubmit}>
            {!resetPassResult.data ? (
              <>
                {" "}
                <header className={styles.header}>
                  <h1 className={styles.title}>Reset Password</h1>
                  <p className={styles.desc}>
                    Fill out the from below in order to reset your password.
                  </p>
                </header>
                <label className={styles.label} htmlFor="pass">
                  New Password:
                </label>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faKey} className={styles.icon} />
                  <input
                    type="password"
                    id="pass"
                    onChange={(e) => setNewPass(e.currentTarget.value)}
                    className={styles.input}
                    placeholder="ex. v(x*d{Td.5}<C35q"
                    required
                  />
                </div>
                {newPassError ? (
                  <div className={styles.errorContainer}>
                    <p className={styles.error}>
                      Your password must be equal to or greater than 8
                      characters.
                    </p>
                  </div>
                ) : null}
                <label className={styles.label} htmlFor="confirmPass">
                  Confirm Password:
                </label>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faKey} className={styles.icon} />
                  <input
                    type="password"
                    id="confirmPass"
                    onChange={(e) => setConfirmPass(e.currentTarget.value)}
                    className={styles.input}
                    placeholder="ex. v(x*d{Td.5}<C35q"
                    required
                  />
                </div>
                {passwordMatch ? (
                  <input
                    type="submit"
                    value="Reset"
                    onClick={() => {
                      setNewPassError(false);
                    }}
                    className={styles.btn}
                  />
                ) : null}
              </>
            ) : (
              <>
                <header className={styles.header}>
                  <h1 className={styles.title}>
                    {error ? "Whoops!" : "Success!"}
                  </h1>
                  <p className={styles.desc}>
                    {error
                      ? "Something went wrong! No worries, contact support or try again."
                      : `You're good to go ${resetPassResult.data.resetPassword.username}! Your password is reset. Click the button below to redirect.`}
                  </p>
                </header>
                <section className={styles.btnContainer}>
                  <Link href="/user/dashboard">
                    <button className={styles.btn}>Dashboard</button>
                  </Link>
                </section>
              </>
            )}
          </form>
        ) : (
          <div className={styles.errorContainer}>
            <h2 className={styles.textEmoji}>( ͡❛ ₒ ͡❛)</h2>
            <p className={styles.text}>
              Whoops! Something went wrong.{" "}
              <Link href="/">
                <u className={styles.special}>
                  Click me to redirect to home page.
                </u>
              </Link>
            </p>
          </div>
        )
      ) : (
        <p>Loading...</p>
      )}
      <p
        style={
          !passwordMatch ? { visibility: "visible" } : { visibility: "hidden" }
        }
        className={styles.passMatch}
      >
        Your passwords don't match.
      </p>
    </main>
  );
}

ChangePassToken.getLayout = (page) => (
  <Layout title="Reset Password - Edutech">{page}</Layout>
);

export default ChangePassToken;
