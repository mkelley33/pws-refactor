import { graphql, Link } from 'gatsby';
import { css } from '@emotion/react';
import Layout from '@components/layout';
import { ReactNode } from 'react';

interface INode {
  node: {
    id: string;
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
      date: ReactNode;
    };
    excerpt: string;
  };
}
interface IBlog {
  data: {
    allMarkdownRemark: {
      edges: INode[];
    };
  };
  pageContext: {
    currentPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    totalPages: number;
  };
}

const blogPostTitleCss = css`
  @media (max-width: 320px) {
    font-size: 1.25rem;
  }
`;

const BlogTemplate = ({ data, pageContext }: IBlog) => {
  const { currentPage, isFirstPage, isLastPage, totalPages } = pageContext;
  const nextPage = `/blog/${String(currentPage + 1)}`;
  const prevPage = currentPage - 1 === 1 ? '/blog' : `/blog/${String(currentPage - 1)}`;

  return (
    <Layout>
      <h1>Blog Posts</h1>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h2 css={blogPostTitleCss}>
            <Link to={`/posts${node.fields.slug}`}>{node.frontmatter.title}</Link> - {node.frontmatter.date}
          </h2>
          <p>{node.excerpt}</p>
        </div>
      ))}
      <div>
        {!isFirstPage && (
          <Link to={prevPage} rel="prev">
            Prev Page
          </Link>
        )}
        {totalPages !== 1 &&
          Array.from({ length: totalPages }, (_, index) => (
            <Link key={index} to={`/blog/${index === 0 ? '' : index + 1}`}>
              {index + 1}
            </Link>
          ))}
        {!isLastPage && (
          <Link to={nextPage} rel="next">
            Next page
          </Link>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!) {
    allMarkdownRemark(skip: $skip, limit: $limit, sort: { frontmatter: { date: DESC } }) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            title
            date(formatString: "dddd, MMMM Do YYYY")
          }
          excerpt
        }
      }
    }
  }
`;

export default BlogTemplate;
