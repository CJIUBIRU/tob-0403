import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "../elements/navbar";
import NavbarHome from "../elements/navbarHome";
import TitleSec from "../elements/titleSec";
import { Card, Container, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../utils/firebase";
import ProgressBar from "react-bootstrap/ProgressBar";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Stepper } from "react-form-stepper";

function Gain() {
  const [uuid, setUuid] = useState(uuidv4());
  const navigate = useNavigate("");
  const [user] = useAuthState(auth);
  if (!user) {
    navigate("/signIn");
  }

  const [progress, setProgress] = useState(0);
  const [urlID, setUrlID] = useState("");

  console.log(urlID);
  const formHandler = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
    console.log(file.name);

    e.preventDefault();
    try {
      // await setDoc(doc(db, "goodsDemand", user.uid), {
      await setDoc(doc(db, "gains", user.uid), {
        uid: user.uid,
        text: "",
        pic: "",
      });
      //navigate("/uploadGoodsSuccess");
      //alert("物資上架成功。");
    } catch (err) {
      console.log(err);
    }
  };
  const uploadFiles = (file) => {
    if (!file) return;
    // setUuid(uuidv4());
    const storageRef = ref(storage, `/Gains/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          //let urlID = url;
          return setUrlID(url);
        });
        console.log("progress: " + progress);
        //console.log("getDownloadURL.url: "+getDownloadURL.url);
      }
    );
  };

  return (
    <div>
      {user && <Navbar />}
      {!user && <NavbarHome />}
      <TitleSec name="愛心回饋" color="#90AACB" />
      <Container>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              backgroundColor: "#FFD2D2",
              textAlign: "center",
              // width: "300px",
              color: "#e74a3b",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            <FontAwesomeIcon
              style={{ marginRight: "5px" }}
              icon={faTriangleExclamation}
            />
            您尚有物資需求未回覆愛心回饋！（您的回覆能讓捐捐不息的愛心長流❤）
          </p>
        </div>

        <Stepper
          steps={[
            // { label: "開始" },
            { label: "上傳圖片" },
            { label: "填寫回饋心得" },
            { label: "完成" },
          ]}
          activeStep={0}
        />
        <Card style={{ width: "70%", marginLeft: "15%" }}>
          <form onSubmit={formHandler}>
            <FormControl
              style={{ margin: "40px", width: "90%" }}
              type="file"
              accept=".jpg, .png, .jpeg"
            />
            <button
              style={{
                color: "#ffffff",
                backgroundColor: "#90aacb",
                border: "none",
                borderRadius: "30px",
                fontSize: "16px",
                width: "120px",
                textAlign: "center",
                height: "35px",
                fontWeight: "bold",
                marginLeft: "43%",
                marginBottom: "20px",
              }}
              type="submit"
            >
              上傳&nbsp;
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </button>
            <ProgressBar
              style={{ margin: "20px 0px 30px 40px", width: "90%" }}
              now={progress}
              label={`${progress}%`}
            />
          </form>
          <div style={{ margin: "25px" }}>
            <ul>
              <p style={{ lineHeight: "25px" }}>
                <li>
                  檔案格式：以照片上傳，需保證照片清晰、色調正常，JPG檔、PNG檔均可。
                </li>
              </p>
              <p style={{ lineHeight: "25px" }}>
                <li>
                  注意事項：若顯示
                  <span style={{ color: "#002b5b", fontWeight: "bold" }}>
                    {" "}
                    " 100 % "{" "}
                  </span>
                  ，代表上傳成功，請按"下一步"。
                </li>
              </p>
            </ul>
          </div>
        </Card>
        <div>
          {/* {!progress && (
              <p
                style={{
                  width: "70%",
                  marginLeft: "15%",
                  border: "1px lightgray solid",
                  backgroundColor: "#F0F0F0",
                  color: "#adadad",
                  marginTop: "30px",
                  textAlign: "center",
                }}
              >
                尚未上傳
              </p>
            )}
            {progress && (
              <p
                style={{
                  width: "70%",
                  marginLeft: "15%",
                  border: "1px green solid",
                  backgroundColor: "#26aa99",
                  color: "white",
                  marginTop: "30px",
                  textAlign: "center",
                }}
              >
                Upload {progress} %
              </p>
            )} */}
        </div>
        <div style={{ marginLeft: "45%", marginTop: "60px", width: "auto", marginBottom: "50px" }}>
          {progress === 100 && (
            <Link to="/responseSec" state={{ fromID: uuid, fromURL: urlID }}>
              <button
                style={{
                  color: "#ffffff",
                  backgroundColor: "#002b5b",
                  borderRadius: "30px",
                  lineHeight: "30px",
                  fontSize: "16px",
                  width: "120px",
                  textAlign: "center",
                  height: "35px",
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                下一步
              </button>
            </Link>
            // <ButtonLink
            //   as={Link}
            //   to="/uploadGoodsSec"
            //   name="下一步"
            // ></ButtonLink>
          )}
          {progress !== 100 && (
            <Link
              to="/UploadGoodsSec"
              state={{ fromID: uuid, fromURL: getDownloadURL.URL }}
            >
              <button
                style={{
                  color: "#ffffff",
                  backgroundColor: "lightgray",
                  borderRadius: "30px",
                  lineHeight: "30px",
                  fontSize: "16px",
                  width: "120px",
                  textAlign: "center",
                  height: "35px",
                  fontWeight: "bold",
                  border: "none",
                  marginBottom: "50px",
                }}
              >
                下一步
              </button>
            </Link>
          )}
        </div>
        {/* </Card> */}
      </Container>
    </div>
  );
}

export default Gain;
