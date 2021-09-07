import { GetServerSideProps } from "next";
import { useState } from "react";
import { useMutation } from "urql";
import styles from "../../styles/Login.module.scss";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logoHorizontal.png";
import forgotPass from "../../public/forgotPass.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHome,
  faLock,
  faTimes,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
const Login = `
    mutation ($email: String, $username: String, $password: String!) {
        login(email: $email, username: $username, password: $password) {
            email
            id
        }
    }
`;
const ResetPass = `
    mutation($email: String!) {
      forgotPassword(email: $email)
    }
`;

function login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [email, setEmail] = useState("");
  const [displayForgot, setDisplayForgot] = useState(false);
  const [sent, setSent] = useState(false);

  const [loginResult, login] = useMutation(Login);
  const [resetPassResult, resetPass] = useMutation(ResetPass);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let variables = {};
    if (emailUser.indexOf("@") >= 0) {
      variables = {
        email: emailUser,
        username: null,
        password,
      };
    } else {
      variables = {
        username: emailUser,
        email: null,
        password,
      };
    }
    login(variables).then((result) => {
      if (result.error || result.data.login === null) {
        setError(true);
      } else {
        router.push("/");
      }
    });
  };
  const handleResetPassword = (e) => {
    e.preventDefault();
    setSent(false);
    const variables = {
      email,
    };
    resetPass(variables).then((result) => {
      if (result.data) {
        setSent(true);
      }
    });
  };

  return (
    <main className={styles.main}>
      {!displayForgot ? (
        <div className={styles.logo}>
          <Image src={logo} />
        </div>
      ) : null}
      <section className={styles.card}>
        {!displayForgot ? (
          <>
            <header className={styles.header}>
              <h2 className={styles.title}>Sign In</h2>
              <p className={styles.subText}>Login to access your account.</p>
            </header>
            <form action="" className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
                <input
                  type="text"
                  id="email/username"
                  placeholder="Email or Username"
                  className={styles.emailUserInput}
                  onChange={(e) => setEmailUser(e.currentTarget.value)}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={styles.passwordInput}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                />
              </div>
              {error ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMsg}>
                    (╯°□°）╯︵ ┻━┻ <br />
                    Whoops! Either your password or email is incorrect!
                  </p>
                </div>
              ) : null}
              <div className={styles.submitBtnContainer}>
                <input
                  type="submit"
                  value={loginResult.fetching ? "" : "Sign in"}
                  className={styles.submitBtn}
                />
                {loginResult.fetching ? (
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
                ) : null}
              </div>
            </form>
          </>
        ) : (
          <>
            <div className={styles.return}>
              <FontAwesomeIcon
                icon={faTimes}
                style={{ cursor: "pointer" }}
                onClick={() => setDisplayForgot(false)}
                className={styles.times}
              />
            </div>
            <header className={styles.header}>
              <div className={styles.logo}>
                <Image src={forgotPass} />
              </div>
              <h2 className={styles.title}>Forgot Password?</h2>
              <p className={styles.subText}>
                Please enter your registered email address. We'll send
                instructions to help reset your password.
              </p>
            </header>
            <form onSubmit={handleResetPassword} className={styles.form}>
              <div
                className={`${styles.inputContainer} ${styles.specialContainer}`}
              >
                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                <input
                  type="email"
                  placeholder="jane.doe@example.com"
                  className={styles.input}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                />
              </div>
              {sent ? (
                <p className={styles.success}>
                  We've sent instructions to that email.
                </p>
              ) : null}
              <div className={styles.submitBtnContainer}>
                <input
                  type="submit"
                  value={
                    resetPassResult.fetching ? "" : "Send reset instructions"
                  }
                  className={styles.submitBtn}
                  style={{ background: "#03dac6" }}
                />
                {resetPassResult.fetching ? (
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
                ) : null}
              </div>
            </form>
          </>
        )}
      </section>
      {displayForgot ? null : (
        <div className={styles.optionsContainer}>
          <p className={styles.signup}>
            Don't have an account?{" "}
            <Link href="/user/register">
              <span className={styles.link}>Sign up</span>
            </Link>
          </p>
          <p
            className={styles.forgotPassText}
            onClick={() => setDisplayForgot(true)}
          >
            Forgot password?
          </p>
        </div>
      )}
      <Link href="/">
        <div className={styles.circle}>
          <FontAwesomeIcon
            style={displayForgot ? { color: "#03dac6" } : null}
            icon={faHome}
            className={styles.icon}
          />
        </div>
      </Link>
      <div
        style={displayForgot ? { background: "#03dac6" } : null}
        className={styles.circle1}
      ></div>
      <div
        style={displayForgot ? { background: "#03dac6" } : null}
        className={styles.circle2}
      ></div>
      <div
        style={displayForgot ? { background: "#03dac6" } : null}
        className={styles.circle3}
      ></div>
    </main>
  );
}

login.getLayout = (page) => {
  return <Layout title="Login - Edutech">{page}</Layout>;
};

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

export default login;
