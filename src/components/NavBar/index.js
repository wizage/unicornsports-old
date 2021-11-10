import { Navbar, Nav, Dropdown } from 'rsuite';
import './index.css';

function NavBar() {
  return (
    <Navbar>
      <Navbar.Brand href="#">
        UnicornSports
      </Navbar.Brand>
      <Nav>
        <Nav.Item>Home</Nav.Item>
        <Nav.Item>My Channel</Nav.Item>
      </Nav>
      <Nav pullRight>
        <Dropdown title="Profile" placement="bottomEnd">
          <Dropdown.Item>My Channel</Dropdown.Item>
          <Dropdown.Item>Manage My Channel</Dropdown.Item>
          <Dropdown.Item>Log out</Dropdown.Item>
        </Dropdown>
      </Nav>
    </Navbar>
  );
}

export default NavBar;
