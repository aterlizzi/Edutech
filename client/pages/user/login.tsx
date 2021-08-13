import { GetServerSideProps } from "next";
import { useState } from "react";
import { useMutation } from "urql";
import styles from "../../styles/Login.module.scss";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logoHorizontal.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
const Login = `
    mutation ($email: String, $username: String, $password: String!) {
        login(email: $email, username: $username, password: $password) {
            email
            id
        }
    }



`;

function login() {
  const [loginResult, login] = useMutation(Login);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const router = useRouter();

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
        console.log(result.error);
        setError(true);
      } else {
        router.push("/");
      }
    });
  };

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image src={logo} />
          </div>
          <h2 className={styles.title}>Sign In</h2>
          <p className={styles.subText}>
            Fill out the information below to login or click the link in the
            bottom right to signup for an account. Remember you must confirm
            your email before you will be able to successfully log in.
          </p>
        </header>
        <form action="" className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="email/username"></label>
          <input
            type="text"
            id="email/username"
            placeholder="Email or Username"
            className={styles.emailUserInput}
            onChange={(e) => setEmailUser(e.currentTarget.value)}
            required
          />
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className={styles.passwordInput}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
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
              value={loginResult.fetching ? "" : "Login"}
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
        <div className={`${styles.bottomContainer} ${styles.flexRow}`}>
          <div className={styles.forgotPassContainer}>
            <FontAwesomeIcon icon={faLock} color={"rgba(white, 0.6)"} />
            <p className={styles.forgotPassText}>
              Forgot your password?{" "}
              <Link href="#">
                <span className={styles.span}>Click me.</span>
              </Link>
            </p>
          </div>
          <Link href="/user/register">
            <p className={styles.createAccountText}>Create an account.</p>
          </Link>
        </div>
      </section>
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

export default login;
