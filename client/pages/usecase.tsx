import { GetServerSideProps } from "next";
import React from "react";
import { useQuery } from "urql";
import Layout from "../components/layout";
import NavComponent from "../components/NavComponent";
import styles from "../styles/Usecase.module.scss";

const Me = `
    query {
        me {
            username
        }
    }

`;

function Usecase({ sid, vid }) {
  const [result, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching, error } = result;

  return (
    <main className={styles.main}>
      <NavComponent data={fetching ? "" : data.me} vid={vid} sid={sid} />
    </main>
  );
}

Usecase.getLayout = (page) => {
  return <Layout title="Usecases - Edutech">{page}</Layout>;
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

export default Usecase;
