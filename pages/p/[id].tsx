// pages/p/[id].tsx

import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div className="textcolor">
        <h2>{title}</h2>
        <small>Written by {props?.author?.name || "Unknown author"}</small>
        <ReactMarkdown children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button className="publish" onClick={() => publishPost(props.id)}>
            Publish
          </button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button className="delete" onClick={() => deletePost(props.id)}>
            Delete
          </button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: #005f73;
          padding: 2rem;
          color: #001219;
        }

        .textcolor {
          text-color: #001219;
          background: #e9d8a6;
          padding: 2rem;
          border-radius: 5px;
        }

        .actions {
          margin-top: 2rem;
        }

        .publish {
          background: #005f73;
          color: #e9d8a6;
        }

        .delete {
          background: #ae2012;
          color: #e9d8a6;
        }

        .delete:hover {
          background: #bb3e03;
        }

        button {
          border: 0;
          padding: 1rem 2rem;
          font-weight: bold;
          margin-top: 5rem;
          border-radius: 3px;
        }

        .publish:hover {
          background: #0a9396;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
