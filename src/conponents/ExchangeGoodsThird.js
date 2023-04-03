/* eslint-disable react/jsx-pascal-case */
import { Container, Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../App.css";
import TitleSec from "../elements/titleSec";
import TitleStep from "../elements/titleStep";
import Navbar from "../elements/navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import Accordion from 'react-bootstrap/Accordion';
import { faGift, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Qrcode_pic from "../elements/qrcode_pic";

const ExchangeGoodsThird = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  if (!user) {
    navigate("/signIn");
  }
  const { state } = useLocation();
  const QRcodeId = state ? state.QRcodeId : null;
  const donPageStyle = {
    marginTop: "70px",
  };
  const stepBtnStyle = {
    marginBottom: "0px",
    marginTop: "60px",
    textAlign: "center",
  };
  const returnStepStyle = {
    color: "#ffffff",
    backgroundColor: "#002B5B",
    borderRadius: "30px",
    border: "none",
    fontSize: "16px",
    width: "120px",
    textAlign: "center",
    height: "35px",
    fontWeight: "bold",
  };
  const card_2 = {
    marginBottom: "20px",
    marginLeft: "18%",
    padding: "30px 40px 30px 40px",
    color: "#002B5B",
    width: "65%",
    display: "flex",
    flexDirection: "row",
    textAlign: "center"
  };
  const h4Style = {
    fontWeight: "bold",
    lineHeight: "100px",
  };
  const btnStyle = {
    position: "absolute",
    marginTop: "40px",
    left: "50%",
    transform: `translate(${-50}%, ${-50}%)`,
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "15px",
    paddingRight: "15px",
    borderRadius: "10px",
    letterSpacing: "1px",
  };

  const contentStyle = {
    textAlign: "left",
    marginLeft: "30px",
    letterSpacing: "2px",
  };
  const goodsImgStyle = {
    width: "100px",
    height: "100px",
  };
  const card = {
    marginBottom: "20px",
    marginLeft: "5%",
    padding: "30px 40px 30px 40px",
    color: "#002B5B",
    width: "90%",
    display: "flex",
    flexDirection: "row",
  };

  const title_Btn = {
    color: "#002B5B",
    fontWeight: "600",
    letterSpacing: "2px"
  }

  const prove = {
    backgroundColor: "#26aa99",
    display: "inline-block",
    fontSize: "12px",
    padding: "3px",
    letterSpacing: "1px",
    fontWeight: "550",
    borderRadius: "5px",
    color: "white",
  };
  const prove2 = {
    backgroundColor: "#f6c23e",
    display: "inline-block",
    fontSize: "12px",
    padding: "3px",
    letterSpacing: "1px",
    fontWeight: "550",
    borderRadius: "5px",
  };
  const cardStyle = {
    width: "85%",
    color: "black",
    left: "50%",
    marginTop: "100px",
    transform: `translate(${-50}%, ${-5}%)`,
    paddingTop: "5%",
    paddingBottom: "6%",
    paddingLeft: "8%",
    paddingRight: "8%",
    letterSpacing: "1px",
  };


  const [tmp, setTmp] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "QRcode"),
      where("QRcodeId", "==", QRcodeId)
    );
    onSnapshot(q, (querySnapshot) => {
      setTmp(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, []);

  console.log(tmp);

  return (
    <div>
      <Navbar />
      <div style={donPageStyle}>
        <TitleSec name="兌換物資列表" color="#90AACB" />
        <Container>
          <TitleStep name="STEP3&nbsp;-&nbsp;生成兌換條碼" />


          {tmp.map((item, index) => (
            <div key={index}>
              {/* <p>兌換條碼ID：{item.QRcodeId}</p>
                <p>{<QRCode value={item.QRcodeId} />}</p>

                <hr /> */}
              <Card style={cardStyle}>
                <Card.Body>
                  <h4 style={h4Style}>一、兌換條碼：</h4>
                  <Card style={card_2}>
                    <Qrcode_pic QRcodeId={QRcodeId}></Qrcode_pic>
                  </Card>

                  <h4 style={h4Style}>二、兌換資訊：</h4>
                  {tmp.map((item, index) => (
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header><span style={title_Btn}>基本資料&nbsp;<FontAwesomeIcon icon={faList} /></span></Accordion.Header>
                        <Accordion.Body>

                          <Card.Body style={contentStyle}>
                            <Card.Title>
                              機構名稱：<b>{item.charityName}</b>
                            </Card.Title>

                            <hr></hr>
                            <Card.Text style={{ color: "#6C6C6C" }}>
                              結單日期：{item.QRcodeDate}
                              <br />
                              合作商家：{item.storeName}

                              <br />
                              兌換狀態：{item.status === "已領取" && (
                                <p style={prove}>{item.status}</p>
                              )}
                              {item.status === "未領取" && (
                                <p style={prove2}>{item.status}</p>
                              )}

                            </Card.Text>
                          </Card.Body>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header><span style={title_Btn}>商品明細&nbsp;<FontAwesomeIcon icon={faGift} /></span></Accordion.Header>
                        <Accordion.Body>
                          {/* 商品小卡 */}

                          {item.exchangeGoodsData.map((item2, index2) => (
                            <Card style={card} key={index2}>

                              <Card.Img
                                style={goodsImgStyle}
                                variant="top"
                                src={item2.goodsPicture}
                              />

                              <Card.Body style={contentStyle}>
                                <Card.Title>
                                  商品名稱：<b>{item2.goodsName}</b>
                                </Card.Title>
                                <hr></hr>
                                <Card.Text style={{ color: "#6C6C6C" }}>
                                  兌換數量：{item2.goodsNum}
                                  <br />
                                </Card.Text>
                              </Card.Body>

                            </Card>
                          ))}
                          {/* 商品小卡結束 */}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
                  <div style={stepBtnStyle}>
                    <Link to="/exchangeGoods">
                      <button style={returnStepStyle}>繼續兌換</button>
                    </Link>
                    <Link to="/AllQRcode">
                      <button style={{ ...returnStepStyle, marginLeft: "15px" }}>
                        我的兌換條碼
                      </button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}

        </Container>
      </div>
    </div>
  );
};

export default ExchangeGoodsThird;
