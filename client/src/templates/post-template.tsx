import React from 'react';
import Layout from '@components/layout';
import { graphql } from 'gatsby';
import { Disqus } from 'gatsby-plugin-disqus';
import profilePic from '@images/profile-pic.jpg';
import Meta from '@components/meta';
import MetaOg from '@components/meta-og';
interface IPost {
  data: {
    markdownRemark: {
      html: string;
      frontmatter: {
        title: string;
      };
    };
  };
  pageContext: {
    id: string;
    slug: string;
  };
}

const PostTemplate = ({ data: post, pageContext }: IPost) => (
  <Layout>
    <h1>{post.markdownRemark.frontmatter.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.markdownRemark.html }} />
    {/* https://github.com/tterb/gatsby-plugin-disqus/issues/73 document.write violation in console */}
    <Disqus
      config={{
        url: `https://mkelley33.com${pageContext.slug}`,
        identifier: pageContext.id,
        title: post.markdownRemark.frontmatter.title,
      }}
    ></Disqus>
  </Layout>
);

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        description
      }
    }
  }
`;

interface IHead {
  location: {
    pathname: string;
  };
  data: {
    markdownRemark: {
      frontmatter: {
        title: string;
        description: string;
      };
    };
  };
}

export const Head = ({ location, data }: IHead) => {
  const { title: pageTitle, description } = data.markdownRemark.frontmatter;
  const title = `mkelley33 - ${pageTitle}`;
  const canonicalUrl = `https://mkelley33.com${location.pathname}`;
  return (
    <>
      <Meta title={title} description={description} canonicalUrl={canonicalUrl} />
      <MetaOg
        type="article"
        title={title}
        description={description}
        imageSecureUrl={`https://mkelley33.com${profilePic as string}`}
        url={canonicalUrl}
        siteName={'mkelley33, coding blog'}
      />
    </>
  );
};

export default PostTemplate;
