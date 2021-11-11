import React from 'react';
import { Navbar, Nav, Dropdown } from 'rsuite';
import { Auth } from 'aws-amplify';
import './index.css';
import { useHistory } from 'react-router';

function NavBar() {
  const history = useHistory();
  const [user, setUser] = React.useState();
  let rightTitle;
  if (!user) {
    Auth.currentAuthenticatedUser().then((userInfo) => {
      setUser(userInfo);
    });
    rightTitle=(<Nav.Item>Login</Nav.Item>);
  } else {
    rightTitle = (
      <Dropdown title="Profile" placement="bottomEnd">
        <Dropdown.Item onSelect={ async () => {
          history.push(`/${user.username}`)
        }}>My Channel</Dropdown.Item>
        <Dropdown.Item onSelect={ async () => {
          history.push(`/${user.username}/admin`)
        }}>Manage My Channel</Dropdown.Item>
        <Dropdown.Item onSelect={ async () => {
          Auth.signOut().then(()=> {
            console.log("Logged out");
            window.location.reload(false);
          });
        }}>Log out</Dropdown.Item>
    </Dropdown>
    );
  }
  return (
    <Navbar>
      <Navbar.Brand href="/">
        UnicornSports
      </Navbar.Brand>
      <Nav pullRight>
        {rightTitle}
      </Nav>
    </Navbar>
  );
}

export default NavBar;
