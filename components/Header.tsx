import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          Feed
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #0a9396;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: #0a9396;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === "loading") {
    left = (
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            Feed
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #0a9396;
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: #0a9396;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>Sign In</a>
        </Link>
        <style jsx>
          {`
            a {
              text-decoration: none;
              color: #e9d8a6;
              display: inline-block;
              background: #005f73;
              font-weight: bold;
            }

            a:hover {
              background: #0a9396;
            }

            a + a {
              margin-left: 1rem;
            }

            .right {
              margin-left: auto;
            }

            .right a {
              border: 1px solid var(--geist-foreground);
              padding: 0.75rem 1rem;
              border-radius: 5px;
            }
          `}
        </style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            Feed
          </a>
        </Link>
        <Link href="/drafts">
          <a className="bold" data-active={isActive("/drafts")}>
            My Drafts
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #005f73;
            display: inline-block;
          }

          a:hover {
            color: #0a9396;
          }

          .left a[data-active="true"] {
            color: #e9d8a6;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <button>
            <a>New Post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Sign Out</a>
        </button>
        <style jsx>
          {`
            a {
              text-decoration: none;
              color: #e9d8a6;
              background: #005f73;
              display: inline-block;
              font-weight: bold;
            }

            a:hover {
              background: #0a9396;
            }

            p {
              display: inline-block;
              padding-right: 1rem;
              font-size: 13px;
              background: #001219;
              color: #e9d8a6;
            }

            a + a {
              margin-left: 1rem;
            }

            .right {
              margin-left: auto;
            }

            .right a {
              border: 1px solid #;
              padding: 0.75rem 1rem;
              border-radius: 5px;
            }

            button {
              border: none;
              background: #001219;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>
        {`
          nav {
            display: flex;
            padding: 2rem;
            align-items: center;
          }
        `}
      </style>
    </nav>
  );
};

export default Header;
