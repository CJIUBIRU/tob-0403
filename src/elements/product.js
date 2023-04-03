import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "./button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import Slider from "react-slick";

function Task({ id, name, charity, quantity, description, store, price, pic }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [user] = useAuthState(auth);
  const card = {
    marginBottom: "20px",
    marginLeft: "10px",
    marginRight: "10px",
    padding: "45px 40px 10px 40px",
    height: "650px"
    // color: "#002B5B",
  };
  const contentStyle = {
    marginTop: "15px",
    marginBottom: "5px",
    textAlign: "center",
  };
  const demandHrefStyle = {
    color: "#90AACB",
  };
  const goodsImgStyle = {
    width: "200px",
    height: "200px",
    marginLeft: "20%",
  };
  const cardText = {
    color: "#6C6C6C",
    textAlign: "left",
    marginLeft: "3px",
  };
  const goDonateStyle = {
    marginTop: "15px",
    marginLeft: "30%",
  };
  const goDonateSecStyle = {
    marginTop: "15px",
    marginLeft: "20%",
  };
  return (
    <div>
      <Card style={card}>
        <Card.Img
          style={goodsImgStyle}
          variant="top"
          src={pic}
        />
        <Card.Body style={contentStyle}>
          <Card.Title>
            物資名稱：<b>{name}</b>
          </Card.Title>
          <hr></hr>
          <Card.Text style={cardText}>
            需求機構：{charity}
            <br />
            需求數量：10
            <br />
            需求說明：{description}
            <br />
            物資提供商家：
            <a style={demandHrefStyle} href="#">
              {store}
            </a>
            <br />
            單價：${price}／台
            {!user && (
              <div style={goDonateSecStyle}>
                <button
                  style={{
                    color: "#ffffff",
                    backgroundColor: "lightgray",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "16px",
                    width: "180px",
                    textAlign: "center",
                    height: "35px",
                    fontWeight: "bold",
                  }}
                >
                  登入後可加入捐贈箱
                </button>
              </div>
            )}
            {user && (
              <div style={goDonateStyle}>
                <Button color="#F58D59" to="/donate" name="加入捐贈箱" />
              </div>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

function Product() {
  const [details, setDetails] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "demand"));
    onSnapshot(q, (querySnapshot) => {
      setDetails(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);
  const settingsSec = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div>
      <Slider {...settingsSec}>
        {details.map((item) => (
          <Task
            id={item.id}
            name={item.data.name}
            charity={item.data.charity}
            quantity={item.data.quantity}
            description={item.data.description}
            store={item.data.store}
            price={item.data.price}
            pic={item.data.pic}
          />
        ))}
      </Slider>
    </div>
  );
}

export default Product;
