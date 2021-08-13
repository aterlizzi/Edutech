import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "urql";
import styles from "../../../styles/Success.module.scss";
import Link from "next/link";

const RequestData = `
    query($sessionId: String!) {
      retrieveStripeSession(sessionId: $sessionId)
    }
`;
const UpdateUser = `
    mutation($subKey: String!, $custKey: String!) {
      updateUserSubscriber(subKey: $subKey, custKey: $custKey)
    }
`;

function success() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { session_id } = router.query;
  const [result, reexecuteQuery] = useQuery({
    query: RequestData,
    variables: { sessionId: session_id },
    pause: !session_id,
  });
  const { data, error } = result;
  const [userResult, updateUser] = useMutation(UpdateUser);
  useEffect(() => {
    if (data) {
      console.log(data);
      if (data.retrieveStripeSession.payment_status === "paid") {
        const variables = {
          subKey: data.retrieveStripeSession.subscription,
          custKey: data.retrieveStripeSession.customer,
        };
        updateUser(variables).then((result) => {
          if (result.error) {
            setSuccess(false);
            return (
              <section className={styles.errorContainer}>
                <h1 className={styles.errEmoji}>( ˘︹˘ ) </h1>
                <h1 className={styles.errMsg}>
                  Something went wrong! Please try again or contact support for
                  further assistance.
                </h1>
                <Link href="/applications/payments">
                  <button className={styles.errBtn}>Payments</button>
                </Link>
                <Link href="/support">
                  <button className={styles.errBtn}>Support</button>
                </Link>
              </section>
            );
          } else {
            setSuccess(true);
            setTimeout(() => {
              router.push("/applications/");
            }, 15000);
          }
        });
      }
    }
  }, [data]);
  if (error)
    return (
      <section className={styles.errorContainer}>
        <h1 className={styles.errEmoji}>( ˘︹˘ ) </h1>
        <h1 className={styles.errMsg}>
          Something went wrong! Please try again or contact support for further
          assistance.
        </h1>
        <Link href="/applications/payments">
          <button className={styles.errBtn}>Payments</button>
        </Link>
        <Link href="/support">
          <button className={styles.errBtn}>Support</button>
        </Link>
      </section>
    );
  return (
    <main className={styles.main}>
      {!success ? (
        <div className={styles.successContainer}>
          <svg
            className={styles.spinner}
            width="65px"
            height="65px"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className={styles.path}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              cx="33"
              cy="33"
              r="30"
            ></circle>
          </svg>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.successContainer}>
            <div className={styles.checkmark}>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.confetti}
                height="19"
                viewBox="0 0 19 19"
                width="19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z"
                  fill="#bb86fc"
                />
              </svg>
              <svg
                className={styles.checkmark__check}
                height="36"
                viewBox="0 0 48 36"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23" />
              </svg>
              <svg
                className={styles.checkmark__back}
                height="115"
                viewBox="0 0 120 115"
                width="120"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z"
                  fill="#bb86fc"
                />
              </svg>
            </div>
          </div>
          {!success ? null : (
            <section className={styles.contentContainer}>
              <header className={styles.header}>
                <h2 className={styles.successMsg}>Payment Successful!</h2>
                <p className={styles.subText}>
                  We've gone ahead and emailed{" "}
                  <span className={styles.email}>
                    {data.retrieveStripeSession.customer_details.email}
                  </span>{" "}
                  with some information we'd like you to have, like your order
                  id! I've told my AI to redirect you to the applications, but
                  you can press the button below to speed up the process if
                  you'd like.
                </p>
              </header>
              <button className={styles.appBtn}>
                <Link href="/applications/">Applications</Link>
              </button>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

export default success;