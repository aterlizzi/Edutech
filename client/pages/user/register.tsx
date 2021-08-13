import styles from "../../styles/Register.module.scss";
import Image from "next/image";
import Link from "next/link";
import LogoNoText from "../../public/logoWithoutText.png";
import registerPic from "../../public/register-bg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUserCircle,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useMutation } from "urql";
import { GetServerSideProps } from "next";

const Register = `
  mutation ($options: createUserInput!) {
    createUser(options: $options) {
      email
      id
    }
  }
`;
const Resend = `
  mutation ($email: String!) {
    sendConfirmation(email: $email)
  }
`;

function register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailErr, setEmailErr] = useState([]);
  const [userErr, setUserErr] = useState([]);
  const [passwordErr, setPasswordErr] = useState([]);
  const [success, setSuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [registerResult, register] = useMutation(Register);
  const [resendResult, resendConfirm] = useMutation(Resend);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const variables = {
      options: {
        email,
        password,
        username,
      },
    };
    register(variables).then((result) => {
      let tempEmailArr = [];
      let tempUserArr = [];
      let tempPasswordArr = [];
      if (result.error) {
        result.error.graphQLErrors[0].extensions.exception.validationErrors.forEach(
          (error: any) => {
            if (error.constraints.IsUserExistsConstraint) {
              tempEmailArr.push(error.constraints.IsUserExistsConstraint);
            } else if (error.constraints.IsUsernameExistsConstraint) {
              tempUserArr.push(error.constraints.IsUsernameExistsConstraint);
            } else if (error.constraints.isLength) {
              tempPasswordArr.push(error.constraints.isLength);
            }
          }
        );
        setEmailErr(tempEmailArr);
        setUserErr(tempUserArr);
        setPasswordErr(tempPasswordArr);
      } else {
        setSuccess(true);
      }
    });
  };

  const handleReconfirm = () => {
    const variables = { email };
    resendConfirm(variables).then((result) => {
      if (result.error) console.log(result.error);
      else {
        setSendSuccess(true);
      }
    });
  };

  return (
    <main className={`${styles.bg} ${styles.center}`}>
      <section className={`${styles.card} ${styles.gridOne}`}>
        <section className={styles.leftContainer}>
          <div className={styles.imageContainer}>
            <Image
              src={registerPic}
              layout="responsive"
              placeholder="blur"
              alt="Woman on laptop editing essay."
            />
          </div>
          <header className={`${styles.header} ${styles.flexCol}`}>
            <div className={styles.title}>
              Browse applications.
              <br />
              Get inspired.
              <br />
              Excel.
            </div>
            <div className={`${styles.links} ${styles.flexRow}`}>
              <Link href="/applications/product">Product</Link>
              <Link href="/about">About</Link>
              <Link href="/applications/pricing">Pricing</Link>
              <Link href="/">Home</Link>
            </div>
          </header>
        </section>
        {!success ? (
          <section className={styles.rightContainer}>
            <header className={styles.rightHeader}>
              <div className={styles.logo}>
                <Image src={LogoNoText} />
              </div>
              <h3 className={styles.titleText}>
                Join students from around the globe and improve your
                application.
              </h3>
              <p className={styles.subText}>
                Master the admissions cycle with access to previous brilliant
                student applications. Join others, get inspired, and learn what
                it takes to get into the school of your dreams.
              </p>
            </header>
            <form action="" onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="email"></label>
              <div className={styles.emailContainer} id="emailContainer">
                <FontAwesomeIcon color="white" size={"lg"} icon={faEnvelope} />
                <input
                  id="email"
                  className={styles.emailInput}
                  type="email"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  placeholder=" ex. johndoe@gmail.com"
                  required
                />
              </div>
              {emailErr.map((error: string) => (
                <aside key={error} className={styles.errorContainer}>
                  <p className={styles.errorText}>{error}</p>
                </aside>
              ))}
              <label htmlFor="username"></label>
              <div className={styles.usernameContainer}>
                <FontAwesomeIcon
                  color="white"
                  size={"lg"}
                  icon={faUserCircle}
                />
                <input
                  id="username"
                  className={styles.usernameInput}
                  type="text"
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  placeholder="ex. JohnnyDoe123"
                  required
                />
              </div>
              {userErr.map((error: string) => (
                <aside key={error} className={styles.errorContainer}>
                  <p className={styles.errorText}>{error}</p>
                </aside>
              ))}
              <label htmlFor="password"></label>
              <div className={styles.passwordContainer}>
                <FontAwesomeIcon size={"lg"} color="white" icon={faLock} />
                <input
                  id="password"
                  className={styles.passwordInput}
                  type="password"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  placeholder="ex. -4b>X@B:]_{3f>FY"
                  required
                />
              </div>
              {passwordErr.map((error: string) => (
                <aside key={error} className={styles.errorContainer}>
                  <p className={styles.errorText}>{error}</p>
                </aside>
              ))}
              <div className={styles.checkboxContainer}>
                <div className={styles.checkmarkContainer}>
                  <input
                    className={styles.checkBox}
                    id="checkbox"
                    type="checkbox"
                    required
                  />
                  <span className={styles.checkMark}>
                    <div className={styles.stem}></div>
                    <div className={styles.kick}></div>
                  </span>
                </div>
                <label className={styles.checkBoxLabel} htmlFor="checkbox">
                  I agree to all statements included in{" "}
                  <Link href="#">
                    <span className={styles.termText}>Terms of Use</span>
                  </Link>
                </label>
              </div>
              <div className={styles.submitBtnContainer}>
                <input
                  className={styles.submitBtn}
                  value={registerResult.fetching ? "" : "Register"}
                  type="submit"
                />
                {registerResult.fetching ? (
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
            <div className={styles.loginBox}>
              <p>
                Already a member?{" "}
                <Link href="/user/login">
                  <span className={styles.loginText}>Login</span>
                </Link>
              </p>
            </div>
          </section>
        ) : (
          <section className={styles.rightContainer}>
            <div className={styles.successContainer}>
              <h3 className={styles.successMsg}>
                Success! You've successfully registered.
              </h3>
              <p className={styles.successSubmsg}>
                A confirmation email has been sent to your email. You must
                confirm your account before you can login.
              </p>
              <button className={styles.returnBtn}>
                <Link href="/">Return to home.</Link>
              </button>
              {resendResult.fetching ? (
                <h3 className={styles.resending}>Sending...</h3>
              ) : (
                <p className={styles.resendMsg}>
                  Didn't get the email?{" "}
                  <span onClick={handleReconfirm} className={styles.resendSpan}>
                    Click me
                  </span>{" "}
                  to send another email.
                </p>
              )}
              {sendSuccess ? (
                <h3 className={styles.sendSuccess}>
                  Success! Email sent again.
                </h3>
              ) : null}
            </div>
          </section>
        )}
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

export default register;
