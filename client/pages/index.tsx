import React, { useEffect } from "react";
import NavComponent from "../components/NavComponent";
import styles from "../styles/Home.module.scss";
import { useQuery } from "urql";
import { GetServerSideProps } from "next";
import Layout from "../components/layout";

const Me = `
  query {
    me {
      username
      tier
    }
  }

`;

function Home({ vid, sid }) {
  const [result, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching, error } = result;

  return (
    <section className={styles.mainSection}>
      <NavComponent sid={sid} data={fetching ? "" : data.me} vid={vid} />
    </section>
  );
}

Home.getLayout = (page) => {
  return <Layout title="Home - Edutech">{page}</Layout>;
};

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

export default Home;
