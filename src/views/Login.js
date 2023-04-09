import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { login, authFetch, useAuth } from "../AuthProvider.ts";
// import fetch from 'node-fetch'
// reactstrap components
import { Button, Card, CardHeader, Col } from "reactstrap";
import CompleteRegistration from "./modals/CompleteRegistration";
import { config } from "../config";

function Login(props) {
  // Boolean to check if user is logged in
  const [logged] = useAuth();

  // User information
  const [user, setUser] = useState({});

  // Registration completed flag
  // 2: Not checked, 1: Completed, 0: Not Completed
  const [completed, setCompleted] = useState(2);

  // Gets and stored the JWT
  const getToken = async (query, isMounted) => {
    try {
      let token;

      // query length of github is 20 and for google it is greater then 20
      // Weak point TODO: Find a better solution
      if (query.code.length <= 20) {
        token = await fetch(
          config.api +
            "/api/users/github/redirect?" +
            new URLSearchParams(query)
        );
      } else {
        token = await fetch(
          config.api +
            "/api/users/google/redirect?" +
            new URLSearchParams(query)
        );
      }

      token = await token.json();

      // Storing in the local storage
      login(token);

      // Checking if JWT is valid and getting user info from api
      let [completedTemp, user] = await checkJWT(isMounted);
      if (completedTemp) {
        setCompleted(1);
      } else {
        setCompleted(0);
        setUser(user);
      }
      // Toggles CompleteRegistration modal
      if (isMounted && !completedTemp) toggleModal();
    } catch (err) {
      console.log(err);
    }
  };

  const checkJWT = async (isMounted) => {
    try {
      let checkJWTtoken = await authFetch(
        config.api + "/api/users/checkJWTtoken"
      );
      checkJWTtoken = await checkJWTtoken.json();

      // if (isMounted) setUser(checkJWTtoken.user)

      // For navBar display picture and headers
      localStorage.setItem("image", checkJWTtoken.user.image);
      localStorage.setItem("firstName", checkJWTtoken.user.firstName);

      // If all fields are filled up sets complete flag true
      // Also checks if component is mounted before changing the state
      if (
        checkJWTtoken.user.username &&
        checkJWTtoken.user.email &&
        checkJWTtoken.user.firstName &&
        checkJWTtoken.user.lastName &&
        isMounted
      ) {
        // setCompleted(1)
        // setUser(checkJWTtoken.user)
        return [true, checkJWTtoken.user];
      } else {
        // setCompleted(0)
        // setUser(checkJWTtoken.user)
        return [false, checkJWTtoken.user];
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle for complete registration modal
  const [toggle, setToggle] = useState(false);
  const toggleModal = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    // mounted flag
    let isMounted = true;

    // Redirects user to dashboard if he/she has completed registration before
    if (logged) {
      checkJWT(isMounted);
    }

    // Parses the url to check for search query parameters
    const query = queryString.parse(props.location.search);

    // If it finds then token is generated and stored.
    if (query.code && isMounted) getToken(query, isMounted);

    return () => {
      isMounted = false;
    };
  });

  return (
    <>
      {/* OAuth Sign Page */}
      <Col lg="5" md="7">
        <CompleteRegistration
          toggle={toggle}
          toggleModal={() => toggleModal()}
          user={user}
          completed={completed}
          setCompleted={setCompleted}
        />
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href={`${config.api}/api/users/github/oauth`}
                // href="http://localhost:5000/api/users/github/oauth"
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../assets/icons/github.4ffd4fe7.svg")}
                  />
                </span>
                <span className="btn-inner--text">Github</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href={`${config.api}/api/users/google/oauth`}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("../assets/icons/google.87be59a1.svg")}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </Col>
    </>
  );
}

export default Login;
