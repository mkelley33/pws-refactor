import Layout from '@components/layout';
import { graphql } from 'gatsby';

interface IPost {
  data: {
    markdownRemark: {
      html: string;
      frontmatter: {
        title: string;
      };
    };
  };
}

const PostTemplate = ({ data: post }: IPost) => (
  <Layout>
    <h1>{post.markdownRemark.frontmatter.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.markdownRemark.html }} />
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
