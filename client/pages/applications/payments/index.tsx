import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { useMutation, useQuery } from "urql";
import { useRouter } from "next/router";

import styles from "../../../styles/Payment.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons";
import NavComponent from "../../../components/NavComponent";
import Layout from "../../../components/layout";
const createSession = `
  mutation {
    createStripeSession
  }

`;
const Me = `
  query {
    me {
      username
    }
  }

`;

function Payment({ vid }) {
  const [loading, setLoading] = useState(false);
  const [meResult, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching } = meResult;
  const router = useRouter();
  const [result, createStripeSession] = useMutation(createSession);

  const handleClick = () => {
    setLoading(true);
    createStripeSession().then((result) => {
      setLoading(false);
      router.push(result.data.createStripeSession);
    });
  };

  return (
    <main className={styles.main}>
      <NavComponent data={fetching ? "" : data.me} vid={vid} />
      <div className={styles.wrapper}>
        <section className={`${styles.gridSection} ${styles.grid}`}>
          <div className={`${styles.card} ${styles.stripe}`}>
            <FontAwesomeIcon
              icon={faCreditCard}
              size={"2x"}
              color={"#bb86fc"}
            />
            <h2 className={styles.paymentType}>Credit Card</h2>
            <p className={styles.desc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              explicabo accusamus harum autem commodi et provident dolores
              saepe, architecto at. Tenetur perspiciatis itaque, velit iure
              accusamus illo dicta. Quam, dolores.
            </p>
            <button className={styles.btn} onClick={handleClick}>
              {!loading ? (
                "Pay with Credit Card"
              ) : (
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
              )}
            </button>
          </div>
          <div className={`${styles.card} ${styles.stripe}`}>
            <FontAwesomeIcon icon={faCcPaypal} size={"2x"} color={"#bb86fc"} />
            <h2 className={styles.paymentType}>Paypal</h2>
            <p className={styles.desc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              explicabo accusamus harum autem commodi et provident dolores
              saepe, architecto at. Tenetur perspiciatis itaque, velit iure
              accusamus illo dicta. Quam, dolores.
            </p>
            <button className={styles.btn}>Pay with Paypal</button>
          </div>
        </section>
      </div>
    </main>
  );
}

Payment.getLayout = (page) => <Layout title="Purchase Access">{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let vid: boolean = false;
  if (req.cookies.hasOwnProperty("vid")) {
    vid = true;
  }
  if (!req.cookies.hasOwnProperty("qid")) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      },
    };
  }
  if (req.cookies.hasOwnProperty("sid")) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: { vid },
  };
};
export default Payment;
