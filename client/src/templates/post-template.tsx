import Layout from '@components/layout';
import { graphql } from 'gatsby';
import { Disqus } from 'gatsby-plugin-disqus';

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
      }
    }
  }
`;

export default PostTemplate;
