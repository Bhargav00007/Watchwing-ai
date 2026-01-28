import {
  FacebookIcon,
  GithubIcon,
  Grid2X2Plus,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Image from "next/image";

export function MinimalFooter() {
  const year = new Date().getFullYear();

  const company = [
    {
      title: "About Us",
      href: "/about",
    },
    {
      title: "Contact Us",
      href: "/contact",
    },
    {
      title: "Documentation",
      href: "/about/documentation",
    },

    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <GithubIcon className="size-4" />,
      link: "https://github.com/Bhargav00007",
    },
    {
      icon: <InstagramIcon className="size-4" />,
      link: "https://www.instagram.com/_bhrgv._/",
    },
    {
      icon: <LinkedinIcon className="size-4" />,
      link: "https://www.linkedin.com/in/bhrgv07/",
    },
  ];
  return (
    <footer className="relative">
      <div className="bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-white/.1),transparent)] mx-auto max-w-5xl md:border-x border-[#111111]">
        {/* Top border line */}
        <div className="bg-[#111111] absolute inset-x-0 h-px w-full" />

        <div className="grid max-w-4xl grid-cols-6 gap-6 p-4">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4">
            <a href="#" className="w-max">
              <Image src="/assets/icon.png" alt="logo" width={40} height={40} />
            </a>

            <p className="text-[#D1D5DB] max-w-sm font-mono text-sm text-balance">
              Smarter Browsing with AI, Right on Your Screen.{" "}
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {socialLinks.map((item, i) => (
                  <a
                    key={i}
                    className="hover:bg-[#374151] rounded-md border border-[#374151] p-1.5 text-white hover:text-white transition-colors"
                    target="_blank"
                    href={item.link}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
              <a
                href="/download"
                className="w-max bg-[#1a013a] hover:bg-[#1a013a] rounded-md   px-4 py-3 text-white hover:text-white transition-colors text-sm font-medium"
              >
                Download Now
              </a>
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-2 lg:ml-30">
            <span className="text-[#9CA3AF] mb-1 text-xs font-medium">
              Company
            </span>
            <div className="flex flex-col gap-1 ">
              {company.map(({ href, title }, i) => (
                <a
                  key={i}
                  className={`w-max py-1 text-sm text-[#D1D5DB] duration-200 hover:text-white hover:underline`}
                  href={href}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Line above "All rights reserved" */}
        <div className="bg-[#111111] absolute inset-x-0 h-px w-full" />

        <div className="flex max-w-4xl flex-col justify-between gap-2 pt-2 pb-5 px-4">
          <p className="text-[#9CA3AF] text-center font-thin">
            ©{" "}
            <a
              href="https://x.com/sshahaider"
              className="hover:text-white transition-colors"
            >
              watchwing ai
            </a>
            . All rights reserved {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
