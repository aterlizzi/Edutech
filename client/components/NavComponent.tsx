import styles from "../styles/Nav.module.scss";
import logo from "../public/logoHorizontal.png";
import Image from "next/image";
import Link from "next/link";
import { stringifyVariables, useMutation } from "urql";
import Router, { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCog,
  faFileUpload,
  faSignOutAlt,
  faTags,
  faDollarSign,
  faCreditCard,
  faClipboard,
  faAddressCard,
  faEnvelopeOpenText,
  faUserSecret,
  faUser,
  faSignInAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Burger from "@animated-burgers/burger-slip";
import { useState } from "react";

const Logout = `
    mutation {
        logout
    }

`;

function NavComponent({ data, vid, sid }) {
  const [result, logout] = useMutation(Logout);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    logout().then((result) => {
      if (result.error) {
      } else {
        Router.reload();
      }
    });
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <Image src={logo} />
          </div>
        </Link>
        <div className={styles.linkContainer}>
          <ul className={styles.list}>
            <li className={styles.link}>
              <Link href="/applications/product">Product</Link>
            </li>
            <li className={styles.link}>
              <Link href="/applications/pricing">Pricing</Link>
            </li>
            <li className={styles.link}>
              {!sid ? (
                <Link href="/applications/payments">Purchase</Link>
              ) : (
                <Link href="/applications/">Applications</Link>
              )}
            </li>
            <li className={styles.link}>
              <Link href="/about">About</Link>
            </li>
            <li className={styles.link}>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className={styles.accountContainer}>
          {!data ? (
            <div className={styles.signinContainer}>
              <p className={styles.accountText}>
                {!vid ? (
                  <Link href="/user/register">Sign in</Link>
                ) : (
                  <Link href="/user/login">Login</Link>
                )}
              </p>
              <span className={`${styles.chevron} ${styles.right}`}></span>
              <div className={styles.chevStick}></div>
            </div>
          ) : (
            <p className={styles.username}>
              {data.username}
              <FontAwesomeIcon
                className={styles.userIcon}
                icon={faChevronDown}
                size={"xs"}
              />
            </p>
          )}
          {!data ? null : (
            <div className={styles.dropdown}>
              <div className={styles.arrow}></div>
              <div className={styles.linkContainer}>
                <Link href="/user/dashboard">
                  <p className={styles.link}>
                    <FontAwesomeIcon
                      icon={faChartLine}
                      color={"rgba(white, 0.87)"}
                      className={styles.icon}
                    />
                    Dashboard
                  </p>
                </Link>
                <Link href="/user/settings">
                  <p className={styles.link}>
                    <FontAwesomeIcon
                      icon={faCog}
                      color={"rgba(white, 0.87)"}
                      className={styles.icon}
                    />
                    Settings
                  </p>
                </Link>
                <Link href="/applications/upload">
                  <p className={styles.link}>
                    <FontAwesomeIcon
                      icon={faFileUpload}
                      color={"rgba(white, 0.87)"}
                      className={styles.icon}
                    />
                    Upload App
                  </p>
                </Link>
                <p
                  onClick={handleClick}
                  className={`${styles.link} ${styles.specialLink}`}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    color={"rgba(white, 0.87)"}
                    className={styles.icon}
                  />
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        {!open ? (
          <Burger onClick={() => setOpen(!open)} className={styles.burger} />
        ) : (
          <Burger
            onClick={() => setOpen(!open)}
            isOpen={true}
            className={styles.burger}
          />
        )}
      </nav>
      <aside className={styles.aside}>
        <div
          className={
            open
              ? `${styles.mobileContainer} ${styles.active}`
              : styles.mobileContainer
          }
        >
          <header className={styles.header}>
            <Link href="/">
              <div className={styles.logo}>
                <Image src={logo}></Image>
              </div>
            </Link>
          </header>
          <section className={styles.menu}>
            <h3 className={styles.sectionLabel}>Menu</h3>
            <div className={styles.mList}>
              <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={faTags} className={styles.icon} />
                <FontAwesomeIcon icon={faDollarSign} className={styles.icon} />
                {!sid ? (
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className={styles.icon}
                  />
                ) : (
                  <FontAwesomeIcon icon={faClipboard} className={styles.icon} />
                )}
                <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
                <FontAwesomeIcon
                  icon={faEnvelopeOpenText}
                  className={styles.icon}
                />
              </div>
              <div className={styles.linkContainer}>
                <Link href="/applications/product">
                  <div className={styles.listItemContainer}>Product</div>
                </Link>
                <Link href="/applications/pricing">
                  <div className={styles.listItemContainer}>Pricing</div>
                </Link>
                {!sid ? (
                  <Link href="/applications/payments">
                    <div className={styles.listItemContainer}>Purchase</div>
                  </Link>
                ) : (
                  <Link href="/applications">
                    <div className={styles.listItemContainer}>Applications</div>
                  </Link>
                )}
                <Link href="/about">
                  <div className={styles.listItemContainer}>About</div>
                </Link>
                <Link href="/contact">
                  <div className={styles.listItemContainer}>Contact</div>
                </Link>
              </div>
            </div>
          </section>
          {data ? (
            <section className={styles.user}>
              <h3 className={styles.sectionLabel}>Utilities</h3>
              <div className={styles.mList}>
                <div className={styles.iconContainer}>
                  <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
                  <FontAwesomeIcon icon={faCog} className={styles.icon} />
                  <FontAwesomeIcon
                    icon={faFileUpload}
                    className={styles.icon}
                  />
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className={styles.icon}
                  />
                </div>
                <div className={styles.linkContainer}>
                  <Link href="/user/dashboard">
                    <div className={styles.listItemContainer}>Dashboard</div>
                  </Link>
                  <Link href="/user/settings">
                    <div className={styles.listItemContainer}>Settings</div>
                  </Link>
                  <Link href="/applications/upload">
                    <div className={styles.listItemContainer}>Upload App</div>
                  </Link>
                  <div
                    onClick={handleClick}
                    className={styles.listItemContainer}
                  >
                    Logout
                  </div>
                </div>
              </div>
            </section>
          ) : null}
          <section className={styles.account}>
            {data ? (
              <div className={styles.accountContainer}>
                <div className={styles.circle}>
                  <FontAwesomeIcon
                    icon={sid ? faUserSecret : faUser}
                    className={styles.userIcon}
                    size={"lg"}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.username}>{data.username}</h3>
                  <p className={styles.info}>{data.tier}</p>
                </div>
              </div>
            ) : (
              <div className={styles.loginContainer}>
                <Link href={vid ? `/user/login` : `/user/register`}>
                  <button className={styles.loginBtn}>
                    <FontAwesomeIcon
                      icon={faSignInAlt}
                      className={styles.loginIcon}
                    />
                    {vid ? "Login" : "Sign in"}
                  </button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}

export default NavComponent;
