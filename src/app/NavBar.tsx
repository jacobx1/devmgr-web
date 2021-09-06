import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

interface NavBarProps {
  title: string;
  children: React.ReactNode;
}

export default function NavBar({ title, children }: NavBarProps) {
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Brand className="px-3">{title}</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">{children}</Navbar.Collapse>
    </Navbar>
  );
}
