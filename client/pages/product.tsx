import { GetServerSideProps } from "next";
import React from "react";
import { useQuery } from "urql";
import Layout from "../components/layout";
import NavComponent from "../components/NavComponent";
import styles from "../styles/Product.module.scss";

const Me = `
  query {
    me {
      username
    }
  }

`;

function Product({ vid, sid }) {
  const [result, reexecuteMe] = useQuery({ query: Me });
  const { data, fetching, error } = result;

  return (
    <main className={styles.main}>
      <NavComponent vid={vid} sid={sid} data={fetching ? "" : data.me} />
    </main>
  );
}

Product.getLayout = (page) => {
  return <Layout title="Product - Edutech">{page}</Layout>;
};

export default Product;

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
