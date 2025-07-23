import React from "react";
import styles from "./Home.module.css";

// HOME PAGE SECTION

function Home() {
  return (
    <div className="container text-center">
      <h1 className={styles.animatedTitle}>Ana Sayfa</h1>
      <p className="lead fs-3 text-dark mt-4">
       <b>Capstone Kütüphane Uygulamasına <br />Hoş geldiniz!</b> <br/>
       <mark> <b>Kitaplar, yazarlar ve kategorilerle dolu zengin koleksiyonumuzu keşfedin.</b></mark>
      </p>
      <hr
        className="my-4"
        style={{ maxWidth: "400px", margin: "auto", borderColor: "#16a085", borderWidth: "4px" }}
      />
    </div>
  );
}

export default Home;
