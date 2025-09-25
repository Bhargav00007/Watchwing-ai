import React from "react";
import CardNav from "./CardNav";

const NavBar = () => {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        {
          label: "About Us",
          href: "/about",
          ariaLabel: "About Us",
        },
        {
          label: "Release Notes",
          href: "/about/releasenotes",
          ariaLabel: "Release Notes",
        },
      ],
    },
    {
      label: "Download",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Download",
          href: "/download",
          ariaLabel: "Download",
        },
        {
          label: "How to setup",
          href: "/downlaod/setup",
          ariaLabel: "How to setup",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        {
          label: "Email",
          href: "mailto:info@example.com",
          ariaLabel: "Email us",
        },
        {
          label: "Twitter",
          href: "https://twitter.com/example",
          ariaLabel: "Twitter",
        },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/company/example",
          ariaLabel: "LinkedIn",
        },
      ],
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
      }}
    >
      <CardNav
        logo={
          <span
            style={{
              fontSize: "1.2rem",
              color: "#fff",
              fontWeight: "semibold",
            }}
          >
            WatchWing AI
          </span>
        }
        logoAlt="WatchWing AI"
        items={items}
        baseColor="#292323ff"
        menuColor="#fff"
        buttonBgColor="#1a013aff"
        buttonTextColor="#fff"
        ease="power3.out"
      />
    </div>
  );
};

export default NavBar;
