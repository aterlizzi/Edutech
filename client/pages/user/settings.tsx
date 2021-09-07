import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { stringifyVariables, useMutation, useQuery } from "urql";
import styles from "../../styles/Settings.module.scss";
import logo from "../../public/logoHorizontal.png";
import singleLogo from "../../public/logoWithoutText.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faAlignLeft,
  faArrowLeft,
  faBook,
  faChartLine,
  faCheck,
  faClipboard,
  faClock,
  faCog,
  faCreditCard,
  faDollarSign,
  faEnvelopeOpenText,
  faFilePdf,
  faFileUpload,
  faHome,
  faInbox,
  faKey,
  faLightbulb,
  faSearch,
  faSignOutAlt,
  faTimes,
  faUser,
  faUsersCog,
  faUserSecret,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "../../components/layout";

const CancelSubscription = `
  mutation {
    cancelSubscription
  }
`;
const Logout = `
    mutation {
      logout
    }
`;
const Me = `
    query {
        me {
            id
            orderId
            createdAt
            username
            email
            subscriber
            tier
            applications {
              id
            }
            viewed {
              id
            }
        }
    }
`;
const CreateCustomerPortal = `
  mutation {
    createCustomerPortal
  }
`;
const ChangePasswordEmail = `
    mutation {
      changePasswordEmail
    }
`;
const ResetPassword = `
    mutation($data: changePassWithoutTokenInput!) {
      changeWithoutTokenPassword(data: $data)
    }
`;
const ResetEmail = `
    mutation($newEmail: String!, $confirmPass: String!) {
      changeEmail(newEmail: $newEmail, confirmPass: $confirmPass)
    }
`;

const NextInvoice = `
    query {
      retrieveNextInvoice
    }
`;
const AllInvoices = `
    query {
      retrieveAllInvoices {
        date
        price
        pdf_invoice
        email
      }
    }
`;

function settings({ sid }) {
  const router = useRouter();

  // states

  const [mobileActive, setMobileActive] = useState(false);
  const [section, setSection] = useState(0);
  const [changePass, setChangePass] = useState(false);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorQuery, setErrorQuery] = useState([]);
  const [successQuery, setSuccessQuery] = useState([]);
  const [emailError, setEmailError] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  // queries

  const [result, cancelSub] = useMutation(CancelSubscription);
  const [passResult, changePassMutation] = useMutation(ResetPassword);
  const [passEmailResult, sendPassChangeEmail] =
    useMutation(ChangePasswordEmail);
  const [logoutResult, logout] = useMutation(Logout);
  const [resetEmailResult, resetEmail] = useMutation(ResetEmail);
  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const [invoiceResult, reexcuteInvoice] = useQuery({ query: NextInvoice });
  const [allInvoiceResult, reexecuteAllInvoices] = useQuery({
    query: AllInvoices,
  });
  const { data, fetching, error } = meResult;
  const [portalResult, createPortal] = useMutation(CreateCustomerPortal);

  // functions
  const handlePortal = () => {
    createPortal().then((result) => {
      if (result.data.createCustomerPortal) {
        router.push(result.data.createCustomerPortal);
      }
    });
  };
  const handleUnsubscribe = () => {
    cancelSub().then((result) => {
      if (result.error) {
        console.log(result.error);
      } else {
        router.push(`/user/unsubscribed/${result.data.cancelSubscription}`);
      }
    });
  };
  const handleLogOut = () => {
    logout().then((result) => {
      if (!result.error) {
        router.push("/");
      }
    });
  };

  const handleSubmit = (e) => {
    setErrorQuery([]);
    setSuccessQuery([]);
    e.preventDefault();
    if (newPassword !== "") {
      const variables = {
        data: {
          oldPassword,
          newPassword,
        },
      };
      changePassMutation(variables).then((result) => {
        console.log(result);
        const errors = [];
        const success = [];
        if (result.error) {
          result.error.graphQLErrors[0].extensions.exception.validationErrors.forEach(
            (error: any) => {
              if (error.constraints.isLength) {
                errors.push([error.property, "length"]);
              }
            }
          );
        }
        if (result.data.changeWithoutTokenPassword === false) {
          errors.push(["oldPassword", "incorrect"]);
        } else if (result.data.changeWithoutTokenPassword === null) {
          errors.push(["newPassword", "samePass"]);
        } else if (result.data.changeWithoutTokenPassword) {
          success.push(["password", "success"]);
          sendPassChangeEmail();
        }
        setSuccessQuery([...successQuery, ...success]);
        setErrorQuery([...errorQuery, ...errors]);
      });
    }
    if (email !== "") {
      const variables = {
        newEmail: email,
        confirmPass,
      };
      resetEmail(variables).then((result) => {
        const errors = [];
        const success = [];
        console.log(result);
        if (result.data.changeEmail === false) {
          setEmailError(true);
        } else if (result.data.changeEmail === true) {
          setEmailSuccess(true);
        }
      });
    }
  };

  return (
    <main className={styles.main}>
      <nav
        className={
          mobileActive ? `${styles.nav} ${styles.active}` : `${styles.nav}`
        }
      >
        <div
          className={
            mobileActive
              ? `${styles.wrapped} ${styles.active}`
              : `${styles.wrapped}`
          }
        >
          <Link href="/">
            <div className={styles.logo}>
              <Image src={logo}></Image>
            </div>
          </Link>
          <div className={styles.switch}>
            <div className={styles.switch__1}>
              <input
                className={styles.input}
                id="switch-1"
                type="checkbox"
                onChange={() => setMobileActive(!mobileActive)}
              />
              <label className={styles.label} htmlFor="switch-1"></label>
            </div>
          </div>
          <section className={styles.mainLinks}>
            <h3 className={styles.label}>Main</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
                <FontAwesomeIcon
                  icon={faEnvelopeOpenText}
                  className={styles.icon}
                />
                <FontAwesomeIcon icon={faUsersCog} className={styles.icon} />
                <FontAwesomeIcon icon={faDollarSign} className={styles.icon} />
              </div>
              <div className={styles.linksContainer}>
                <Link href="/">
                  <p className={styles.link}>Home</p>
                </Link>
                <Link href="/about">
                  <p className={styles.link}>Company</p>
                </Link>
                <Link href="/contact">
                  <p className={styles.link}>Contact</p>
                </Link>
                <Link href="/usecase">
                  <p className={styles.link}>Use cases</p>
                </Link>
                <Link href="/applications/pricing">
                  <p className={styles.link}>Pricing</p>
                </Link>
              </div>
            </div>
          </section>
          <section className={styles.dashLinks}>
            <h3 className={styles.label}>Dashboard</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
                <FontAwesomeIcon icon={faBook} className={styles.icon} />
              </div>
              <div className={styles.linkContainer}>
                <Link href="/user/dashboard/idea-generator">
                  <p className={styles.link}>Idea Generator</p>
                </Link>
                <Link href="/user/dashboard/essay-generator">
                  <p className={styles.link}>Essay Generator</p>
                </Link>
                <Link href="/user/dashboard/essay-editor">
                  <p className={styles.link}>Essay Editor</p>
                </Link>
              </div>
            </div>
          </section>
          <section className={styles.utilities}>
            <h3 className={styles.label}>Utilities</h3>
            <div className={styles.grid}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
                <FontAwesomeIcon icon={faFileUpload} className={styles.icon} />
                <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
              </div>
              <div className={styles.linkContainer}>
                <Link href="/user/dashboard">
                  <p className={styles.link}>Dashboard</p>
                </Link>
                <Link href="/applications/upload">
                  <p className={styles.link}>Upload App</p>
                </Link>
                <p onClick={handleLogOut} className={styles.link}>
                  Logout
                </p>
              </div>
            </div>
          </section>
          {data ? (
            <section className={styles.accountContainer}>
              <div className={styles.circle}>
                <FontAwesomeIcon
                  icon={
                    data.me
                      ? data.me.tier !== "Free"
                        ? faUserSecret
                        : faUser
                      : null
                  }
                  className={styles.userIcon}
                  size={"lg"}
                />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.username}>{data.me.username}</h3>
                <p className={styles.info}>{data.me ? data.me.tier : null}</p>
              </div>
            </section>
          ) : null}
        </div>
        <div
          className={
            mobileActive
              ? `${styles.mobile} ${styles.active}`
              : `${styles.mobile}`
          }
        >
          <section className={styles.top}>
            <Link href="/">
              <div className={styles.logo}>
                <Image src={singleLogo}></Image>
              </div>
            </Link>
            <div className={styles.switch}>
              <div className={styles.switch__1}>
                <input
                  className={styles.input}
                  id="switch-1"
                  type="checkbox"
                  onChange={() => setMobileActive(!mobileActive)}
                />
                <label className={styles.label} htmlFor="switch-1"></label>
              </div>
            </div>
            <Link href="/">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
              </div>
            </Link>
            <Link href="/about">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
              </div>
            </Link>
            <Link href="/contact">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faEnvelopeOpenText}
                  className={styles.icon}
                />
              </div>
            </Link>
            <Link href="/usecase">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faUsersCog} className={styles.icon} />
              </div>
            </Link>
            <Link href="/user/dashboard/idea-generator">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
              </div>
            </Link>
            <Link href="/user/dashboard/essay-generator">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
              </div>
            </Link>
            <Link href="/user/dashboard/essay-editor">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faBook} className={styles.icon} />
              </div>
            </Link>
            <Link href="/applications/upload">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faFileUpload} className={styles.icon} />
              </div>
            </Link>
            <div onClick={handleLogOut} className={styles.iconContainer}>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
            </div>
          </section>
          <section className={styles.bottom}>
            <Link href="/user/dashboard">
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
              </div>
            </Link>{" "}
            <div className={styles.userContainer}>
              <div className={styles.circle}>
                <FontAwesomeIcon icon={faUserSecret} className={styles.icon} />
              </div>
            </div>
          </section>
        </div>
      </nav>
      <section className={styles.settings}>
        {section === 0 ? (
          <aside className={styles.selector}>
            <header className={styles.header}>
              <h1 className={styles.title}>Settings</h1>
            </header>
            <section className={styles.options}>
              <div className={styles.option} onClick={() => setSection(1)}>
                <header className={styles.optionHeader}>
                  <FontAwesomeIcon icon={faCog} className={styles.icon} />
                  <h3 className={styles.subtitle}>Account</h3>
                </header>
                <p className={styles.desc}>
                  Click or tap to access account settings. From here you can
                  change your password or email.
                </p>
              </div>
              <div className={styles.option} onClick={() => setSection(2)}>
                <header className={styles.optionHeader}>
                  <FontAwesomeIcon icon={faWallet} className={styles.icon} />
                  <h3 className={styles.subtitle}>Billing</h3>
                </header>
                <p className={styles.desc}>
                  Billing contains all relevant billing information including
                  canceling and managing subscriptions and manging your customer
                  portal.
                </p>
              </div>
              <div className={styles.option} onClick={() => setSection(3)}>
                <header className={styles.optionHeader}>
                  <FontAwesomeIcon icon={faSearch} className={styles.icon} />
                  <h3 className={styles.subtitle}>Additional Resources</h3>
                </header>
                <p className={styles.desc}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Pariatur dolorem quidem saepe eveniet obcaecati nisi.
                </p>
              </div>
            </section>
          </aside>
        ) : null}
        {section === 1 ? (
          <section className={styles.account}>
            <header className={styles.header}>
              <h2 className={styles.title}>Account</h2>
              <p className={styles.createdAt}>
                {data
                  ? data.me.createdAt
                    ? "Account created: "
                    : "No data"
                  : null}
                {data ? (
                  data.me.createdAt ? (
                    <span className={styles.special}>
                      {new Date(
                        parseInt(data.me.createdAt)
                      ).toLocaleDateString()}
                    </span>
                  ) : null
                ) : (
                  "Fetching..."
                )}
              </p>
            </header>
            <section className={styles.accountMain}>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Type</h5>
                <p className={styles.statDesc}>
                  The type of account you own is displayed below.
                </p>
                <p className={styles.status}>
                  <span className={styles.special}>
                    {data ? data.me.tier : "Fetching..."}
                  </span>
                </p>
              </div>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>General</h5>
                <p className={styles.statDesc}>
                  We keep track of some statistics you might find useful. Those
                  are displayed below.
                </p>
                <p className={`${styles.status} ${styles.upApp}`}>
                  Has uploaded an application:{" "}
                  <span className={styles.special}>
                    {data
                      ? data.me.applications.length > 0
                        ? "True"
                        : "False"
                      : "Fetching..."}
                  </span>
                </p>
                <p className={styles.status}>
                  Total Viewed Applications:{" "}
                  <span className={styles.special}>
                    {data
                      ? data.me.viewed
                        ? data.me.viewed.length
                        : "Error"
                      : "Fetching..."}
                  </span>
                </p>
              </div>
              <form className={styles.personalForm} onSubmit={handleSubmit}>
                <h5 className={styles.catTitle}>Personal Information</h5>
                <p className={styles.statDesc}>
                  The identifying information we have for you is displayed
                  below. You can change your email and password. If you'd like
                  to change your username contact support.
                </p>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={
                    data
                      ? data.me.username
                        ? data.me.username
                        : "No data"
                      : "Fetching..."
                  }
                  id="username"
                  disabled
                />
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  value={email}
                  placeholder={
                    data
                      ? data.me.email
                        ? data.me.email
                        : "No data"
                      : "Fetching..."
                  }
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                />
                {email !== "" ? (
                  <div className={styles.confirm}>
                    <label className={styles.label} htmlFor="confirmPass">
                      Password
                    </label>
                    <p className={styles.confirmText}>
                      In order to change your email you must provide your
                      password. This protects against someone hijacking your
                      account.
                    </p>
                    <div className={styles.inputContainer}>
                      <FontAwesomeIcon icon={faKey} className={styles.icon} />
                      <input
                        type="password"
                        id="confirmPass"
                        placeholder="ex. TxpWgp`dtE3TYe2<"
                        className={styles.confirmInput}
                        onChange={(e) => {
                          setConfirmPass(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                ) : null}
                {emailSuccess ? (
                  <section className={styles.successContainer}>
                    <p className={styles.success}>
                      Success! A verification email has been sent to {email}.
                      You must verify the provided email before it can be used.
                    </p>
                  </section>
                ) : null}
                {emailError ? (
                  <div className={styles.errorContainer}>
                    <p className={styles.error}>
                      A user with that email already exists or you entered your
                      password incorrectly.
                    </p>
                  </div>
                ) : null}
                <div className={styles.changePassContainer}>
                  <p className={styles.change}>Change password?</p>
                  <button
                    className={styles.changeBtn}
                    type="button"
                    onClick={() => setChangePass(!changePass)}
                    style={
                      !changePass
                        ? { background: "#03dac6" }
                        : {
                            background: "#121212",
                            border: "solid 1px rgb(187, 134, 252, .5)",
                            color: "rgba(255, 255, 255, 0.87)",
                          }
                    }
                  >
                    {!changePass ? "Change" : "Cancel"}
                  </button>
                </div>
                {changePass ? (
                  <>
                    <label className={styles.label} htmlFor="currentPassword">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className={styles.input}
                      placeholder="ex. *LF;k6TMVYchB*!k"
                      id="currentPassword"
                      onChange={(e) => {
                        setOldPassword(e.currentTarget.value);
                      }}
                    />
                    {errorQuery.length > 0
                      ? errorQuery.map((array) => {
                          if (array[0] === "oldPassword") {
                            if (array[1] === "length") {
                              return (
                                <div
                                  className={styles.errorContainer}
                                  key={array}
                                >
                                  <p className={styles.error}>
                                    Your password must be 8 characters or more.
                                  </p>
                                </div>
                              );
                            } else if (array[1] === "incorrect") {
                              return (
                                <div
                                  className={styles.errorContainer}
                                  key={array}
                                >
                                  <p className={styles.error}>
                                    Incorrect password.
                                  </p>
                                </div>
                              );
                            }
                          }
                        })
                      : null}
                    <label htmlFor="newPassword" className={styles.label}>
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className={styles.input}
                      placeholder="ex. ./UAxE:P<k9c:9t'"
                      onChange={(e) => {
                        setNewPassword(e.currentTarget.value);
                      }}
                    />
                    {errorQuery.length > 0
                      ? errorQuery.map((array) => {
                          if (array[0] === "newPassword") {
                            if (array[1] === "length") {
                              return (
                                <div
                                  className={styles.errorContainer}
                                  key={array}
                                >
                                  <p className={styles.error}>
                                    Your password must be 8 characters or more.
                                  </p>
                                </div>
                              );
                            }
                            if (array[1] === "samePass") {
                              return (
                                <div
                                  className={styles.errorContainer}
                                  key={array}
                                >
                                  <p className={styles.error}>
                                    That's your current password.
                                  </p>
                                </div>
                              );
                            }
                          }
                        })
                      : null}
                  </>
                ) : null}
                {successQuery.length > 0
                  ? successQuery.map((array) => {
                      if (array[0] === "password") {
                        if (array[1] === "success") {
                          return (
                            <section
                              key={array}
                              className={styles.successContainer}
                            >
                              <p className={styles.success}>
                                Success! Password changed.
                              </p>
                            </section>
                          );
                        }
                      }
                    })
                  : null}
                <section className={styles.footer}>
                  <div className={styles.circle} onClick={() => setSection(0)}>
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className={styles.icon}
                    />
                  </div>
                  {changePass || email !== "" ? (
                    <div className={styles.btnContainer}>
                      {!passResult.fetching && !resetEmailResult.fetching ? (
                        <button
                          type="button"
                          className={styles.cancel}
                          onClick={(e) => {
                            setEmail("");
                            setChangePass(false);
                            setConfirmPass("");
                          }}
                        >
                          Cancel
                        </button>
                      ) : null}
                      {passResult.fetching || resetEmailResult.fetching ? (
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
                        <input
                          type="submit"
                          className={styles.submit}
                          value="Save"
                          onClick={() => {
                            setErrorQuery([]);
                            setSuccessQuery([]);
                            setEmailError(false);
                            setEmailSuccess(false);
                          }}
                        />
                      )}
                    </div>
                  ) : null}
                </section>
              </form>
            </section>
          </section>
        ) : null}
        {section === 2 ? (
          <section className={styles.account}>
            <header className={styles.header}>
              <h2 className={styles.title}>Billing</h2>
            </header>
            <section className={styles.accountMain}>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Type of Account</h5>
                <p className={styles.statDesc}>
                  This is your current plan. You can learn more about the
                  different plans available at the{" "}
                  <span className={styles.link}>
                    <Link href="/applications/pricing">Pricing Page.</Link>
                  </span>
                </p>
                <p className={styles.status}>
                  Account type:{" "}
                  <span className={styles.special}>
                    {data ? data.me.tier : null}
                  </span>
                </p>
              </div>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Order ID</h5>
                <p className={styles.statDesc}>
                  Each order receives an associated Order ID. This is useful for
                  keeping track of orders confidentially, serving as an
                  identifying agent instead of a buyer's real name.
                </p>
                <p className={styles.status}>
                  Your Order ID is:{" "}
                  <span className={styles.special}>
                    {data
                      ? data.me.subscriber
                        ? data.me.orderId
                        : "You haven't ordered yet."
                      : null}
                  </span>
                </p>
              </div>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Next Invoice / Charge</h5>
                <p className={styles.statDesc}>
                  Displayed below is the next time your subscription will be
                  renewed and you will receive an invoice or charge to your
                  account. This is updated after every successful payment.
                </p>
                <p className={styles.status}>
                  Your subscription renews:{" "}
                  <span className={styles.special}>
                    {data && invoiceResult.data
                      ? data.me.subscriber
                        ? new Date(
                            invoiceResult.data.retrieveNextInvoice
                          ).toLocaleDateString()
                        : "You haven't ordered yet."
                      : null}
                  </span>
                </p>
              </div>
              {data ? (
                data.me ? (
                  data.me.subscriber ? (
                    <div className={styles.typeContainer}>
                      <h5 className={styles.catTitle}>Customer Portal</h5>
                      <p className={styles.statDesc}>
                        Click to enter the customer portal. Inside the customer
                        portal you can securely upgrade or cancel your
                        subscription. You can also view previous invoices or
                        change your card information. The portal is hosted by
                        Stripe, our payment gateway.
                      </p>
                      <button
                        onClick={handlePortal}
                        className={styles.cancelSubButton}
                      >
                        Visit Customer Portal
                      </button>
                    </div>
                  ) : null
                ) : null
              ) : null}
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Cancellation</h5>
                <p className={styles.statDesc}>
                  We'd be sad to see you go but if that is the right step for
                  you, you can cancel your subscription at any time below or in
                  the customer portal! Keep in mind cancellation of your plan
                  will result in immediate loss of all related goods and
                  services so we recommending riding it out until your last day!
                </p>
                {data.me.subscriber ? (
                  !confirmCancel ? (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className={styles.cancelSubButton}
                    >
                      Cancel Subscription
                    </button>
                  ) : (
                    <div className={styles.cancelContainer}>
                      <p className={styles.confirmText}>
                        Are you sure you want to cancel your subscription?
                      </p>
                      <div className={styles.iconContainer}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={styles.iconSuccess}
                          onClick={handleUnsubscribe}
                        />
                        <FontAwesomeIcon
                          onClick={() => setConfirmCancel(false)}
                          icon={faTimes}
                          className={styles.iconCancel}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <p className={styles.status}>You haven't subscribed yet.</p>
                )}
              </div>
              <div className={styles.typeContainer}>
                <h5 className={styles.catTitle}>Previous Invoices</h5>
                <p className={styles.statDesc}>
                  We keep track of all of your invoices and display those that
                  have been made within the last year.
                </p>
                {allInvoiceResult.data ? (
                  allInvoiceResult.data.retrieveAllInvoices.map(
                    (invoice, idx) => {
                      return (
                        <div className={styles.invoiceCard} key={invoice}>
                          <div className={styles.left}>
                            <header className={styles.invoiceHeader}>
                              <h3 className={styles.title}>
                                Invoice: {idx + 1}
                              </h3>
                              <a href={invoice.pdf_invoice}>
                                <div className={styles.pdfContainer}>
                                  <FontAwesomeIcon
                                    icon={faFilePdf}
                                    className={styles.icon}
                                  />
                                  <h4 className={styles.subtitle}>PDF</h4>
                                </div>
                              </a>
                            </header>
                            <section className={styles.bottom}>
                              <div className={styles.container}>
                                <h4 className={styles.subtitle}>Date</h4>
                                <div className={styles.dateContainer}>
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className={styles.icon}
                                  />
                                  <p className={styles.info}>
                                    {new Date(
                                      invoice.date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className={styles.container}>
                                <h4 className={styles.subtitle}>Email</h4>
                                <div className={styles.dateContainer}>
                                  <FontAwesomeIcon
                                    icon={faInbox}
                                    className={styles.icon}
                                  />
                                  <p className={styles.info}>{invoice.email}</p>
                                </div>
                              </div>
                            </section>
                          </div>
                          <div className={styles.right}>
                            <h4 className={styles.subtitle}>Price</h4>
                            <div className={styles.priceContainer}>
                              <FontAwesomeIcon
                                icon={faDollarSign}
                                className={styles.icon}
                              />
                              <p className={styles.info}>{invoice.price}</p>
                            </div>
                            <div className={styles.miniCircle1}></div>
                            <div className={styles.miniCircle2}></div>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <p className={styles.status}>
                    You must subscribe to have an invoice.
                  </p>
                )}
              </div>
              <section className={styles.footer}>
                <div className={styles.circle} onClick={() => setSection(0)}>
                  <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
                </div>
              </section>
            </section>
          </section>
        ) : null}
        {section === 3 ? (
          <section className={styles.account}>
            <header className={styles.header}>
              <h2 className={styles.title}>Additional Resources</h2>
            </header>
          </section>
        ) : null}
      </section>
    </main>
  );
}

settings.getLayout = (page) => (
  <Layout title="Settings - Edutech">{page}</Layout>
);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let sid = false;
  if (req.cookies.hasOwnProperty("sid")) {
    sid = true;
  }
  if (!req.cookies.hasOwnProperty("qid")) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }
  return {
    props: { sid },
  };
};
export default settings;
