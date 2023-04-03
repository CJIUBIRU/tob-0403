import React, { Component } from "react";
import { Stepper } from "react-form-stepper";
import Navbar from "../elements/navbar";
import { Container } from "react-bootstrap";
import TitleSec from "../elements/titleSec";
import { Card, FormControl } from "react-bootstrap";
import SuccessInfo from "../elements/successInfo";
import ButtonLink from "../elements/button"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router";

function ResponseSuccess() {
  const navigate = useNavigate("");
  const [user] = useAuthState(auth);
  if (!user) {
    navigate("/signIn");
  }
  const cardStyle = {
    width: "50%",
    color: "black",
    padding: "30px 100px 30px 100px",
    letterSpacing: "1px",
    marginLeft: "390px"
  };

  const btnStyle = {
    marginLeft: "200px",
    marginTop: "50px"
  };
  return (
    <div>
      <Navbar />
      <TitleSec name="愛心回饋" color="#90AACB" />
      <Container>
        <Stepper
          steps={[
            { label: "上傳圖片" },
            { label: "填寫回饋心得" },
            { label: "完成" },
          ]}
          activeStep={2}
        />
      </Container>
      <Card style={cardStyle}>
        <Card.Body>
          <SuccessInfo
            name="回饋上傳成功！"
            name2="捐捐不息感謝您的分享。"
          />

          <div style={btnStyle}>
            <ButtonLink to="/" name="回首頁" color="#002b5b" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResponseSuccess;
