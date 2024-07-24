import { useRef, useEffect, useState } from "react";
import styles from "../static/css/UserStatusBar.module.css";
import { Avatar, Box, Button } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

import firebase from "firebase/compat/app";
import { UserInfo } from "../types/entities";

export default function UserStatusBar() {
  const [user, setUser] = useState<UserInfo>({ email: "", uid: "" });
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0); // Initial width or any default value

  useEffect(() => {
    onAuthStateChanged(firebase.auth(), (user) => {
      if (user?.email) {
        setUser({ email: user.email, uid: user.uid });
        localStorage.setItem("UserEmail", user.email);
      } else {
        setUser({ email: "", uid: "" });
        localStorage.setItem("UserEmail", "");
      }
    });
  }, []);

  useEffect(() => {
    if (buttonRef.current && user.email) {
      const emailWidth = buttonRef.current.scrollWidth;
      setButtonWidth(emailWidth);
    }
  }, [user.email]);

  return (
    <div className={styles.container}>
      {!user.email ? (
        <Link to="/Login">
          <Button width={100} height={30}>
            Login
          </Button>
        </Link>
      ) : (
        <Menu>
          <MenuButton
            px={2}
            width={buttonWidth + 40}
            height={30}
            transition="all 0.2s"
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            <Box ref={buttonRef} fontSize="15">
              {user.email}
            </Box>
          </MenuButton>
          <MenuList zIndex={100}>
            <Link to={"SavedReport"}>
              <MenuItem>Saved Reports</MenuItem>
            </Link>
            <MenuDivider />
            <Link to={"/"} replace>
              <MenuItem onClick={() => firebase.auth().signOut()}>
                Logout
              </MenuItem>
            </Link>
          </MenuList>
        </Menu>
      )}
    </div>
  );
}
