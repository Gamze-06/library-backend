import React from "react";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className="container text-center">
      <h1 className={styles.animatedTitle}>Ana Sayfa</h1>
      <p className="lead fs-3 text-dark mt-4">
        Capstone Kütüphane Uygulamasına hoş geldiniz! <br />
        Kitaplar, yazarlar ve kategorilerle dolu zengin koleksiyonumuzu keşfedin.
      </p>
      <hr
        className="my-4"
        style={{ maxWidth: "200px", margin: "auto", borderColor: "#16a085", borderWidth: "6px" }}
      />
    </div>
  );
}

export default Home;
