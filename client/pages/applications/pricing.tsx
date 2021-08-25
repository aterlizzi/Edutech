import {
  faAddressCard,
  faAlignLeft,
  faArrowDown,
  faDatabase,
  faEnvelope,
  faEnvelopeOpenText,
  faHome,
  faLightbulb,
  faQrcode,
  faQuestion,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "urql";
import Layout from "../../components/layout";

import styles from "../../styles/Pricing.module.scss";

const Me = `
  query {
    me {
      username
      referralCode
      tier
      hasReferredCoupon
    }
  }

`;
const SendEmail = `
  mutation($email: String!) {
    sendQuestionEmail(email: $email)
  }
`;
const VerifyCode = `
  mutation($code: String!) {
    verifyCode(code: $code)
  }
`;
const GenerateStripeSession = `
  mutation($referralCode: String!, $session: Float!) {
    createStripeSession(referralCode: $referralCode, session: $session)
  }
`;
const CreateCustomerPortal = `
  mutation {
    createCustomerPortal
  }
`;

function Pricing() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [referral, setReferral] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [copy, setCopy] = useState(false);

  const inputRef = useRef(null);

  const [result, reexecuteMe] = useQuery({ query: Me });
  const [emailResult, sendEmail] = useMutation(SendEmail);
  const [codeResult, verifyCode] = useMutation(VerifyCode);
  const [stripeSessionResult, generateStripeSession] = useMutation(
    GenerateStripeSession
  );
  const { data, fetching, error } = result;
  console.log(data);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== "") {
      const variables = {
        email,
      };
      sendEmail(variables).then((result) => {
        if (result.data) {
          setSuccess(true);
        }
      });
    }
  };
  const handleCopy = (e) => {
    if (data) {
      if (data.me) {
        inputRef.current.select();
        document.execCommand("copy");
        e.target.focus();
        setCopy(true);
      }
    }
  };
  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 8) {
      setCodeError(`Referral codes must be 8 characters.`);
      return;
    } else {
      const variables = {
        code,
      };
      verifyCode(variables).then((result) => {
        console.log(result);
        if (result.data.verifyCode) {
          setReferral(false);
          setValidCode(true);
        } else {
          setCodeError(`Invalid code.`);
          setCode("");
        }
      });
    }
  };
  const handleIvyClick = () => {
    const variables = {
      referralCode: code,
      session: 2,
    };
    generateStripeSession(variables).then((result) => {
      console.log(result);
      if (result.data.createStripeSession) {
        router.push(result.data.createStripeSession);
      }
    });
  };
  const handlePublicClick = () => {
    const variables = {
      referralCode: code,
      session: 1,
    };
    generateStripeSession(variables).then((result) => {
      console.log(result);
      if (result.data.createStripeSession) {
        router.push(result.data.createStripeSession);
      }
    });
  };

  return (
    <main className={styles.main}>
      {referral ? (
        <div
          className={styles.wrapper}
          onClick={() => setReferral(false)}
        ></div>
      ) : null}
      {referral ? (
        <div className={styles.codeContainer}>
          <header className={styles.codeHead}>
            <h3 className={styles.title}>Enter Valid Referral Code</h3>
            <p className={styles.desc}>
              Each user has a referral code, enter a friend's to get a referral
              discount.
            </p>
          </header>
          <form className={styles.content} onSubmit={handleReferralSubmit}>
            <div className={styles.inputContainer}>
              <FontAwesomeIcon icon={faQrcode} className={styles.icon} />
              <input
                type="text"
                className={styles.input}
                onChange={(e) => setCode(e.currentTarget.value)}
                placeholder="ex. Qe7Y3KVa"
              />
            </div>
            {codeError ? <p className={styles.error}>{codeError}</p> : null}
            {code !== "" ? (
              <input
                className={styles.codeBtn}
                value="Verify Code"
                type="submit"
                onClick={() => setCodeError("")}
              />
            ) : null}
          </form>
        </div>
      ) : null}
      {data ? (
        data.me ? (
          <div className={styles.referralContainer} id="ref">
            <div className={styles.copyContainer}>
              <h3 className={styles.referral}>My referral code is: </h3>
              <input
                readOnly={true}
                type="text"
                value={data.me.referralCode}
                className={styles.copy}
                ref={inputRef}
                onClick={handleCopy}
              />
              {copy ? <p className={styles.copied}>Copied!</p> : null}
            </div>
            <p className={styles.learnMore}>
              <Link href="/referral">Learn more</Link>
            </p>
          </div>
        ) : null
      ) : null}
      <Link href="/">
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faHome} className={styles.icon} />
        </div>
      </Link>
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Make applying to college a no-brainer
          </h1>
          <h4 className={styles.tagLine}>
            <span className={styles.special}>Stop</span> waiting around for
            help. With tools that provide instant feedback, you'll spend time
            crafting a wicked essay instead of waiting around for{" "}
            <span className={styles.special}>feedback.</span>{" "}
          </h4>
        </header>
        <section className={styles.cardSection}>
          <div className={`${styles.card} ${styles.card1}`}>
            <div className={styles.top}>
              <header className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Ivy League</h3>
              </header>
              <section className={styles.priceContainer}>
                <div className={styles.pricing}>
                  <h5
                    style={
                      validCode
                        ? { textDecoration: "line-through" }
                        : data
                        ? data.me
                          ? data.me.hasReferredCoupon
                            ? { textDecoration: "line-through" }
                            : null
                          : null
                        : null
                    }
                    className={styles.price}
                  >
                    69.99
                  </h5>
                  <p
                    style={
                      validCode
                        ? { textDecoration: "line-through" }
                        : data
                        ? data.me
                          ? data.me.hasReferredCoupon
                            ? { textDecoration: "line-through" }
                            : null
                          : null
                        : null
                    }
                    className={styles.perMonth}
                  >
                    /month
                  </p>
                </div>
                {validCode ? (
                  <>
                    <div className={styles.pricing}>
                      <h5 className={styles.price}>49.99</h5>
                      <p className={styles.perMonth}>/month</p>
                    </div>
                    <p className={styles.off}>$20 Off!</p>
                  </>
                ) : data ? (
                  data.me ? (
                    data.me.hasReferredCoupon ? (
                      <>
                        <div className={styles.pricing}>
                          <h5 className={styles.price}>49.99</h5>
                          <p className={styles.perMonth}>/month</p>
                        </div>
                        <p className={styles.off}>$20 Off!</p>
                      </>
                    ) : null
                  ) : null
                ) : null}
              </section>
              <section className={styles.features}>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essay Ideas:{" "}
                    <span className={styles.special}>Unlimited</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faSignature} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essays:{" "}
                    <span className={styles.special}>Unlimited</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
                  <p className={styles.feature}>
                    Essays Editing Minutes:{" "}
                    <span className={styles.special}>Unlimited</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faDatabase} className={styles.icon} />
                  <p className={styles.feature}>
                    Beta Access to Application Database
                  </p>
                </div>
              </section>
            </div>
            <div className={styles.bottom}>
              {data ? (
                data.me ? (
                  data.me.tier === "Ivy" ? (
                    <button className={styles.selected}>Selected</button>
                  ) : (
                    <button onClick={handleIvyClick} className={styles.btn}>
                      Level Up
                    </button>
                  )
                ) : (
                  <button onClick={handleIvyClick} className={styles.btn}>
                    Level Up
                  </button>
                )
              ) : null}
            </div>
          </div>
          <div className={styles.mainCard}>
            <div className={styles.top}>
              <header className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Public University</h2>
                <p className={styles.recommended}>Recommended!</p>
              </header>
              <section className={styles.priceContainer}>
                <div className={styles.pricing}>
                  <h5
                    style={
                      validCode
                        ? { textDecoration: "line-through" }
                        : data
                        ? data.me
                          ? data.me.hasReferredCoupon
                            ? { textDecoration: "line-through" }
                            : null
                          : null
                        : null
                    }
                    className={styles.price}
                  >
                    39.99
                  </h5>
                  <p
                    style={
                      validCode
                        ? { textDecoration: "line-through" }
                        : data
                        ? data.me
                          ? data.me.hasReferredCoupon
                            ? { textDecoration: "line-through" }
                            : null
                          : null
                        : null
                    }
                    className={styles.perMonth}
                  >
                    /month
                  </p>
                </div>
                {validCode ? (
                  <>
                    <div className={styles.pricing}>
                      <h5 className={styles.price}>19.99</h5>
                      <p className={styles.perMonth}>/month</p>
                    </div>
                    <p className={styles.off}>$20 Off!</p>
                  </>
                ) : data ? (
                  data.me ? (
                    data.me.hasReferredCoupon ? (
                      <>
                        <div className={styles.pricing}>
                          <h5 className={styles.price}>19.99</h5>
                          <p className={styles.perMonth}>/month</p>
                        </div>
                        <p className={styles.off}>$20 Off!</p>
                      </>
                    ) : null
                  ) : null
                ) : null}
              </section>
              <section className={styles.features}>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essay Ideas:{" "}
                    <span className={styles.special}>4256</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faSignature} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essays:{" "}
                    <span className={styles.special}>512</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faAlignLeft} className={styles.icon} />
                  <p className={styles.feature} style={{ fontWeight: 700 }}>
                    Essays Editing Minutes:{" "}
                    <span className={styles.special}>2880</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faDatabase} className={styles.icon} />
                  <p className={styles.feature} style={{ fontWeight: 700 }}>
                    Beta Access to Application Database
                  </p>
                </div>
              </section>
            </div>
            <div className={styles.bottom}>
              {data ? (
                data.me ? (
                  data.me.tier === "Public" || data.me.tier === "Ivy" ? (
                    <button className={styles.selected}>Selected</button>
                  ) : (
                    <button onClick={handlePublicClick} className={styles.btn}>
                      Go Get It
                    </button>
                  )
                ) : (
                  <button onClick={handlePublicClick} className={styles.btn}>
                    Go Get It
                  </button>
                )
              ) : null}
              <a href="#ref">
                <p
                  className={styles.refText}
                  onClick={() => {
                    setReferral(true);
                    setCodeError("");
                    setCode("");
                  }}
                >
                  I have a friend's referral code.
                </p>
              </a>
            </div>
          </div>
          <div className={`${styles.card} ${styles.card3}`}>
            <div className={styles.top}>
              <header className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Community College</h3>
              </header>
              <section className={styles.priceContainer}>
                <div className={styles.pricing}>
                  <h5 className={styles.price}>Free</h5>
                  <p className={styles.perMonth}>/month</p>
                </div>
              </section>
              <section className={styles.features}>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essay Ideas:{" "}
                    <span className={styles.special}>30</span>
                  </p>
                </div>
                <div className={styles.featureContainer}>
                  <FontAwesomeIcon icon={faSignature} className={styles.icon} />
                  <p className={styles.feature}>
                    Common App Essays: <span className={styles.special}>5</span>
                  </p>
                </div>
              </section>
            </div>
            <div className={styles.bottom}>
              {data ? (
                data.me ? (
                  data.me.tier === "Free" ||
                  data.me.tier === "Public" ||
                  data.me.tier === "Ivy" ? (
                    <button className={styles.selected}>Selected</button>
                  ) : (
                    <Link href="/user/register">
                      <button className={styles.btn}>Get Started</button>
                    </Link>
                  )
                ) : (
                  <Link href="/user/register">
                    <button className={styles.btn}>Get Started</button>
                  </Link>
                )
              ) : null}
            </div>
          </div>
        </section>
        <div className={styles.faqBelow}>
          <p className={styles.faq}>FAQ Below</p>
          <a href="#faq">
            <FontAwesomeIcon icon={faArrowDown} className={styles.icon} />
          </a>
        </div>
      </section>
      <section className={styles.faqQuestions}>
        <header className={styles.faqHead} id="faq">
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </header>
        <section className={styles.grid}>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                Do you have a referral program that I can take advantage of?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                Yes. Give $20, Get $20! We have a tiered referral structure that
                gives out better and better rewards with each new referral. For
                one referral your friend gets $20 off their purchase and you get
                $20 off your next purchase! If you'd like to see all the
                referral rewards,{" "}
                <span className={styles.special}>
                  <Link href="/referral">visit the Referrals page!</Link>
                </span>
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                How are you able to produce unlimited common app essays?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                We use OpenAI's GTP-3 in order to generate completely unique
                common app essays. The AI, the most advanced natural language
                processor currently available, was trained on hundreds of real
                essays in order to learn the ropes of essay writing. After each
                use, we store the good essays for further AI training, meaning
                that the AI will continue to improve as you use it. You can
                learn more about the capabilities of{" "}
                <span className={styles.special}>
                  <a href="https://openai.com/blog/gpt-3-apps/" target="_blank">
                    GTP-3 here.
                  </a>
                </span>
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                What is the Beta Application Database?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                We are currently in the process of collecting entire real
                applications from previous applicants and putting it all in one
                place. We haven't collected enough applications to warrant
                having it as its own product, so we attached it to the paid
                plans for an added bonus! There is a{" "}
                <span className={styles.special}>
                  <Link href="/user/dashboard/rewards">reward</Link>
                </span>{" "}
                for submitting your application (or siblings'!) for the beta if
                you're interested.
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                What happens at the end of my month subscription?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                You're automatically renewed for another month and all of your
                perks renew. You can cancel your subscription at any time in the
                Settings page under the Billing section.
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                How often do the perks associated with my plan renew?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                Every month you will have all of your perks renewed. For
                instance, if you've used up all of your idea generations, next
                billing period will refresh those perks and you'll be good to go
                again. The Ivy League plan does not have to worry about this
                because it has unlimited perks.
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                Are there any setup fees or overage fees?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                No. Hidden fees disgust us. We do not have any hidden fees or
                charge anything beyond the tier price. What you see is what you
                pay.
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                Do I need to enter in my credit card details when signing up for
                the free tier?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                Nope! We hate the idea of unneccessarily giving away our
                details, so we certainly don't want you to do that! Our free
                tier is cardless. Signing up only requires an email!
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                How do I know my credit card information will be secure?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                We don't handle any of your credit card details on our end. All
                of your credit card details are handled externally by either
                Stripe or Paypal, whichever of the providers you would prefer.
                You can learn more about{" "}
                <span className={styles.special}>
                  <a href="https://www.donorhut.com/stripe" target="_blank">
                    Stripe's safety here.{" "}
                  </a>
                </span>
                If you want to learn about Paypal's safety, it can be found{" "}
                <span className={styles.special}>
                  <a
                    href="https://www.paypal.com/va/smarthelp/article/is-paypal-secure-faq1328"
                    target="_blank"
                  >
                    here.
                  </a>
                </span>
              </p>
            </div>
          </div>
          <div className={styles.faqCard}>
            <header className={styles.cardHeader}>
              <div className={styles.circleQuestion}>
                <FontAwesomeIcon icon={faQuestion} className={styles.icon} />
              </div>
              <h4 className={styles.cardTitle}>
                What is your cancellation policy and how do I cancel my account?
              </h4>
            </header>
            <div className={styles.answerContainer}>
              <p className={styles.answer}>
                It's important to us that users can cancel their subscription at
                any time for any reason, so we've made it simple. Simply go to
                the settings page and under billing you will find "Cancel my
                subscription". Keep in mind if you do decide to cancel, you will
                not be reembursed for any of the remaining time.
              </p>
            </div>
          </div>
        </section>
        <section className={styles.contactUs}>
          <header className={styles.contactHeader}>
            <h3 className={styles.title}>Have more questions? Reach out!</h3>
          </header>
          <section className={styles.reachContainer}>
            <div className={styles.method}>
              <FontAwesomeIcon
                icon={faEnvelopeOpenText}
                className={styles.icon}
              />
              <h4 className={styles.methodTitle}>Express</h4>
              <p className={styles.desc}>
                Pass us your email and we'll reach out as fast as we can!
              </p>
              <form action="" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    className={styles.input}
                    placeholder="ex. johndoe@gmail.com"
                  />
                </div>
                {success ? (
                  <p className={styles.success}>Success, email sent!</p>
                ) : null}
                {!emailResult.fetching ? (
                  email !== "" ? (
                    <input
                      className={styles.emailBtn}
                      type="submit"
                      value="Help me out!"
                    />
                  ) : null
                ) : (
                  <p className={styles.sending}>Sending...</p>
                )}
              </form>
            </div>
            <div className={styles.method}>
              <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
              <h4 className={styles.methodTitle}>Contact Page</h4>
              <p className={styles.desc}>
                Visit the contact page to send us a question!
              </p>
              <Link href="/contact">
                <button className={styles.contactBtn}>To Contact Page</button>
              </Link>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

Pricing.getLayout = (page) => {
  return <Layout title="Pricing - Edutech">{page}</Layout>;
};
export default Pricing;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let vid = false;
  let sid = false;
  if (req.cookies.hasOwnProperty("vid")) {
    vid = true;
  }
  if (req.cookies.hasOwnProperty("sid")) {
    sid = true;
  }
  return {
    props: { vid, sid },
  };
};
